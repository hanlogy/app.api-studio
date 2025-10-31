import type {PrimitiveRecord, VariableDefinitions} from '@/definitions';

export type RawEnvironment = {
  readonly headers?: PrimitiveRecord;
} & VariableDefinitions;

export interface RawWorkspaceConfig {
  readonly name: string;
  readonly description: string;
  readonly environments: Record<string, RawEnvironment>;
}
