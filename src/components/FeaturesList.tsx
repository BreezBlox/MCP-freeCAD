
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Code, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeaturesListProps {
  models: any[];
}

const FeaturesList: React.FC<FeaturesListProps> = ({ models }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className="divide-y divide-zinc-100">
      {models.map((model, index) => (
        <motion.div
          key={model.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="p-4 hover:bg-zinc-50 transition-colors"
        >
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded bg-zinc-100 flex-shrink-0 overflow-hidden">
              <img 
                src={model.preview || '/placeholder.svg'} 
                alt="Model preview" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {model.prompt}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                <Clock className="h-3 w-3" />
                <span>{formatDate(model.created)}</span>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  View Code
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturesList;
