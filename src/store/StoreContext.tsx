import React, { createContext, useContext, ReactNode } from 'react';
import { useStore } from './useStore';
import { AppState } from '../types';

type StoreContextType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  resetData: () => void;
  exportData: () => void;
  user: any;
  loading: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within a StoreProvider');
  }
  return context;
}
