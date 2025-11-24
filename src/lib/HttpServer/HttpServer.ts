import { NativeModules, NativeEventEmitter } from 'react-native-macos';
import type { ErrorEvent, RequestEvent } from './definitions';
import { Buffer } from 'buffer';
import type { MockServer } from '@/definitions';

const { HttpServerManager } = NativeModules;

const eventEmitter = new NativeEventEmitter(HttpServerManager);

export class HttpServer {
  private readonly port: number;
  private readonly workspaceDir: string;
  private readonly p12File?: string;
  private readonly p12Password?: string;
  private subscriptions: { remove: () => void }[] = [];
  private buffers = new Map<string, Buffer>();

  constructor({
    workspaceDir,
    config: { port, https },
  }: {
    readonly workspaceDir: string;
    readonly config: MockServer;
  }) {
    this.port = port;
    this.workspaceDir = workspaceDir;
    if (https) {
      this.p12File = https.p12File;
      this.p12Password = https.p12Password;
    }
  }

  start() {
    const p12Path = [this.workspaceDir, this.p12File]
      .join('/')
      .replace(/\/+/g, '/');

    HttpServerManager.startServer({
      port: this.port,
      p12Path,
      p12Password: this.p12Password,
    });

    this.subscriptions.push(
      eventEmitter.addListener('onRequest', (event: RequestEvent) =>
        this.handleRequestChunk(event),
      ),
    );

    this.subscriptions.push(
      eventEmitter.addListener('onError', (event: ErrorEvent) => {
        console.warn('HttpServer error:', event);
      }),
    );
  }

  stop() {
    HttpServerManager.stopServer({ port: this.port });
    this.subscriptions.forEach(s => s.remove());
    this.subscriptions = [];
    this.buffers.clear();
  }

  private handleRequestChunk(event: RequestEvent) {
    const { connectionId, chunk } = event;
    const incoming = Buffer.from(chunk);
    const prev = this.buffers.get(connectionId) ?? Buffer.alloc(0);
    const combined = Buffer.concat([prev, incoming]);

    const headerEnd = combined.indexOf('\r\n\r\n');
    if (headerEnd === -1) {
      this.buffers.set(connectionId, combined);
      return;
    }

    // For now, ignore body (no Content-Length handling)
    const requestText = combined.toString('utf8', 0, headerEnd + 4);
    console.log('Received request:\n', requestText);

    // Build a simple response
    const body = 'Hello from ApiStudio macOS local server';
    const response =
      'HTTP/1.1 200 OK\r\n' +
      `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n` +
      'Content-Type: text/plain; charset=utf-8\r\n' +
      'Connection: close\r\n' +
      '\r\n' +
      body;

    HttpServerManager.sendResponse({
      port: this.port,
      connectionId,
      response,
    });

    this.buffers.delete(connectionId);
  }
}
