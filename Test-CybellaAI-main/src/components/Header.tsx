import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import NavItems from './header/NavItems';
import UserDropdown from './header/UserDropdown';
import MobileMenu from './header/MobileMenu';
import NotificationBell from './header/NotificationBell';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    if (onLoginClick) onLoginClick();
    navigate('/login');
  };

  const headerBgClass =
    "fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-[#8B5CF6]/90 backdrop-blur-md border-b border-white/10 shadow-sm";

  return (
    <header className={headerBgClass}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section - Custom Logo */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <img
            src="./image/logo.png"
            alt="Cybella.AI Logo"
            className="h-12 w-auto" 
          />
          <span className="text-white font-semibold text-lg">Cybella.AI</span>
        </div>

        {/* Center Section - Navigation (Desktop Only) */}
        {!isMobile && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <NavItems className="shadow-sm" />
          </div>
        )}

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
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