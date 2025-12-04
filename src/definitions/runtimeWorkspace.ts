import type { PrimitiveValue, ValuesMap } from './common';
import type { RequestKey } from './workspace';

export type RuntimeVariable =
  | {
      readonly type: 'environment' | 'collection';
      readonly key: string;
      readonly name: string;
      readonly value: PrimitiveValue;
    }
  | {
      readonly type: 'request';
      readonly key: RequestKey;
      readonly name: string;
      readonly value: PrimitiveValue;
    };

export interface RuntimeWorkspace {
  readonly environments?: readonly RuntimeWorkspaceEnvironment[];
  readonly collections?: readonly RuntimeCollection[];
}

export interface RuntimeWorkspaceEnvironment {
  readonly name: string;
  readonly valuesMap?: ValuesMap;
}

interface RuntimeCollection {
  readonly key: string;
  readonly valuesMap?: ValuesMap;
  readonly requests?: readonly RuntimeRequest[];
}

interface RuntimeRequest {
  readonly key: RequestKey;
  readonly valuesMap?: ValuesMap;
}
