import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileImageProps {
  src?: string;
  alt?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt = "Profile" }) => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6 fade-in">
      <Avatar className="w-full h-full">
        <AvatarImage src={src} alt={alt} className="object-cover" />
        <AvatarFallback className="text-4xl">{alt[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileImage;