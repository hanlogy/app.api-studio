import { useContext } from 'react';
import { createContext } from 'react';
import { type StudioContextValue } from './types';

export const useStudioContext = () => {
  const context = useContext<StudioContextValue | null>(StudioContext);
  if (!context) {
    throw new Error('Context missing');
  }
  return context;
};

export const StudioContext = createContext<StudioContextValue | null>(null);
