import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import NavItems from './header/NavItems';
import ThemeToggle from './header/ThemeToggle';
import UserDropdown from './header/UserDropdown';
import MobileMenu from './header/MobileMenu';
import NotificationBell from './header/NotificationBell';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLoginClick = () => {
    if (onLoginClick) onLoginClick();
    navigate('/login');
  };

const headerBgClass = "fixed top-0 left-0 right-0 z-50 px-2 md:px-4 py-3 md:py-4 bg-[#8B5CF6]/90 backdrop-blur-md border-b border-white/10 shadow-sm";
  return (
    <header className={headerBgClass}>
      <div className="container flex items-center justify-between">
        {/* Left Section - Custom Logo */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          <img
            src="./image/logo.png"
            alt="Cybella.AI Logo"
            className="h-20 w-auto"
          />
        </div>

        {/* Center Section - Navigation */}
        <div className="flex-grow flex justify-center mx-4">
          {!isMobile && <NavItems className="shadow-sm" />}
        </div>

        {/* Right Section - Actions */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {isMobile ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-9 w-9 p-0"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <MobileMenu
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onLoginClick={handleLoginClick}
              />
            </>
          ) : (
            <>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <NotificationBell />
              <UserDropdown />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
