
import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-zinc-200 sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 8.7V15.3L12 21L21 15.3V8.7L12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 9L12 14.5L21 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Model Context Protocol</h1>
            <div className="flex items-center text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3.5 w-3.5" />
                main
              </span>
              <span className="mx-2">•</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900">
            <Settings className="h-5 w-5" />
          </Button>
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg">
            Connect to FreeCAD
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
