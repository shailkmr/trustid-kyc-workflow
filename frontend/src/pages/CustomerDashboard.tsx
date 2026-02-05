import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Shield, Search, CheckCircle, Clock, AlertCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

type KYCStatus = 'idle' | 'uploading' | 'analyzing' | 'verifying' | 'completed' | 'failed';

const CustomerDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [status, setStatus] = useState<KYCStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        { name: 'Document Upload', icon: Upload, description: 'Securely submit your identity documents' },
        { name: 'AI Analysis', icon: Search, description: 'Extracting data and cross-checking records' },
        { name: 'Due Diligence', icon: Shield, description: 'Sanctions and adverse media screening' },
        { name: 'Final Review', icon: CheckCircle, description: 'Generating comprehensive KYC report' }
    ];

    const handleStartKYC = async () => {
        setStatus('uploading');
        setActiveStep(0);
        setProgress(10);

        // Simulate Workflow
        await new Promise(r => setTimeout(r, 2000));
        setStatus('analyzing');
        setActiveStep(1);
        setProgress(40);

        await new Promise(r => setTimeout(r, 3000));
        setStatus('verifying');
        setActiveStep(2);
        setProgress(75);

        await new Promise(r => setTimeout(r, 4000));
        setStatus('completed');
        setActiveStep(3);
        setProgress(100);
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Header */}
            <nav className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">TrustID</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right mr-2 hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">Standard Account</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={logout} className="rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Form/Action */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">KYC Verification</h2>
                            <p className="text-gray-500">Complete your profile to unlock all financial features.</p>
                        </div>

                        {status === 'idle' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="border-none shadow-xl shadow-gray-100 rounded-3xl overflow-hidden border border-white/40 bg-white/60 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-transparent border-b border-indigo-100/30">
                                        <CardTitle className="text-lg">Submit Identity Information</CardTitle>
                                        <CardDescription>All data is encrypted and stored securely.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Full Legal Name</Label>
                                                <Input placeholder="John Doe" className="bg-white/50 border-gray-100 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date of Birth</Label>
                                                <Input type="date" className="bg-white/50 border-gray-100 rounded-xl" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Personal Address</Label>
                                            <Textarea placeholder="123 Financial District..." className="bg-white/50 border-gray-100 rounded-xl min-h-[100px]" />
                                        </div>
                                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-indigo-300 transition-colors bg-white/40 cursor-pointer">
                                            <Upload className="h-10 w-10 mx-auto text-indigo-400 mb-4" />
                                            <p className="text-sm font-medium text-gray-900">Upload Identity Document</p>
                                            <p className="text-xs text-gray-500 mt-1">Accepts PDF, Passport scans, or ID Cards (Max 10MB)</p>
                                        </div>
                                        <Button onClick={handleStartKYC} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-lg shadow-indigo-100">
                                            Initiate Verification Flow
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <Card className="border-none shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden border border-white/40 bg-white p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <Badge variant="secondary" className={`mb-2 ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                {status.toUpperCase()}
                                            </Badge>
                                            <h3 className="text-2xl font-bold text-gray-900">Processing Your Profile</h3>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-2xl">
                                            <Clock className="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {steps.map((step, idx) => {
                                            const StepIcon = step.icon;
                                            const isActive = activeStep === idx;
                                            const isPast = activeStep > idx;

                                            return (
                                                <div key={idx} className="flex gap-4 relative">
                                                    {idx !== steps.length - 1 && (
                                                        <div className={`absolute left-[19px] top-10 w-[2px] h-[calc(100%-20px)] ${isPast ? 'bg-indigo-500' : 'bg-gray-100'}`} />
                                                    )}
                                                    <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${isPast ? 'bg-indigo-500 border-indigo-500 text-white' :
                                                        isActive ? 'border-indigo-500 text-indigo-600 bg-white shadow-lg shadow-indigo-100' :
                                                            'border-gray-100 text-gray-300 bg-white'
                                                        }`}>
                                                        {isPast ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                                                    </div>
                                                    <div className={`flex-1 pt-1 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                                        <h4 className="font-bold text-gray-900">{step.name}</h4>
                                                        <p className="text-sm text-gray-500">{step.description}</p>
                                                        {isActive && status !== 'completed' && (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50"
                                                            >
                                                                <div className="flex justify-between text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">
                                                                    <span>System Pulse</span>
                                                                    <span>In Progress</span>
                                                                </div>
                                                                <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        className="h-full bg-indigo-500"
                                                                        animate={{ width: ['0%', '100%'] }}
                                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <AnimatePresence>
                                        {status === 'completed' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-12 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4"
                                            >
                                                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100">
                                                    <Shield className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-green-900">Verification Complete</h4>
                                                    <p className="text-sm text-green-700">Your KYC report has been generated and sent for final approval.</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Status Summary */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl shadow-gray-100 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <LayoutDashboard className="h-8 w-8 mb-4 opacity-50" />
                                <h3 className="text-lg font-bold mb-1">Account Status</h3>
                                <p className="text-indigo-100 text-sm mb-6">Complete KYC to access all features</p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-medium uppercase tracking-widest opacity-80">Profile Readiness</span>
                                        <span className="text-2xl font-bold">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2 bg-indigo-900/30" />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        </Card>

                        <Card className="border-none shadow-lg shadow-gray-100 rounded-3xl p-6 border border-white">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                Next Steps
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[10px] font-bold text-gray-400">01</span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">Upload government issued photo ID</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[10px] font-bold text-gray-400">02</span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">Verify residential address via utility bill</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[10px] font-bold text-gray-400">03</span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">One-on-one video verification call</p>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
