import React, { createContext, useContext, useState } from 'react';

type UIContextType = {
  isTabBarVisible: boolean;
  setTabBarVisible: (v: boolean) => void;
};

const UIContext = createContext<UIContextType>({
  isTabBarVisible: true,
  setTabBarVisible: () => {},
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isTabBarVisible, setTabBarVisible] = useState(true);
  return (
    <UIContext.Provider value={{ isTabBarVisible, setTabBarVisible }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
