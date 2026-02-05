import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, ArrowRight } from 'lucide-react';

const BankLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const activeRole: UserRole = 'employee';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            await login(email, activeRole);
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 text-white mb-4 shadow-xl shadow-slate-200">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">TrustID Staff</h1>
                    <p className="text-gray-500 mt-2">Bank Employee Portal</p>
                </div>

                <Card className="border-none shadow-2xl shadow-gray-200/50 backdrop-blur-md bg-white/80 rounded-2xl overflow-hidden border border-white/20">
                    <CardHeader className="space-y-1 pt-8">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Lock className="w-5 h-5 text-slate-700" />
                            Employee Sign In
                        </CardTitle>
                        <CardDescription>
                            Review and manage user verifications
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@bank.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 bg-white/50 border-gray-200 focus:border-slate-500 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <button type="button" className="text-sm text-slate-600 hover:text-slate-500 font-medium">Forgot password?</button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 bg-white/50 border-gray-200 focus:border-slate-500 rounded-xl"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="pb-8 pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                ) : (
                                    <>
                                        Access Portal
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Confidential access only. <br />
                    <button className="text-slate-600 font-semibold hover:underline mt-2">Contact IT for issues</button>
                </p>
            </motion.div>
        </div>
    );
};

export default BankLoginPage;
