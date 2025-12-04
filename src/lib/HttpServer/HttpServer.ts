import { NativeModules, NativeEventEmitter } from 'react-native-macos';
import { Buffer } from 'buffer';

import type { RequestEvent, ErrorEvent } from './definitions';
import type { MockServer } from '@/definitions';

import { parseHttpRequest } from './parseHttpRequest';
import { processRequest } from './processRequest';
import { serializeServerResponse } from './serializeServerResponse';
import { normalizePath } from '@/helpers/pathHelpers';

const { HttpServerManager } = NativeModules;
const eventEmitter = new NativeEventEmitter(HttpServerManager);

export class HttpServer {
  private readonly config: MockServer;
  private readonly port: number;
  private readonly workspaceDir: string;
  private readonly p12File?: string;
  private readonly p12Password?: string;
  private subscriptions: { remove: () => void }[] = [];
  private buffers = new Map<string, Buffer>();

  constructor({
    workspaceDir,
    config,
  }: {
    readonly workspaceDir: string;
    readonly config: MockServer;
  }) {
    this.workspaceDir = workspaceDir;
    this.config = config;
    this.port = config.port;

    if (config.https) {
      this.p12File = config.https.p12File;
      this.p12Password = config.https.p12Password;
    }
  }

  start() {
    const p12Path =
      this.p12File &&
      normalizePath([this.workspaceDir, this.p12File].join('/'));

    HttpServerManager.startServer({
      port: this.port,
      p12Path,
      p12Password: this.p12Password,
    });

    this.subscriptions.push(
      eventEmitter.addListener('onRequest', (event: RequestEvent) => {
        this.handleRequestChunk(event).catch(err => {
          console.warn('HttpServer handleRequestChunk error:', err);
        });
      }),
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

  private async handleRequestChunk(event: RequestEvent) {
    const { connectionId, chunk } = event;

    const incoming = Buffer.from(chunk);
    const prev = this.buffers.get(connectionId) ?? Buffer.alloc(0);
    const combined = Buffer.concat([prev, incoming]);

    const parsed = parseHttpRequest(combined);

    if (!parsed) {
      // headers not complete or body not fully received yet
      this.buffers.set(connectionId, combined);
      return;
    }

    this.buffers.delete(connectionId);

    const { delay, response } = await processRequest({
      request: parsed,
      routes: this.config.routes,
      globalHeaders: this.config.headers,
    });

    const send = () => {
      HttpServerManager.sendResponse({
        port: this.port,
        connectionId,
        response: serializeServerResponse(response),
      });
    };

    if (!delay || delay < 0) {
      send();
    } else {
      setTimeout(send, delay);
    }
  }
}
