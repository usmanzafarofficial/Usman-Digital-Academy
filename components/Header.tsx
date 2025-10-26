import React, { useState } from 'react';
import { LogoIcon, MenuIcon, CloseIcon, SearchIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { View } from '../types';

interface HeaderProps {
    setView: (view: View, params?: any) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
    const { user, isAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setView('courses', { query: searchQuery });
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        await api.logout();
        setView('home');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', view: 'home' as View },
        { name: 'Courses', view: 'courses' as View },
        { name: 'About', view: 'home' as View}, // Not implemented as separate page
        { name: 'Contact', view: 'home' as View}, // Not implemented as separate page
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                         <button onClick={() => setView('home')} className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition-colors">
                            <LogoIcon className="h-8 w-auto text-blue-600" />
                            <span className="font-bold text-xl hidden sm:inline">Usman Digital Academy</span>
                        </button>
                        <nav className="hidden md:flex space-x-4">
                            {navLinks.map(link => (
                                <button key={link.name} onClick={() => setView(link.view)} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">{link.name}</button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-1 hidden md:flex justify-center px-8">
                        <form onSubmit={handleSearch} className="w-full max-w-md">
                            <div className="relative">
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for courses..."
                                    className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="hidden md:flex items-center space-x-2">
                            {user ? (
                                <>
                                    <span className="text-sm text-gray-600">Welcome, {user.name.split(' ')[0]}</span>
                                    <button onClick={() => setView(isAdmin ? 'adminDashboard' : 'dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">Dashboard</button>
                                    <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setView('login')} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Login</button>
                                    <button onClick={() => setView('register')} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">Register</button>
                                </>
                            )}
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-blue-600">
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <button key={link.name} onClick={() => { setView(link.view); setIsMenuOpen(false); }} className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{link.name}</button>
                        ))}
                         {user ? (
                                <>
                                    <button onClick={() => {setView(isAdmin ? 'adminDashboard' : 'dashboard'); setIsMenuOpen(false);}} className="bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Dashboard</button>
                                    <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Logout</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => {setView('login'); setIsMenuOpen(false);}} className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Login</button>
                                    <button onClick={() => {setView('register'); setIsMenuOpen(false);}} className="bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Register</button>
                                </>
                            )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;