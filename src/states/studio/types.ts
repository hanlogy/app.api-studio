interface Workshop {
  readonly name: string;
  readonly path: string;
}

export type StudioState =
  | {
      readonly isReady: false;
    }
  | {
      readonly isReady: true;
      readonly currentWorkshopPath: string;
      readonly workshops: readonly Workshop[];
    };
