"use client";

import React from "react";

type MenuItemProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function MenuItem({
  children,
  className = "",
  onClick,
}: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-100/20 xl:bg-transparent pointer-events-auto backdrop-blur-md md:backdrop-blur-none hover:cursor-pointer text-black py-3 px-3 min-w-full md:min-w-[400px] border-black border-2 hover:bg-black hover:text-white transition-all duration-300 hover:scale-105 text-xl md:text-3xl hover:shadow-[6px_6px_0_2px_#ffffff] ${className}`}
    >
      {children}
    </div>
  );
}
