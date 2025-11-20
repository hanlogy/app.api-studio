//
//  HttpServer.swift
//  ApiStudio-macOS
//
//  Created by Zhiguang Chen on 2025-11-18.
//

import Foundation
import Network

class HttpServer {
  private let port: Int
  private let listener: NWListener
  private var connections: [String: NWConnection] = [:]
  private let emit: ([String: Any]) -> Void

  init(port: Int, emit: @escaping ([String: Any]) -> Void) {
    self.port = port
    self.emit = emit
    self.listener = try! NWListener(
      using: .tcp,
      on: NWEndpoint.Port(rawValue: UInt16(port))!
    )
  }

  func start() {
    listener.newConnectionHandler = { [weak self] connection in
      self?.handleConnection(connection)
    }
    listener.start(queue: .global())
  }

  func stop() {
    listener.cancel()
    connections.values.forEach { $0.cancel() }
    connections.removeAll()
  }

  private func handleConnection(_ connection: NWConnection) {
    let id = UUID().uuidString
    connections[id] = connection

    connection.stateUpdateHandler = { [weak self] newState in
      if case .failed(_) = newState {
        self?.connections.removeValue(forKey: id)
      }
    }

    connection.start(queue: .global())
    self.receive(on: connection, id: id)
  }

  private func receive(on connection: NWConnection, id: String) {
    connection.receive(
      minimumIncompleteLength: 1,
      maximumLength: 65536
    ) { [weak self] data, _, isEOF, error in

      guard let self else { return }

      if let d = data, !d.isEmpty {
        self.emit([
          "port": self.port,
          "connectionId": id,
          "chunk": Array(d),
        ])
      }

      if isEOF || error != nil {
        connection.cancel()
        self.connections.removeValue(forKey: id)
        return
      }

      self.receive(on: connection, id: id)
    }
  }

  func send(connectionId: String, data: Data) {
    guard let connection = connections[connectionId] else { return }

    // Do not cancel here — wait for EOF from client
    connection.send(content: data, completion: .contentProcessed { _ in })
  }
}
