export type PrimitiveType = string | number | boolean | null;

export type PrimitiveRecord<T extends PrimitiveType = PrimitiveType> = Record<
  string,
  T
>;

/**
 *  All possible values that can be parsed from a JSON string.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | {[key: string]: JsonValue};

/**
 * A JSON object parsed from a string (key-value structure).
 */
export type JsonRecord = Record<string, JsonValue>;

export type VariableDefinitionKey = `:${string}`;
export type VariableDefinitions = Record<
  VariableDefinitionKey,
  PrimitiveRecord
>;

//
export type ValuesMap = PrimitiveRecord;
