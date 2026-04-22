'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarAction {
  label: string;
  onClick: () => void;
}

export interface SnackbarMessage {
  id: string;
  type: SnackbarType;
  message: string;
  action?: SnackbarAction;
  duration?: number;
}

interface SnackbarContextType {
  show: (msg: Omit<SnackbarMessage, 'id'>) => void;
  hide: (id: string) => void;
  messages: SnackbarMessage[];
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const hide = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const show = useCallback((msg: Omit<SnackbarMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newMessage = { ...msg, id };
    
    setMessages((prev) => [...prev, newMessage]);

    if (msg.duration !== 0) {
      setTimeout(() => hide(id), msg.duration || 5000);
    }
  }, [hide]);

  const showSnackbar = useCallback((message: string, type: SnackbarType = 'info', duration?: number) => {
    show({ message, type, duration });
  }, [show]);

  return (
    <SnackbarContext.Provider value={{ show, hide, messages, showSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
