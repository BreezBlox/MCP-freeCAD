
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, Maximize2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModelViewerProps {
  model: {
    id: string;
    preview: string;
    prompt: string;
  } | null;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ model }) => {
  const [rotating, setRotating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (model) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [model]);

  const toggleRotation = () => {
    setRotating(!rotating);
  };

  return (
    <div className="relative h-[500px] bg-[#f0f2f5] flex items-center justify-center">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
          <RotateCw 
            className={cn("h-4 w-4", rotating && "animate-spin")} 
            onClick={toggleRotation}
          />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
          <DownloadCloud className="h-4 w-4" />
        </Button>
      </div>
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="h-16 w-16 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500">Loading model preview...</p>
          </motion.div>
        ) : model ? (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn("relative w-[300px] h-[300px]", rotating && "animate-[spin_8s_linear_infinite]")}
          >
            <img 
              src="/models/cube-render.png" 
              alt="3D Model" 
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center max-w-md px-4"
          >
            <img 
              src="/models/model-placeholder.svg" 
              alt="Empty model" 
              className="w-40 h-40 mb-6 opacity-20"
            />
            <h3 className="text-xl font-medium text-zinc-800 mb-2">No Model Generated Yet</h3>
            <p className="text-zinc-500">
              Use the prompt below to describe the 3D model you want to create. The generated model will appear here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelViewer;
