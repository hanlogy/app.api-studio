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
  func startServer(_ options: NSDictionary) {
    let port = (options["port"] as? NSNumber)?.intValue ?? 0
    let p12Path = options["p12Path"] as? String
    let p12Password = options["p12Password"] as? String

    if servers[port] != nil {
      sendEvent(
        withName: "onError",
        body: [
          "port": port,
          "error": "alreadyRunning",
        ]
      )

      return
    }

    do {
      let server = try HttpServer(
        port: port,
        emit: { [weak self] event in
          self?.sendEvent(withName: "onRequest", body: event)
        },
        p12Path: p12Path,
        password: p12Password
      )

      server.listener.stateUpdateHandler = { [weak self] state in
        guard let self else { return }

        DispatchQueue.main.async {
          switch state {
          case .ready:
            self.servers[port] = server

          case .failed(let error):
            var errorCode = "startFailed"
            if case .posix(let errno) = error, errno == .EADDRINUSE {
              errorCode = "portInUse"
            }

            self.sendEvent(
              withName: "onError",
              body: [
                "port": port,
                "error": errorCode,
              ]
            )
            server.listener.cancel()

          default: break
          }
        }
      }

      server.start()
    } catch {
      var errorCode = "failedToCreateListener"
      if error is HttpServerError {
        errorCode = "invalidCertificate"
      }

      sendEvent(
        withName: "onError",
        body: [
          "port": port,
          "error": errorCode,
        ]
      )
    }
  }

  @objc
  func stopServer(_ options: NSDictionary) {
    let port = (options["port"] as? NSNumber)?.intValue ?? 0
    servers[port]?.stop()
    servers.removeValue(forKey: port)
  }

  @objc
  func sendResponse(_ options: NSDictionary) {
    let port = (options["port"] as? NSNumber)?.intValue ?? 0
    let connectionId = options["connectionId"] as? String ?? ""
    let response = options["response"] as? String ?? ""

    servers[port]?.send(
      connectionId: connectionId,
      data: Data(response.utf8)
    )
  }

  // Called by RN when the bridge is invalidated (e.g. on reload)
  override func invalidate() {
    for server in servers.values {
      server.stop()
    }
    
    servers.removeAll()
    super.invalidate()
  }

  override func supportedEvents() -> [String] {
    return ["onRequest", "onError"]
  }
}
