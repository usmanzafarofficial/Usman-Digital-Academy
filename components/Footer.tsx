import React from 'react';
import { PAYMENT_DETAILS } from '../constants';
import { View } from '../types';
import { WhatsAppIcon } from './Icons';

interface FooterProps {
    setView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Usman Digital Academy</h3>
                        <p className="text-gray-400">Learn Skills. Grow Fast. Build Your Future.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: contact@usman.digital</li>
                            <li>Phone/WhatsApp: {PAYMENT_DETAILS.whatsappNumber}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                             <li><button onClick={() => setView('courses')} className="text-gray-400 hover:text-white">Courses</button></li>
                             <li><button onClick={() => setView('login')} className="text-gray-400 hover:text-white">Admin Login</button></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-400">&copy; {new Date().getFullYear()} Usman Digital Academy. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <a href={`https://wa.me/${PAYMENT_DETAILS.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                           <WhatsAppIcon className="h-6 w-6" />
                        </a>
                        {/* Add other social links here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;