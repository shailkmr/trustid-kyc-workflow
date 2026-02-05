import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'customer' | 'employee' | null;

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    role: UserRole;
    login: (email: string, role: UserRole) => Promise<void>;
    googleLogin: () => Promise<void>;
    completeLogin: (userData: any) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored session
        const storedUser = localStorage.getItem('kyc_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const completeLogin = useCallback((userData: any) => {
        const user: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as UserRole,
        };
        setUser(user);
        localStorage.setItem('kyc_user', JSON.stringify(user));
    }, []);

    const googleLogin = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/auth/google');
            const data = await response.json();
            if (data.login_url) {
                window.location.href = data.login_url;
            } else {
                throw new Error('Could not get Google login URL');
            }
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    }, []);

    const login = useCallback(async (email: string, role: UserRole) => {
        setIsLoading(true);
        try {
            const apiUrl = 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role })
            });

            if (!response.ok) throw new Error('Login failed');

            const userData = await response.json();
            completeLogin(userData);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [completeLogin]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('kyc_user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, role: user?.role || null, login, googleLogin, completeLogin, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
