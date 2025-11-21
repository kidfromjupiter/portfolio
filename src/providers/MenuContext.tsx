"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export enum MenuItemType {
  TERMINAL = "TERMINAL HISTORY",
  PROJECTS = "PROJECTS",
  ABOUT = "ABOUT ME",
  CONTACT = "CONTACT",
}

type MenuContextValue = {
  activeItem: MenuItemType;
  setActiveItem: (item: MenuItemType) => void;
};

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

type MenuProviderProps = {
  children: ReactNode;
};

export function MenuProvider({ children }: MenuProviderProps) {
  const [activeItem, setActiveItem] = useState<MenuItemType>(
    MenuItemType.TERMINAL // default selected
  );

  const value: MenuContextValue = {
    activeItem,
    setActiveItem,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return ctx;
}
