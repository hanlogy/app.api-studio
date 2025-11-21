import type { RequestMethod } from './workspace';

export * from './constants';
export * from './basic';
export * from './workspace';
export * from './AppError';

type MockServerRouteBase =
  | {
      readonly method: RequestMethod | 'ALL';
      readonly path: string;
    }
  | {
      readonly method: RequestMethod | 'ALL';
      readonly pathMatch: RegExp;
    };

export type MockServerRoute =
  | (MockServerRouteBase & {
      readonly status?: number;
      readonly delay?: number;
    })
  | (MockServerRouteBase & {
      readonly forward: string;
    })
  | (MockServerRouteBase & {
      readonly delay?: number;
      readonly file: string;
    });

export interface MockServerConfig {
  readonly name: string;
  readonly port: number;
  readonly https?: {
    readonly p12File: string;
    readonly p12Password?: string;
  };
  readonly headers?: Record<string, string>;
  readonly routes?: readonly MockServerRoute[];
}
