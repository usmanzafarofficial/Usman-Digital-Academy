import React, { useState, useEffect } from 'react';
import { Course, View } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { WhatsAppIcon } from '../components/Icons';
import { PAYMENT_DETAILS } from '../constants';

interface CourseDetailPageProps {
    courseId: number;
    setView: (view: View) => void;
    onBuyNow: (course: Course) => void;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, setView, onBuyNow }) => {
    const { user, isAdmin } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            const fetchedCourse = await api.getCourseById(courseId);
            setCourse(fetchedCourse);
            setLoading(false);
        };
        fetchCourse();
    }, [courseId]);
    
    if (loading) return <div className="text-center py-20">Loading course details...</div>;
    if (!course) return <div className="text-center py-20">Course not found.</div>;

    return (
        <>
            <div className="bg-gray-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold">{course.title}</h1>
                    <p className="mt-2 text-lg text-gray-300">{course.description}</p>
                    <p className="mt-4">Instructor: <span className="font-semibold">{course.instructor}</span></p>
                    <p>Category: <span className="font-semibold">{course.category}</span></p>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                            <ul className="space-y-3">
                                {course.learning_outcomes.map((outcome, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{outcome}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-24">
                            <img className="h-56 w-full object-cover" src={course.image_url} alt={course.title} />
                            <div className="p-6">
                                <p className="text-3xl font-bold text-gray-900">${course.price}</p>
                                <button
                                    onClick={() => onBuyNow(course)}
                                    disabled={!user || isAdmin}
                                    className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                                {!user && <p className="text-xs text-center text-red-500 mt-2">You must be logged in to purchase a course.</p>}
                                {isAdmin && <p className="text-xs text-center text-gray-500 mt-2">Admin accounts cannot purchase courses.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <a
                href={`https://wa.me/${PAYMENT_DETAILS.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110"
                aria-label="Chat on WhatsApp"
            >
                <WhatsAppIcon className="h-8 w-8" />
            </a>
        </>
    );
};

export default CourseDetailPage;