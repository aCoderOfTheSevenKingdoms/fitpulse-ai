import React from 'react';

export interface User {
  name: string;
  email: string;
  bio: string;
  location: string;
  avatar: string;
  memberSince: string;
  isPro: boolean;
  isNewUser?: boolean;
  hasHistory?: boolean;
  weight?: string;
  height?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl: string;
  readTime: string;
  likes: number;
  isSaved: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type Category = 'All' | 'Workout' | 'Diet' | 'Sleep' | 'Mental' | 'Recovery';