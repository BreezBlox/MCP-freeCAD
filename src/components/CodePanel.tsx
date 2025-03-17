
import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodePanelProps {
  code: string;
}

const CodePanel: React.FC<CodePanelProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  const copyCode = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };
  
  const downloadCode = () => {
    if (!code) return;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'freecad_model.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Code downloaded successfully');
  };
  
  const executeCode = () => {
    if (!code) return;
    toast.info('Execution request sent to FreeCAD');
  };
  
  return (
    <div className="h-[500px] flex flex-col">
      <div className="flex justify-between items-center px-6 py-3 border-b border-zinc-200 bg-zinc-50">
        <div className="text-sm font-medium text-zinc-500">FreeCAD Python Script</div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs" 
            onClick={copyCode}
          >
            {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs" 
            onClick={downloadCode}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="h-8 text-xs bg-blue-600 hover:bg-blue-700" 
            onClick={executeCode}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            Execute
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-zinc-950 text-zinc-100 p-4 font-mono text-sm">
        {code ? (
          <pre className="whitespace-pre-wrap">{code}</pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <code className="text-center">
              # No code generated yet<br/>
              # Generate a model to see the FreeCAD Python code
            </code>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePanel;
