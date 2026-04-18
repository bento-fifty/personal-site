'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ComposeState = 'min' | 'normal' | 'expanded';

interface Ctx {
  state: ComposeState;
  suppressed: boolean;
  open: () => void;
  minimize: () => void;
  expand: () => void;
  restore: () => void;
  toggle: () => void;
  setSuppressed: (v: boolean) => void;
}

const ContactComposeCtx = createContext<Ctx | null>(null);

export function useContactCompose(): Ctx {
  const v = useContext(ContactComposeCtx);
  if (!v) throw new Error('useContactCompose must be used inside <ContactComposeProvider>');
  return v;
}

export function ContactComposeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ComposeState>('min');
  const [suppressed, setSuppressed] = useState(false);

  const open = useCallback(() => setState('normal'), []);
  const minimize = useCallback(() => setState('min'), []);
  const expand = useCallback(() => setState('expanded'), []);
  const restore = useCallback(() => setState('normal'), []);
  const toggle = useCallback(() => setState((s) => (s === 'min' ? 'normal' : 'min')), []);

  const value = useMemo<Ctx>(
    () => ({ state, suppressed, open, minimize, expand, restore, toggle, setSuppressed }),
    [state, suppressed, open, minimize, expand, restore, toggle],
  );

  return <ContactComposeCtx.Provider value={value}>{children}</ContactComposeCtx.Provider>;
}
