import { createContext, useContext } from 'react';

/** Where overlays render: the whole viewport, or locally inside a device frame. */
export const ScopeContext = createContext<'viewport' | 'local'>('viewport');
export const useScope = () => useContext(ScopeContext);
