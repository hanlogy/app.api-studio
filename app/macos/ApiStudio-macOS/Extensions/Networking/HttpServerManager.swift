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
    let p = port.intValue

    if servers[p] != nil {
      sendEvent(
        withName: "onError",
        body: [
          "port": p,
          "error": "alreadyRunning",
        ]
      )
      return
    }

    let server = HttpServer(
      port: p,
      emit: { [weak self] event in
        self?.sendEvent(withName: "onRequest", body: event)
      },
    )

    server.listener.stateUpdateHandler = { [weak self] state in
      guard let self else { return }

      switch state {

      case .ready:
        self.servers[p] = server

      case .failed(_):
        self.sendEvent(
          withName: "onError",
          body: [
            "port": p,
            "error": "portInUse",
          ]
        )

      default:
        break
      }
    }

    server.start()
  }

  @objc
  func stopServer(_ port: NSNumber) {
    let p = port.intValue
    servers[p]?.stop()
    servers.removeValue(forKey: p)
  }

  @objc
  func sendResponse(
    _ port: NSNumber,
    connectionId: String,
    response: String
  ) {
    let p = port.intValue
    servers[p]?.send(
      connectionId: connectionId,
      data: Data(response.utf8)
    )
  }

  override func supportedEvents() -> [String] {
    return ["onRequest", "onError"]
  }
}
