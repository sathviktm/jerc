import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <FiHome className="mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
