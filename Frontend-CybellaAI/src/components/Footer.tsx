import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 px-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <img 
              src="./image/logo.png" 
              alt="Cybella Logo" 
              className="h-6 w-auto" 
            />
            <p className="text-sm text-muted-foreground">
              © {currentYear} Cybella AI. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-4 text-xs text-center text-muted-foreground">
          Cybella AI is designed for emotional support and does not replace professional therapy.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
