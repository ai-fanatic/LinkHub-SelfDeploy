import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ThemeSelector = () => {
  const { themes, setTheme, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="glass-card w-full mb-2 flex items-center justify-between">
            Theme
            {isOpen ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronUp className="h-4 w-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="glass-card p-4">
            <div className="flex flex-col gap-2">
              {themes.map((theme) => (
                <Button
                  key={theme.name}
                  variant={currentTheme.name === theme.name ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setTheme(theme)}
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ background: theme.gradient }}
                  />
                  {theme.name}
                </Button>
              ))}
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ThemeSelector;