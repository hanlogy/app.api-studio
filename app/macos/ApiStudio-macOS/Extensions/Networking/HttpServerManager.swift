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
    if servers[p] != nil { return }

    let server = HttpServer(port: p) { [weak self] event in
      self?.sendEvent(withName: "onRequest", body: event)
    }

    servers[p] = server
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
    ["onRequest"]
  }
}
