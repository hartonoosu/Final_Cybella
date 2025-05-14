import React from "react";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  isMobile?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isMobile }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-2">
      <img
        src="./image/logo.png"
        alt="Cybella Logo"
        className={isMobile ? "h-8" : "h-10"}
      />
      {!isMobile && (
        <span className="text-white text-lg font-bold tracking-wide">Cybella</span>
      )}
    </div>
  );
};

export default Logo;