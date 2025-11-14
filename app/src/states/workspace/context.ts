import { useContext } from 'react';
import { createContext } from 'react';
import { type WorkspaceContextValue } from './types';

export const useWorkspaceContext = () => {
  return useContext<WorkspaceContextValue | null>(WorkspaceContext)!;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
  null,
);
