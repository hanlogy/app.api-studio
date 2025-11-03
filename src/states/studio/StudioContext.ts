import { createContext } from 'react';
import { StudioContextValue } from './types';

export const StudioContext = createContext<StudioContextValue | null>(null);
