import { isSameDepsGraph } from './dataComparison';
import type { DepsGraph } from './types';

/**
 * Build reverse dependency graph from forwardDeps.
 *
 * forwardDeps:  A -> {B, C}  (A references B and C)
 * reverseDeps:  B -> {A}, C -> {A}
 *
 * Notes:
 * - Includes keys for both:
 *   - every "from" file in forwardDeps
 *   - every referenced "to" file (even if missing/unloaded)
 * - Always returns a Set for any key present in the graph (possibly empty).
 */
export function buildReverseDeps(
  forwardDeps: DepsGraph,
  {
    previousForwardDeps,
    previousReverseDeps,
  }: {
    previousForwardDeps?: DepsGraph;
    previousReverseDeps?: DepsGraph;
  } = {},
): DepsGraph {
  if (
    previousForwardDeps &&
    previousReverseDeps &&
    isSameDepsGraph(forwardDeps, previousForwardDeps)
  ) {
    return previousReverseDeps;
  }

  const reverseDeps = new Map<string, Set<string>>();

  const ensure = (path: string): Set<string> => {
    let set = reverseDeps.get(path);
    if (!set) {
      set = new Set<string>();
      reverseDeps.set(path, set);
    }
    return set;
  };

  for (const [from, refs] of forwardDeps) {
    // ensure "from" exists in reverse graph even if nobody references it
    ensure(from);

    for (const to of refs) {
      ensure(to).add(from);
    }
  }

  return reverseDeps;
}
