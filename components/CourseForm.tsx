import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { CATEGORIES } from '../constants';

interface CourseFormProps {
    course?: Course | null;
    onSave: (formData: FormData) => void;
    onCancel: () => void;
    isSaving: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSave, onCancel, isSaving }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [learningOutcomes, setLearningOutcomes] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (course) {
            setTitle(course.title);
            setCategory(course.category);
            setPrice(course.price);
            setDescription(course.description);
            setLearningOutcomes(course.learning_outcomes.join('\n'));
            setImagePreview(course.image_url);
            setImageFile(null);
        } else {
            setTitle('');
            setCategory(CATEGORIES[0]);
            setPrice(0);
            setDescription('');
            setLearningOutcomes('');
            setImageFile(null);
            setImagePreview(null);
        }
    }, [course]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        if (course?.id) {
            formData.append('id', course.id.toString());
        }
        formData.append('title', title);
        formData.append('category', category);
        formData.append('price', price.toString());
        formData.append('description', description);
        formData.append('learning_outcomes', JSON.stringify(learningOutcomes.split('\n').filter(o => o.trim() !== '')));
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        if(course?.image_url && !imageFile) { // Keep old image if new one isn't selected
            formData.append('image_url', course.image_url);
        }
        
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold">{course ? 'Edit Course' : 'Add New Course'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Learning Outcomes (one per line)</label>
                        <textarea value={learningOutcomes} onChange={e => setLearningOutcomes(e.target.value)} required rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Image</label>
                        <input type="file" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded shadow-sm"/>}
                    </div>
                    <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-white py-4 px-6 -mx-6 -mb-6 rounded-b-lg">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isSaving ? 'Saving...' : 'Save Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;