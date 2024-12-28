import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Github, Twitter, Facebook, Linkedin, Instagram, Send, Globe, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QRCodeGenerator from '@/components/QRCodeGenerator';

const SOCIAL_PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: Github },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'telegram', name: 'Telegram', icon: Send },
  { id: 'website', name: 'Website', icon: Globe },
  { id: 'other', name: 'Other', icon: Globe },
];

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  customPlatform?: string;
};

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  avatar?: string;
  imageShape: 'circle' | 'square' | 'portrait';
  imagePosition: number;
  socialLinks: SocialLink[];
};

function SortableItem({ link, updateSocialLink, removeSocialLink }) {
  return (
    <div className="flex gap-4 items-start fade-in">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 hover:bg-transparent"
          onClick={() => moveSocialLink(link.id, 'up')}
          disabled={true}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 hover:bg-transparent"
          onClick={() => moveSocialLink(link.id, 'down')}
          disabled={true}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 space-y-2">
        <Select
          value={link.platform}
          onValueChange={(value) => updateSocialLink(link.id, 'platform', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {SOCIAL_PLATFORMS.map((platform) => (
              <SelectItem key={platform.id} value={platform.id}>
                <div className="flex items-center">
                  <platform.icon className="h-4 w-4 mr-2" />
                  {platform.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {link.platform === 'other' && (
          <Input
            placeholder="Platform name"
            value={link.customPlatform || ''}
            onChange={(e) => updateSocialLink(link.id, 'customPlatform', e.target.value)}
            className="mt-2"
          />
        )}
        <Input
          placeholder="URL"
          value={link.url}
          onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
        />
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => removeSocialLink(link.id)}
        className="rounded-xl"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

const Settings = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: '',
      email: '',
      phone: '',
      role: '',
      bio: '',
      avatar: '',
      imageShape: 'circle',
      imagePosition: 50,
      socialLinks: []
    };
  });

  const moveSocialLink = (id: string, direction: 'up' | 'down') => {
    const index = profile.socialLinks.findIndex(link => link.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === profile.socialLinks.length - 1)
    ) {
      return;
    }

    const newLinks = [...profile.socialLinks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    
    setProfile(prev => ({ ...prev, socialLinks: newLinks }));
  };

  const updateProfile = (field: keyof Omit<UserProfile, 'socialLinks'>, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateImageShape = (shape: 'circle' | 'square' | 'portrait') => {
    setProfile(prev => ({ ...prev, imageShape: shape }));
  };

  const updateImagePosition = (position: number) => {
    setProfile(prev => ({ ...prev, imagePosition: position }));
  };

  const addSocialLink = () => {
    setProfile(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: crypto.randomUUID(), platform: '', url: '' }
      ]
    }));
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url' | 'customPlatform', value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (id: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
    toast({
      title: "Social link removed",
      duration: 2000,
    });
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast({
      title: "Settings saved successfully",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen p-6">
      <Link to="/" className="absolute top-6 left-6">
        <Button variant="ghost" size="icon" className="hover-scale">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>

      <div className="max-w-2xl mx-auto space-y-6 pt-16">
        <Card className="glass-card p-6 fade-in">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Your name" 
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="role">Current Role</Label>
              <Input 
                id="role" 
                placeholder="Your current role" 
                value={profile.role}
                onChange={(e) => updateProfile('role', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+1 (123) 456-7890"
                value={profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Write a short bio..."
                value={profile.bio}
                onChange={(e) => updateProfile('bio', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className={`relative ${
                  profile.imageShape === 'circle' ? 'w-32 h-32 rounded-full' :
                  profile.imageShape === 'square' ? 'w-32 h-32 rounded-[30px]' :
                  'w-32 h-48 rounded-[30px]'
                } overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/50 backdrop-blur-sm`}>
                  {profile.avatar ? (
                    <div className="relative w-full h-full">
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="absolute w-full h-auto min-h-full object-cover"
                        style={{
                          top: `${-1 * profile.imagePosition}%`,
                          transform: profile.imageShape === 'portrait' ? 'scale(1.2)' : 'scale(1.1)'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateProfile('avatar', reader.result as string);
                          // Reset image position when new image is uploaded
                          setProfile(prev => ({ ...prev, imagePosition: 50 }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={profile.imageShape === 'circle' ? 'secondary' : 'outline'}
                      onClick={() => {
                        updateImageShape('circle');
                        setProfile(prev => ({ ...prev, imagePosition: 50 }));
                      }}
                      size="sm"
                      className="rounded-full"
                    >
                      Circle
                    </Button>
                    <Button
                      type="button"
                      variant={profile.imageShape === 'square' ? 'secondary' : 'outline'}
                      onClick={() => {
                        updateImageShape('square');
                        setProfile(prev => ({ ...prev, imagePosition: 50 }));
                      }}
                      size="sm"
                      className="rounded-xl"
                    >
                      Square
                    </Button>
                    <Button
                      type="button"
                      variant={profile.imageShape === 'portrait' ? 'secondary' : 'outline'}
                      onClick={() => {
                        updateImageShape('portrait');
                        setProfile(prev => ({ ...prev, imagePosition: 50 }));
                      }}
                      size="sm"
                      className="rounded-xl"
                    >
                      Portrait
                    </Button>
                  </div>
                  {profile.avatar && (
                    <div className="space-y-2">
                      <Label>Head Position</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Top</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={profile.imagePosition}
                          onChange={(e) => updateImagePosition(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm">Bottom</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Social Links</h2>
            <Button onClick={addSocialLink} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
          
          <div className="space-y-4">
            {profile.socialLinks.map((link, index) => (
              <div key={link.id} className="flex gap-4 items-start fade-in">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 hover:bg-transparent"
                    onClick={() => moveSocialLink(index, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 hover:bg-transparent"
                    onClick={() => moveSocialLink(index, 'down')}
                    disabled={index === profile.socialLinks.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <Select
                    value={link.platform}
                    onValueChange={(value) => updateSocialLink(link.id, 'platform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          <div className="flex items-center">
                            <platform.icon className="h-4 w-4 mr-2" />
                            {platform.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {link.platform === 'other' && (
                    <Input
                      placeholder="Platform name"
                      value={link.customPlatform || ''}
                      onChange={(e) => updateSocialLink(link.id, 'customPlatform', e.target.value)}
                      className="mt-2"
                    />
                  )}
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSocialLink(link.id)}
                  className="rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6 fade-in">
          <h2 className="text-2xl font-bold mb-6">QR Code</h2>
          <p className="text-sm opacity-70 mb-4">Scan this QR code to visit your profile page</p>
          <QRCodeGenerator url={`${window.location.origin}${window.location.pathname.replace('/settings', '')}`} />
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
