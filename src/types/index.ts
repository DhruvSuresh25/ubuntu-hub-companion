// Types for Ubuntu Hub App
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  profession?: string;
  bio?: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
  memberCount: number;
  category: string;
  location: string;
  isJoined?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  organizerId: string;
  organizerName: string;
  attendeeCount: number;
  category: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  phone: string;
  isVerified?: boolean;
}

export interface BusinessCard {
  id: string;
  userId: string;
  fullName: string;
  profession: string;
  company: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  bio?: string;
  template: 'modern' | 'gradient' | 'classic' | 'minimal';
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  title: string;
  description: string;
  organization: string;
  location: string;
  date: string;
  spotsAvailable: number;
  category: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  image?: string;
  likes: number;
  comments: number;
}
