import React from 'react';
import { Course, View } from '../types';
import { useAuth } from '../hooks/useAuth';

interface CourseCardProps {
    course: Course;
    setView: (view: View, params?: any) => void;
    onBuyNow: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, setView, onBuyNow }) => {
    const { user, isAdmin } = useAuth();

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <img className="h-48 w-full object-cover" src={course.image_url} alt={course.title} />
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">{course.category}</div>
                    <h3 className="block mt-1 text-lg leading-tight font-medium text-black h-14">{course.title}</h3>
                    <p className="mt-2 text-gray-500 text-sm">Instructor: {course.instructor}</p>
                </div>
                <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">${course.price}</p>
                    <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button onClick={() => setView('courseDetail', { id: course.id })} className="flex-1 text-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                            View Details
                        </button>
                        <button onClick={() => onBuyNow(course)} disabled={!user || isAdmin} className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Buy Now
                        </button>
                    </div>
                     {!user && <p className="text-xs text-center text-red-500 mt-2">Login to purchase</p>}
                     {isAdmin && <p className="text-xs text-center text-gray-500 mt-2">Admin accounts cannot purchase.</p>}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;