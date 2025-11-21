export interface RequestEvent {
  readonly port: number;
  readonly connectionId: string;
  readonly chunk: number[];
}

export interface ErrorEvent {
  readonly port: number;
  readonly error: string;
}