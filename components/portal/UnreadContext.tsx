"use client";

import { createContext, useContext, useState } from "react";

interface UnreadContextValue {
  unread: number;
  setUnread: (n: number) => void;
}

const UnreadContext = createContext<UnreadContextValue>({
  unread: 0,
  setUnread: () => {},
});

export function UnreadProvider({
  initial,
  children,
}: {
  initial: number;
  children: React.ReactNode;
}) {
  const [unread, setUnread] = useState(initial);
  return (
    <UnreadContext.Provider value={{ unread, setUnread }}>
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnread() {
  return useContext(UnreadContext);
}
