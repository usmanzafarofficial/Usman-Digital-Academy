import { supabaseClient } from './supabase';
import { Course, Purchase, PurchaseStatus, PurchaseWithDetails } from '../types';
import { AuthError, User } from '@supabase/supabase-js';

const BUCKET_NAME = 'course-images';

type ApiResult<T> = { data?: T; error?: string };
type SupabaseApiError = { message: string } | AuthError;

const handleError = (error: SupabaseApiError | null): string => {
  return error?.message || 'An unknown error occurred.';
};

export const api = {
  // Course Management
  getCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabaseClient.from('courses').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(handleError(error));
    return data || [];
  },

  getCourseById: async (id: number): Promise<Course | null> => {
    const { data, error } = await supabaseClient.from('courses').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching course by ID:', error);
      return null;
    }
    return data;
  },

  saveCourse: async (
    courseData: Omit<Course, 'id' | 'instructor' | 'created_at' | 'image_url'> & { imageFile?: File, id?: number, image_url?: string }
  ): Promise<ApiResult<Course>> => {
    let imageUrl = courseData.image_url || '';

    if (courseData.imageFile) {
        const file = courseData.imageFile;
        const filePath = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const { error: uploadError } = await supabaseClient.storage
            .from(BUCKET_NAME)
            .upload(filePath, file);

        if (uploadError) return { error: handleError(uploadError) };

        const { data: { publicUrl } } = supabaseClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);
        imageUrl = publicUrl;
    }

    const dbData = {
        title: courseData.title,
        category: courseData.category,
        description: courseData.description,
        learning_outcomes: courseData.learning_outcomes,
        price: courseData.price,
        instructor: 'Usman Zafar',
        image_url: imageUrl,
    };

    let response;
    if (courseData.id) {
        response = await supabaseClient.from('courses').update(dbData).eq('id', courseData.id).select().single();
    } else {
        response = await supabaseClient.from('courses').insert(dbData).select().single();
    }
    
    if (response.error) return { error: handleError(response.error) };
    return { data: response.data };
  },

  deleteCourse: async (courseId: number): Promise<ApiResult<boolean>> => {
    const { error } = await supabaseClient.from('courses').delete().eq('id', courseId);
    if (error) return { error: handleError(error) };
    return { data: true };
  },
  
  // Auth Management
  register: async ({ name, email, password }): Promise<ApiResult<User>> => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { name } // Used by DB trigger to create a profile
      }
    });
    if (error) return { error: handleError(error) };
    return { data: data.user as User };
  },
  
  login: async ({ email, password }): Promise<ApiResult<User>> => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return { error: handleError(error) };
    return { data: data.user as User };
  },

  logout: async (): Promise<ApiResult<boolean>> => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) return { error: handleError(error) };
    return { data: true };
  },

  // Purchase Management
  purchaseCourse: async (userId: string, courseId: number): Promise<ApiResult<Purchase>> => {
    const { data, error } = await supabaseClient.from('purchases').insert({
      user_id: userId,
      course_id: courseId,
      status: PurchaseStatus.Pending
    }).select().single();
    if (error) return { error: handleError(error) };
    return { data };
  },

  getStudentPurchases: async (userId: string): Promise<PurchaseWithDetails[]> => {
    const { data, error } = await supabaseClient
      .from('purchases')
      .select('*, courses(*), profiles(*)')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching student purchases:', error);
      return [];
    }
    return data as PurchaseWithDetails[];
  },

  getAllPurchases: async (): Promise<PurchaseWithDetails[]> => {
    const { data, error } = await supabaseClient
      .from('purchases')
      .select('*, courses(*), profiles(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all purchases:', error);
      return [];
    }
    return (data || []).filter(p => p.profiles && p.courses) as PurchaseWithDetails[];
  },

  updatePurchaseStatus: async (purchaseId: number, status: PurchaseStatus): Promise<ApiResult<Purchase>> => {
    const { data, error } = await supabaseClient.from('purchases').update({ status }).eq('id', purchaseId).select().single();
    if (error) return { error: handleError(error) };
    return { data };
  },
};
