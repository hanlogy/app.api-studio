interface Workshop {
  readonly name: string;
  readonly path: string;
}

export interface StudioState {
  readonly currentWorkshopPath: string;
  readonly workshops: readonly Workshop[];
}
