import React, { useState, useEffect } from 'react';
import { PurchaseWithDetails, PurchaseStatus, View } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface DashboardPageProps {
    setView: (view: View, params?: any) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setView }) => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState<PurchaseWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchPurchases = async () => {
                setLoading(true);
                const studentPurchases = await api.getStudentPurchases(user.id);
                setPurchases(studentPurchases);
                setLoading(false);
            };
            fetchPurchases();
        } else {
             setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div className="text-center p-10">Loading your dashboard...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>
                {purchases.length === 0 ? (
                    <div className="bg-white text-center p-12 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800">You haven't purchased any courses yet.</h2>
                        <p className="mt-2 text-gray-600">Explore our catalog and start learning today!</p>
                        <button onClick={() => setView('courses')} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {purchases.map((purchase) => (
                                <li key={purchase.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <img src={purchase.courses.image_url} alt={purchase.courses.title} className="w-32 h-20 object-cover rounded-md flex-shrink-0" />
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-lg font-semibold text-gray-900">{purchase.courses.title}</h3>
                                        <p className="text-sm text-gray-500">{purchase.courses.category}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            purchase.status === PurchaseStatus.Confirmed 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {purchase.status}
                                        </span>
                                        <button 
                                            disabled={purchase.status !== PurchaseStatus.Confirmed}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            View Course
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;