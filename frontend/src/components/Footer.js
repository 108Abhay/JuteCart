import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='bg-slate-100 border-t mt-8'>
      <div className='container mx-auto py-6 px-4 flex flex-col items-center space-y-2'>
        <div className='flex items-center space-x-2'>
          <ShoppingBag className='text-green-600' size={22} />
          <h1 className='text-xl font-bold text-gray-800'>JuteCart</h1>
        </div>
        <p className='text-xs text-gray-500'>&copy; {new Date().getFullYear()} JuteCart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
