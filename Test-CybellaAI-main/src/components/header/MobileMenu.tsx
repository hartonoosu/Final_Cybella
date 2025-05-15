import React from 'react';
import { User, X, LogOut, LogIn, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import NavItems from './NavItems';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLoginClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen, onLoginClick }) => {
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogoutClick = () => {
    logout();
    if (onLoginClick) onLoginClick();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-[280px] p-4 bg-[#1E90FF]/95 text-white backdrop-blur-lg border-l border-white/10">
        <div className="flex flex-col gap-6 pt-2">
          <div className="flex items-center justify-between">
            <Logo isMobile={false} />
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8 p-0">
                {/* <X size={18} /> */}
              </Button>
            </SheetTrigger>
          </div>
          
          {isAuthenticated && user && (
            <div className="py-3 px-4 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
              <p className="text-sm font-medium">Welcome, {user.name || user.email}</p>
            </div>
          )}
          
          <div className="py-2">
            <h3 className="text-xs uppercase tracking-wider opacity-70 mb-2 px-2">Navigation</h3>
            <NavItems 
              isMobile={true} 
              onClickItem={() => setIsOpen(false)} 
            />
          </div>

          {isAuthenticated && (
            <div className="py-2">
              <h3 className="text-xs uppercase tracking-wider opacity-70 mb-2 px-2">Account</h3>
              <div className="flex flex-col gap-1">
                <Link 
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  <User size={18} />
                  <span className="text-sm">Profile</span>
                </Link>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200">
                  <Bell size={18} />
                  <span className="text-sm">Notifications</span>
                </div>
              </div>
            </div>
          )}
          
          <div className={cn(
            "mt-auto pt-4",
            isAuthenticated ? "border-t border-white/20" : ""
          )}>
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                onClick={handleLogoutClick} 
                className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm py-1 h-9"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }} 
                className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm py-1 h-9"
              >
                <LogIn size={16} className="mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;