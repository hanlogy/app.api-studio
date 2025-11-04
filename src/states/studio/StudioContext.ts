import { createContext } from 'react';
import { type StudioContextValue } from './types';

export const StudioContext = createContext<StudioContextValue | null>(null);
