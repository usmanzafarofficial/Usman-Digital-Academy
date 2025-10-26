import { User as SupabaseUser } from '@supabase/supabase-js';

// The course image is now a URL from Supabase Storage
export interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  learning_outcomes: string[];
  price: number;
  image_url: string; // Changed from 'image'
  instructor: string;
  created_at?: string;
}

// User profile data, stored in our 'profiles' table
export interface UserProfile {
  id: string; // Corresponds to Supabase auth user ID
  name: string;
  role: 'user' | 'admin';
}

// Combined user object for use in the app
export interface User extends SupabaseUser, UserProfile {}


export enum PurchaseStatus {
  Pending = 'Pending Confirmation',
  Confirmed = 'Access Granted',
}

export interface Purchase {
  id: number;
  user_id: string;
  course_id: number;
  status: PurchaseStatus;
  created_at: string;
}

export interface PurchaseWithDetails {
  id: number;
  status: PurchaseStatus;
  created_at: string;
  courses: Course; // Supabase returns nested object with table name
  profiles: UserProfile; // Supabase returns nested object with table name
}

export type View = 
  | 'home'
  | 'courses'
  | 'courseDetail'
  | 'login'
  | 'register'
  | 'dashboard'
  // adminLogin is removed as it's now a unified login flow
  | 'adminDashboard';