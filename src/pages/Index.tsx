import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Copy, Download, Github, Twitter, Facebook, Linkedin, Instagram, Send, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';
import ThemeSelector from '@/components/ThemeSelector';
import { ProfileService, UserProfile } from '../services/profileService';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  avatar?: string;
  imageShape: 'circle' | 'square' | 'portrait';
  imagePosition: number;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    customPlatform?: string;
  }>;
};

const PLATFORM_ICONS = {
  github: Github,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  telegram: Send,
  website: Globe,
  other: Globe,
};

const Index = () => {
  const { currentTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Try to load from localStorage first for immediate display
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Then load from database
    const loadProfile = async () => {
      try {
        const dbProfile = await ProfileService.getProfile();
        if (dbProfile) {
          setProfile(dbProfile);
          // Update localStorage with latest data
          localStorage.setItem('userProfile', JSON.stringify(dbProfile));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleCopyEmail = () => {
    if (profile?.email) {
      navigator.clipboard.writeText(profile.email);
      toast({
        title: "Email copied to clipboard",
        duration: 2000,
      });
    }
  };

  const downloadVCard = () => {
    if (!profile) return;
    
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
${profile.role ? `TITLE:${profile.role}\n` : ''}
${profile.email ? `EMAIL:${profile.email}\n` : ''}
${profile.phone ? `TEL:${profile.phone}\n` : ''}
${profile.bio ? `NOTE:${profile.bio}\n` : ''}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contact.vcf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen relative">
      <Link to="/settings" className="absolute top-6 right-6">
        <Button variant="ghost" size="icon" className="hover-scale">
          <Settings className="h-6 w-6" />
        </Button>
      </Link>

      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          {profile?.avatar && (
            <div className={`mx-auto overflow-hidden mb-6 ${
              profile.imageShape === 'circle' ? 'w-32 h-32 rounded-full' :
              profile.imageShape === 'square' ? 'w-32 h-32 rounded-[30px]' :
              'w-32 h-48 rounded-[30px]'
            } shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/50 backdrop-blur-sm`}>
              <div className="relative w-full h-full">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="absolute w-full h-auto min-h-full object-cover"
                  style={{
                    top: `${-1 * profile.imagePosition}%`,
                    transform: profile.imageShape === 'portrait' ? 'scale(1.2)' : 'scale(1.1)'
                  }}
                />
              </div>
            </div>
          )}
          
          <h1 className="text-4xl font-bold">
            {profile?.name || 'Welcome'}
          </h1>

          {profile?.role && (
            <p className="text-xl opacity-90">
              {profile.role}
            </p>
          )}
          
          {profile?.bio && (
            <p className="text-lg opacity-80">
              {profile.bio}
            </p>
          )}

          <div className="flex justify-center gap-4 mt-6">
            {(profile?.email || profile?.phone) && (
              <>
                {profile.email && (
                  <Button 
                    variant="outline" 
                    onClick={handleCopyEmail}
                    className="hover:bg-primary/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Email
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={downloadVCard}
                  className="hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Contact
                </Button>
              </>
            )}
          </div>

          {profile?.socialLinks && profile.socialLinks.length > 0 && (
            <div className="grid gap-4 mt-8">
              {profile.socialLinks.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform as keyof typeof PLATFORM_ICONS];
                if (!Icon || !link.url) return null;

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-4 flex items-center justify-between hover:opacity-80 transition-all duration-300 rounded-[20px] shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="text-lg">
                        {link.platform === 'other' ? link.customPlatform : link.platform}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ThemeSelector />
    </div>
  );
};

export default Index;