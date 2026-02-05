import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { completeLogin } = useAuth();

    useEffect(() => {
        console.log('AuthCallback: Processing location.search:', location.search);
        const query = new URLSearchParams(location.search);
        const id = query.get('id');
        const name = query.get('name');
        const email = query.get('email');
        const role = query.get('role');

        console.log('AuthCallback: Extracted params:', { id, name, email, role });

        if (id && email && role) {
            console.log('AuthCallback: Success, completing login...');
            // Complete the login in the AuthContext
            completeLogin({ id, name, email, role });

            console.log('AuthCallback: Navigating to /dashboard...');
            // Redirect to dashboard
            navigate('/dashboard');
        } else {
            console.error('Authentication failed: Missing user info in callback', { id, email, role });
            navigate('/login?error=auth_failed');
        }
    }, [location.search, completeLogin, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600 animate-spin rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Finalizing Authentication...</h2>
                <p className="text-gray-500 mt-2">Please wait while we complete your sign-in.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
