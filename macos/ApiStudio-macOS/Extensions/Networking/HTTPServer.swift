//
//  HttpServer.swift
//  ApiStudio-macOS
//
//  Created by Zhiguang Chen on 2025-11-18.
//

import Foundation
import Network
import Security

enum HttpServerError: Error {
  case tlsIdentityLoadFailed
}

final class HttpServer {
  private let port: Int
  internal let listener: NWListener
  private var connections: [String: NWConnection] = [:]
  private let emit: ([String: Any]) -> Void
  private let queue: DispatchQueue

  init(
    port: Int,
    emit: @escaping ([String: Any]) -> Void,
    p12Path: String?,
    password: String?
  ) throws {
    self.port = port
    self.emit = emit
    self.queue = DispatchQueue(label: "HttpServer.\(port)")

    let params: NWParameters

    if let p12Path = p12Path {
      let tlsOptions = try HttpServer.makeTLSOptions(
        p12Path: p12Path,
        password: password
      )
      params = NWParameters(tls: tlsOptions, tcp: NWProtocolTCP.Options())
    } else {
      params = NWParameters.tcp
    }

    params.allowLocalEndpointReuse = true

    self.listener = try NWListener(
      using: params,
      on: NWEndpoint.Port(rawValue: UInt16(port))!
    )
  }

  private static func makeTLSOptions(
    p12Path: String,
    password: String?
  ) throws -> NWProtocolTLS.Options {
    let url = URL(fileURLWithPath: p12Path)
    let data = try Data(contentsOf: url)

    var importOptions: [String: Any] = [:]
    if let password = password {
      importOptions[kSecImportExportPassphrase as String] = password
    }

    var items: CFArray?
    let status = SecPKCS12Import(
      data as CFData,
      importOptions as CFDictionary,
      &items
    )

    guard
      status == errSecSuccess,
      let array = items as? [[String: Any]],
      let cfIdentity = array.first?[kSecImportItemIdentity as String]
        as? CFTypeRef,
      CFGetTypeID(cfIdentity) == SecIdentityGetTypeID()
    else {
      throw HttpServerError.tlsIdentityLoadFailed
    }

    let identity = cfIdentity as! SecIdentity
    guard let secIdentity = sec_identity_create(identity) else {
      throw HttpServerError.tlsIdentityLoadFailed
    }

    let tlsOptions = NWProtocolTLS.Options()
    sec_protocol_options_set_local_identity(
      tlsOptions.securityProtocolOptions,
      secIdentity
    )

    return tlsOptions
  }

  func start() {
    listener.newConnectionHandler = { [weak self] connection in
      self?.handleConnection(connection)
    }

    listener.start(queue: queue)
  }

  func stop() {
    queue.async {
      self.listener.cancel()
      self.connections.values.forEach { $0.cancel() }
      self.connections.removeAll()
    }
  }

  private func handleConnection(_ connection: NWConnection) {
    let id = UUID().uuidString
    connections[id] = connection

    connection.stateUpdateHandler = { [weak self] newState in
      guard let self else { return }
      self.queue.async {
        if case .failed(_) = newState {
          self.connections.removeValue(forKey: id)
        }
      }
    }

    connection.start(queue: queue)
    receive(on: connection, id: id)
  }

  private func receive(on connection: NWConnection, id: String) {
    connection.receive(
      minimumIncompleteLength: 1,
      maximumLength: 65536
    ) { [weak self] data, _, isEOF, error in

      guard let self else { return }

      self.queue.async {
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
  }

  func send(connectionId: String, data: Data) {
    queue.async {
      guard let connection = self.connections[connectionId] else { return }

      // Do not cancel here, leave the connection open for the client to close
      connection.send(content: data, completion: .contentProcessed { _ in })
    }
  }
}
