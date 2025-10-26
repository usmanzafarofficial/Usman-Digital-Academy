import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase project URL and anon key.
// You can find these in your Supabase project's "Project Settings" > "API".
// A README.md file has been added with detailed setup instructions.
const supabaseUrl = 'https://oyhfqmtdplryfqnlusej.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95aGZxbXRkcGxyeWZxbmx1c2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjQwMzksImV4cCI6MjA3NzA0MDAzOX0.j10Ig6boRa-t8WxPg1zbWIufMwZe5_dwY4ueKwHyANE';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    // This provides a warning in the developer console to remind the user to configure their credentials.
    console.warn("Supabase credentials are not set. The app will not function correctly. Please update services/supabase.ts with your project's URL and anon key. See README.md for instructions.");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);