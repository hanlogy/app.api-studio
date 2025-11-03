import { useContext } from 'react';
import { StudioContext } from './StudioContext';
import { type StudioContextValue } from './types';

export const useStudioConext = () => {
  return useContext<StudioContextValue | null>(StudioContext)!;
};
