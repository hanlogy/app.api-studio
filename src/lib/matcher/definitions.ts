import type { PrimitiveValue } from '@/definitions';

export type Pattern =
  | PrimitiveValue
  | Matcher
  | Pattern[]
  | { [key: string]: Pattern };

// Brand
export const MATCHER = Symbol('mock.matcher');

export interface Matcher {
  readonly $$typeof: typeof MATCHER;
  readonly name: string;
  test(actual?: unknown): boolean;
}

export type AnyConstructorName =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Array'
  | 'Object';
