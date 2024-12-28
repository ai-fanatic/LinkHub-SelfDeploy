import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  url: string;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, label, url, className }) => {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full fade-in"
    >
      <Card className={cn(
        "glass-card hover-scale p-4 flex items-center space-x-3",
        className
      )}>
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </Card>
    </a>
  );
};

export default SocialLink;