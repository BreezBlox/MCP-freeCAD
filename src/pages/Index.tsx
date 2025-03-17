
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Send, Code, Box, RefreshCw, PlusCircle, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import ModelViewer from '@/components/ModelViewer';
import CodePanel from '@/components/CodePanel';
import FeaturesList from '@/components/FeaturesList';

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('model');
  const [modelHistory, setModelHistory] = useState<any[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    toast.info('Processing your design request...');
    
    // Simulate processing time
    setTimeout(() => {
      const newModel = {
        id: Date.now().toString(),
        prompt,
        preview: '/models/cube-preview.png',
        code: 'import FreeCAD as App\nimport Part\n\n# Create a new document\ndoc = App.newDocument()\n\n# Create a cube\ncube = Part.makeBox(10, 10, 10)\n\n# Create a shape object\nmyShape = doc.addObject("Part::Feature", "Cube")\nmyShape.Shape = cube\n\n# Recompute the document\ndoc.recompute()',
        created: new Date().toISOString()
      };
      
      setModelHistory(prev => [newModel, ...prev]);
      setPrompt('');
      setIsGenerating(false);
      toast.success('Design generated successfully!');
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <h2 className="text-xl font-medium text-zinc-900">Model Workspace</h2>
                  <TabsList className="bg-zinc-100">
                    <TabsTrigger value="model" className="data-[state=active]:bg-white">
                      <Box className="mr-2 h-4 w-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="code" className="data-[state=active]:bg-white">
                      <Code className="mr-2 h-4 w-4" />
                      Python
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="model" className="mt-0">
                  <ModelViewer model={modelHistory[0] || null} />
                </TabsContent>
                
                <TabsContent value="code" className="mt-0">
                  <CodePanel code={modelHistory[0]?.code || ''} />
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-4">
                <div className="flex items-start gap-4">
                  <Textarea
                    ref={inputRef}
                    placeholder="Describe your 3D model... (e.g., 'Create a cube with 10mm sides')"
                    className="flex-1 min-h-[80px] resize-none bg-zinc-50 focus-visible:ring-blue-500 border-zinc-200"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 h-12 transition-all"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-200">
                <h3 className="text-lg font-medium text-zinc-900">Design History</h3>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto">
                <FeaturesList models={modelHistory} />
                
                {modelHistory.length === 0 && (
                  <div className="p-6 text-center text-zinc-500">
                    <Hexagon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Your designed models will appear here</p>
                    <p className="text-sm mt-2">Try generating your first model!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
