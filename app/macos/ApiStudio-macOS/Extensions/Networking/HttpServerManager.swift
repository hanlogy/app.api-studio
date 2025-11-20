//
//  HttpServerManager.swift
//  ApiStudio-macOS
//
//  Created by Zhiguang Chen on 2025-11-19.
//

import Foundation
import React

@objc(HttpServerManager)
class HttpServerManager: RCTEventEmitter {

  private var servers: [Int: HttpServer] = [:]

  @objc
  func startServer(_ port: NSNumber) {
    let portNumber = port.intValue

    if servers[portNumber] != nil {
      sendEvent(
        withName: "onError",
        body: [
          "port": portNumber,
          "error": "alreadyRunning",
        ]
      )

      return
    }

    do {
      let server = try HttpServer(
        port: portNumber,
        emit: { [weak self] event in
          self?.sendEvent(withName: "onRequest", body: event)
        }
      )

      server.listener.stateUpdateHandler = { [weak self] state in
        guard let self else { return }

        switch state {

        case .ready:
          self.servers[portNumber] = server

        case .failed(let error):
          let errorCode: String

          if case .posix(let errno) = error,
            errno == .EADDRINUSE
          {
            errorCode = "portInUse"
          } else {
            errorCode = "startFailed"
          }

          self.sendEvent(
            withName: "onError",
            body: [
              "port": portNumber,
              "error": errorCode,
            ]
          )

          server.listener.cancel()

        default:
          break
        }
      }

      server.start()
    } catch {
      sendEvent(
        withName: "onError",
        body: [
          "port": portNumber,
          "error": "failedToCreateListener",
        ]
      )
    }
  }

  @objc
  func stopServer(_ port: NSNumber) {
    let portNumber = port.intValue
    servers[portNumber]?.stop()
    servers.removeValue(forKey: portNumber)
  }

  @objc
  func sendResponse(
    _ port: NSNumber,
    connectionId: String,
    response: String
  ) {
    let portNumber = port.intValue
    servers[portNumber]?.send(
      connectionId: connectionId,
      data: Data(response.utf8)
    )
  }

  override func supportedEvents() -> [String] {
    return ["onRequest", "onError"]
  }
}
