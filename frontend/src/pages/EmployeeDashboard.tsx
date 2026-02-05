import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Search, Filter, Shield, CheckCircle, XCircle, AlertTriangle, Eye,
    Download, LogOut, Users, FileCheck, Database
} from 'lucide-react';

const mockCases = [
    { id: 'KYC-2024-001', user: 'Alex Rivers', email: 'alex@example.com', status: 'Pending', risk: 'Low', date: '2024-02-05' },
    { id: 'KYC-2024-002', user: 'Sarah Chen', email: 'sarah.c@design.io', status: 'Completed', risk: 'Medium', date: '2024-02-04' },
    { id: 'KYC-2024-003', user: 'Marcus Thorne', email: 'm.thorne@global.com', status: 'In Review', risk: 'High', date: '2024-02-05' },
    { id: 'KYC-2024-004', user: 'Elena Rodriguez', email: 'elena.r@tech.es', status: 'Pending', risk: 'Low', date: '2024-02-03' },
    { id: 'KYC-2024-005', user: 'David Kim', email: 'dkim@finance.kr', status: 'Rejected', risk: 'High', date: '2024-01-30' },
];

const EmployeeDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed': return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
            case 'Pending': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Pending</Badge>;
            case 'In Review': return <Badge className="bg-orange-100 text-orange-700 border-orange-200">In Review</Badge>;
            case 'Rejected': return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getRiskBadge = (risk: string) => {
        switch (risk) {
            case 'Low': return <span className="flex items-center gap-1.5 text-green-600 font-medium"><CheckCircle className="h-4 w-4" /> Low</span>;
            case 'Medium': return <span className="flex items-center gap-1.5 text-orange-600 font-medium"><AlertTriangle className="h-4 w-4" /> Medium</span>;
            case 'High': return <span className="flex items-center gap-1.5 text-red-600 font-medium"><XCircle className="h-4 w-4" /> High</span>;
            default: return risk;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            {/* Sidebar (Desktop) / Topbar (Mobile) */}
            <div className="flex">
                <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 min-h-screen p-6 sticky top-0">
                    <div className="flex items-center gap-2 mb-10 px-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">TrustID Staff</span>
                    </div>

                    <nav className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-3 bg-indigo-50 text-indigo-700 rounded-xl">
                            <Users className="h-4 w-4" />
                            KYC Cases
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl">
                            <Database className="h-4 w-4" />
                            Audit Logs
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl">
                            <FileCheck className="h-4 w-4" />
                            Reports
                        </Button>
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Logged in as</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 italic">Security Level A1</p>
                        </div>
                        <Button onClick={logout} variant="outline" className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 border-gray-100 rounded-xl">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </aside>

                <main className="flex-1 p-6 lg:p-10">
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">KYC Case Management</h2>
                            <p className="text-gray-500 mt-1">Reviewing 12 new applications received today.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by ID or name..."
                                    className="pl-10 h-11 w-64 bg-white border-transparent shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white border-transparent shadow-sm">
                                <Filter className="h-4 w-4 text-gray-600" />
                            </Button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Total Cases', value: '1,284', change: '+12%', color: 'blue' },
                            { label: 'Pending', value: '42', change: 'Action Needed', color: 'orange' },
                            { label: 'Avg Process Time', value: '4.2m', animate: true, color: 'indigo' },
                            { label: 'Approval Rate', value: '94%', change: '+2.1%', color: 'green' }
                        ].map((stat, i) => (
                            <Card key={i} className="border-none shadow-sm rounded-2xl bg-white p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <div className="flex items-end gap-2">
                                    <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
                                    {stat.change && <span className={`text-[10px] font-bold mb-1 ${stat.color === 'green' ? 'text-green-500' : 'text-gray-400'}`}>{stat.change}</span>}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Current KYC Queue</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:bg-indigo-50">View All</Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest pl-6">Case ID</TableHead>
                                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest">Customer</TableHead>
                                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest">Risk Assessment</TableHead>
                                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest">Submitted</TableHead>
                                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockCases.filter(c => c.user.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                        <TableRow key={item.id} className="border-gray-50/50 hover:bg-gray-50/30 transition-colors group">
                                            <TableCell className="pl-6 font-mono text-xs font-bold text-gray-400">{item.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.user}</p>
                                                    <p className="text-xs text-gray-500">{item.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getRiskBadge(item.risk)}</TableCell>
                                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                                            <TableCell className="text-gray-500 text-sm font-medium">{item.date}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
                            <p className="text-xs text-gray-400 font-medium tracking-tight">Displaying most recent activity • Auto-refreshes every 30s</p>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
