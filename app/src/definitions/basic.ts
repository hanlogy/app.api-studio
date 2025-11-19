import type { TextStyle, ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native-macos';
import type { navNames } from './constants';

export type NavName = (typeof navNames)[number];
export type PrimitiveValue = string | number | boolean | null;

export type PrimitiveRecord<T extends PrimitiveValue = PrimitiveValue> = Record<
  string,
  T
>;

/**
 *  All possible values that can be parsed from a JSON string.
 */
export type JsonValue =
  | PrimitiveValue
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * A JSON object parsed from a string (key-value structure).
 */
export type JsonRecord = Record<string, JsonValue>;

export type VariableDefinitionKey = `:${string}`;
export type VariableDefinitions = Record<VariableDefinitionKey, PrimitiveValue>;

//
export type ValuesMap = PrimitiveRecord;

export type PropsWithViewStyle<P = unknown> = P & {
  style?: StyleProp<ViewStyle>;
};

export type PropsWithTextStyle<P = unknown> = P & {
  style?: StyleProp<TextStyle>;
};
