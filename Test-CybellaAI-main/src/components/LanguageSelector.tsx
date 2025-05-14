
import React from 'react';
import { Button } from '@/components/ui/button';

// This is a simplified component that doesn't actually change languages
// since we're removing the multi-language feature
const LanguageSelector: React.FC = () => {
  return (
    <Button variant="ghost" size="sm" className="hidden">
      EN
    </Button>
  );
};

export default LanguageSelector;
