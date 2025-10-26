
import React from 'react';
import { Course } from '../types';
import { PAYMENT_DETAILS } from '../constants';
import { CloseIcon, WhatsAppIcon } from './Icons';

interface PaymentModalProps {
    course: Course | null;
    onClose: () => void;
    onConfirmPurchase: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose, onConfirmPurchase }) => {
    if (!course) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase: {course.title}</h2>
                <div className="space-y-4 text-gray-700">
                    <p className="font-semibold">To complete your purchase, please follow these steps:</p>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="font-bold text-blue-800">Step 1: Send Payment</p>
                        <p>Send <strong>${course.price}</strong> to:</p>
                        <ul className="list-disc list-inside mt-2">
                            <li><strong>Account Name:</strong> {PAYMENT_DETAILS.accountName}</li>
                            <li><strong>Account Number:</strong> {PAYMENT_DETAILS.accountNumber}</li>
                            <li><strong>Payment Methods:</strong> {PAYMENT_DETAILS.methods.join(' / ')}</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                         <p className="font-bold text-green-800">Step 2: Confirm via WhatsApp</p>
                         <p>After sending payment, WhatsApp the following details to <strong className="whitespace-nowrap">{PAYMENT_DETAILS.whatsappNumber}</strong>:</p>
                         <ul className="list-disc list-inside mt-2">
                             <li>Your Full Name</li>
                             <li>Your Email Address</li>
                             <li>Selected Course: "{course.title}"</li>
                         </ul>
                         <a 
                            href={`https://wa.me/${PAYMENT_DETAILS.whatsappNumber.replace(/\D/g, '')}?text=Hello, I have paid for the course '${course.title}'. My name is [Your Name] and my email is [Your Email].`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-4 inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                            <span>Contact on WhatsApp</span>
                         </a>
                    </div>
                    <p>After your payment is confirmed, the course will appear in your dashboard with "Access Granted" status.</p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onConfirmPurchase} className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                        I've Sent Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
