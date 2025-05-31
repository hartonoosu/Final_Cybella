import React from 'react';
import { User, LogIn, LogOut, ChevronDown, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const UserDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    logout();
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
            <User size={16} />
            {/* <span>{user?.fullName || user?.email}</span> */}
            <span>{user?.fullName || (user?.email?.split('@')[0] ?? '')}</span>
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User size={16} className="mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer text-red-500">
            <LogOut size={16} className="mr-2" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLoginClick} 
        className="flex items-center gap-1 bg-white/10 text-white border-white/30 hover:bg-white/20"
      >
        <LogIn size={16} />
        <span>Sign In</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRegisterClick} 
        className="flex items-center gap-1 bg-white/10 text-white border-white/30 hover:bg-white/20"
      >
        <UserPlus size={16} />
        <span>Sign Up</span>
      </Button>
    </div>
  );
};

export default UserDropdown;