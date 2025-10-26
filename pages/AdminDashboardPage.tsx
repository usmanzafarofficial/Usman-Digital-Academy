import React, { useState, useEffect, useCallback } from 'react';
import { Course, PurchaseWithDetails, PurchaseStatus } from '../types';
import { api } from '../services/api';
import CourseForm from '../components/CourseForm';

const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState<Course[]>([]);
    const [purchases, setPurchases] = useState<PurchaseWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [coursesData, purchasesData] = await Promise.all([
                api.getCourses(),
                api.getAllPurchases(),
            ]);
            setCourses(coursesData);
            setPurchases(purchasesData);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleConfirmPayment = async (purchaseId: number) => {
        await api.updatePurchaseStatus(purchaseId, PurchaseStatus.Confirmed);
        fetchData();
    };

    const handleSaveCourse = async (formData: FormData) => {
        setIsSaving(true);
        
        const courseData = {
            id: formData.has('id') ? parseInt(formData.get('id') as string) : undefined,
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            price: parseFloat(formData.get('price') as string),
            description: formData.get('description') as string,
            learning_outcomes: JSON.parse(formData.get('learning_outcomes') as string),
            imageFile: formData.get('imageFile') as File | undefined,
            image_url: formData.get('image_url') as string | undefined,
        };

        const result = await api.saveCourse(courseData);

        if (result.error) {
            alert(`Error saving course: ${result.error}`);
        }

        setIsSaving(false);
        setIsFormOpen(false);
        setEditingCourse(null);
        fetchData();
    };
    
    const handleDeleteCourse = async (courseId: number) => {
        if(window.confirm('Are you sure you want to delete this course?')) {
            await api.deleteCourse(courseId);
            fetchData();
        }
    };
    
    const openAddForm = () => {
        setEditingCourse(null);
        setIsFormOpen(true);
    };

    const openEditForm = (course: Course) => {
        setEditingCourse(course);
        setIsFormOpen(true);
    };

    if (loading) return <div className="text-center p-10">Loading Admin Dashboard...</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('courses')} className={`${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Manage Courses ({courses.length})
                        </button>
                        <button onClick={() => setActiveTab('purchases')} className={`${activeTab === 'purchases' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Manage Payments ({purchases.filter(p => p.status === PurchaseStatus.Pending).length} pending)
                        </button>
                    </nav>
                </div>

                {activeTab === 'courses' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button onClick={openAddForm} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add New Course</button>
                        </div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {courses.map(course => (
                                            <tr key={course.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.price.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button onClick={() => openEditForm(course)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                    <button onClick={() => handleDeleteCourse(course.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'purchases' && (
                     <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                         <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {purchases.map(purchase => (
                                        <tr key={purchase.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{purchase.profiles?.name}</div>
                                                <div className="text-sm text-gray-500">{purchase.profiles?.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.courses.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${purchase.status === PurchaseStatus.Confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {purchase.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {purchase.status === PurchaseStatus.Pending && (
                                                    <button onClick={() => handleConfirmPayment(purchase.id)} className="text-green-600 hover:text-green-900">Confirm Payment</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     </div>
                )}
                {isFormOpen && (
                    <CourseForm course={editingCourse} onSave={handleSaveCourse} onCancel={() => setIsFormOpen(false)} isSaving={isSaving}/>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;