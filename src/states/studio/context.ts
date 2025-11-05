import { useContext } from 'react';
import { createContext } from 'react';
import { type StudioContextValue } from './types';

export const useStudioConext = () => {
  return useContext<StudioContextValue | null>(StudioContext)!;
};

export const StudioContext = createContext<StudioContextValue | null>(null);
