import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import NavItems from './NavItems';
import ThemeToggle from './ThemeToggle';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';
import NotificationBell from './NotificationBell';

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

  // Updated header background with slightly more transparent backdrop
  const headerBgClass = "fixed top-0 left-0 right-0 z-50 px-2 md:px-4 py-3 md:py-4 bg-[#6cb4ee]/90 backdrop-blur-md border-b border-white/10 shadow-sm";

  return (
    <header className={headerBgClass}>
      <div className="container flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex-shrink-0">
          <Logo isMobile={isMobile} />
        </div>
        
        {/* Center Section - Navigation with improved spacing */}
        <div className="flex-grow flex justify-center mx-4">
          {!isMobile && <NavItems className="shadow-sm" />}
        </div>
        
        {/* Right Section - User Actions with improved spacing */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-9 w-9 p-0" onClick={() => setIsOpen(true)}>
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
