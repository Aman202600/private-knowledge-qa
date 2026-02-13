import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Search, Activity } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )
        }
    >
        <Icon className="w-4 h-4" />
        {label}
    </NavLink>
);

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            Q
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">Private Knowledge</span>
                    </div>

                    <nav className="flex items-center gap-1">
                        <NavItem to="/" icon={LayoutDashboard} label="Home" />
                        <NavItem to="/upload" icon={UploadCloud} label="Upload" />
                        <NavItem to="/query" icon={Search} label="Query" />
                        <NavItem to="/status" icon={Activity} label="Status" />
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Private Knowledge Q&A. Production Ready.
                </div>
            </footer>

            <Toaster position="top-right" />
        </div>
    );
};

export default Layout;
