import React, { useState, useEffect } from 'react';
import { Course, View } from '../types';
import { api } from '../services/api';
import CourseCard from '../components/CourseCard';
import { SearchIcon } from '../components/Icons';
import { CATEGORIES } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface HomePageProps {
    setView: (view: View, params?: any) => void;
    onBuyNow: (course: Course) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setView, onBuyNow }) => {
    const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const courses = await api.getCourses();
                setFeaturedCourses(courses.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setView('courses', { query: searchQuery });
    };

    const Hero = () => (
        <div className="bg-blue-700 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Learn Skills. Grow Fast.</h1>
                <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-blue-300">Build Your Future.</h2>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Join thousands of learners and unlock your potential with expert-led courses.</p>
                <div className="mt-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="What do you want to learn?"
                                className="block w-full pl-6 pr-12 py-4 border border-transparent rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white text-lg"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-5">
                                <SearchIcon className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    const CategoriesSection = () => (
        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Browse Top Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setView('courses', { category: category })}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 text-center font-semibold text-gray-800"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Hero />
            <div className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Featured Courses</h2>
                    {loading ? (
                         <div className="text-center">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredCourses.map(course => (
                                <CourseCard key={course.id} course={course} setView={setView} onBuyNow={onBuyNow} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <CategoriesSection />
        </div>
    );
};

export default HomePage;