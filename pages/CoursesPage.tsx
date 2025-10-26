
import React, { useState, useEffect, useMemo } from 'react';
import { Course, View } from '../types';
import { api } from '../services/api';
import CourseCard from '../components/CourseCard';
import { CATEGORIES } from '../constants';

interface CoursesPageProps {
    initialParams?: { query?: string, category?: string };
    setView: (view: View, params?: any) => void;
    onBuyNow: (course: Course) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ initialParams, setView, onBuyNow }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialParams?.query || '');
    const [selectedCategory, setSelectedCategory] = useState(initialParams?.category || 'All');

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const allCourses = await api.getCourses();
                setCourses(allCourses);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [courses, searchQuery, selectedCategory]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">All Courses</h1>
                    <p className="mt-2 text-lg text-gray-600">Find the perfect course to advance your career.</p>
                </div>
                
                <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-600">Loading courses...</div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} setView={setView} onBuyNow={onBuyNow} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-800">No Courses Found</h2>
                        <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;
