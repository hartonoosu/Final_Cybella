import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavItemsProps {
  isMobile?: boolean;
  onClickItem?: () => void;
  className?: string;
}

// Navigation items used across desktop and mobile views
export const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: MessageSquare, label: 'Chat', path: '/chat' },
  { icon: MessageSquare, label: 'About', path: '/about' },
];

const NavItems: React.FC<NavItemsProps> = ({ 
  isMobile = false, 
  onClickItem,
  className = ""
}) => {
  const location = useLocation();
  
  if (isMobile) {
    return (
      <div className={`flex flex-col space-y-1 ${className}`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path}
              onClick={onClickItem}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-white/30 text-white font-medium" 
                  : "hover:bg-white/20 text-white/90 hover:text-white"
              )}
            >
              <item.icon size={18} className={cn("transition-transform duration-300", isActive ? "scale-110" : "")} />
              <span className={cn(
                "text-sm transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-85"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-full bg-white/20 backdrop-blur-md p-1.5 flex items-center gap-2", 
      className
    )}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.label} 
            to={item.path} 
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 rounded-full",
              isActive 
                ? "bg-white/30 font-medium shadow-sm" 
                : "hover:bg-white/15"
            )}
          >
            <item.icon 
              size={20} 
              className={cn(
                "transition-transform duration-300",
                isActive ? "scale-110" : ""
              )} 
            />
            <span className={cn(
              "transition-all duration-300",
              isActive ? "opacity-100" : "opacity-85"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavItems;