import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { View, Course } from './types';
import { api } from './services/api';

import Header from './components/Header';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';

import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Main />
        </AuthProvider>
    );
};

const Main: React.FC = () => {
    const { user, isAdmin, isLoading } = useAuth();
    const [view, setView] = useState<View>('home');
    const [viewParams, setViewParams] = useState<any>(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [courseForPayment, setCourseForPayment] = useState<Course | null>(null);

    const navigate = (newView: View, params: any = null) => {
        window.scrollTo(0, 0);
        
        // Basic hash routing for navigation
        const newHash = `${newView}${params?.id ? `/${params.id}`: ''}`;
        if (`#/${newHash}` !== window.location.hash) {
            window.location.hash = newHash;
        } else {
             // If hash is the same, just re-render the view
             setView(newView);
             setViewParams(params);
        }
    };

    // Handle browser back/forward navigation and initial load from URL
    useEffect(() => {
        const handleHashChange = () => {
             const hash = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
             const newView = (hash[0] as View) || 'home';
             const params = hash[1] ? { id: parseInt(hash[1]) } : null;
             setView(newView);
             setViewParams(params);
        };
        
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Sync view on initial load

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleBuyNow = (course: Course) => {
        if (user && !isAdmin) {
            setCourseForPayment(course);
            setIsPaymentModalOpen(true);
        } else {
            navigate('login');
        }
    };
    
    const handleConfirmPurchase = async () => {
        if(user && courseForPayment) {
            await api.purchaseCourse(user.id, courseForPayment.id);
            setIsPaymentModalOpen(false);
            setCourseForPayment(null);
            navigate('dashboard');
        }
    };

    const renderView = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-screen font-semibold text-lg">Loading Usman Digital Academy...</div>;
        }

        // Protected routes logic
        switch (view) {
            case 'dashboard':
                if (!user) return <LoginPage setView={navigate} />;
                if (isAdmin) return <AdminDashboardPage />; // Admins see admin dash
                return <DashboardPage setView={navigate} />;
            case 'adminDashboard':
                if (!user || !isAdmin) return <HomePage setView={navigate} onBuyNow={handleBuyNow} />;
                return <AdminDashboardPage />;
            case 'login':
                if (user) return <DashboardPage setView={navigate} />
                return <LoginPage setView={navigate} />;
            case 'register':
                if (user) return <DashboardPage setView={navigate} />
                return <RegisterPage setView={navigate} />;
            case 'courses':
                return <CoursesPage initialParams={viewParams} setView={navigate} onBuyNow={handleBuyNow} />;
            case 'courseDetail':
                return <CourseDetailPage courseId={viewParams?.id} setView={navigate} onBuyNow={handleBuyNow} />;
            default:
                 return <HomePage setView={navigate} onBuyNow={handleBuyNow} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
            <Header setView={navigate} />
            <main className="flex-grow">
                {renderView()}
            </main>
            <Footer setView={navigate} />
            <PaymentModal 
                course={courseForPayment}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirmPurchase={handleConfirmPurchase}
            />
        </div>
    );
};

export default App;