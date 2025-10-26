import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabaseClient } from '../services/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            await updateUserState(session);
            setIsLoading(false);
        };
        
        fetchSession();

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            async (_event: AuthChangeEvent, session: Session | null) => {
                await updateUserState(session);
                 if (isLoading) setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);
    
    const updateUserState = async (session: Session | null) => {
        if (session?.user) {
            const { data: profile, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                // Log out the user if profile doesn't exist to prevent broken states
                await supabaseClient.auth.signOut();
                setUser(null);
            } else if (profile) {
                const fullUser: User = { ...session.user, ...profile };
                setUser(fullUser);
            }
        } else {
            setUser(null);
        }
    };


    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, isLoading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
