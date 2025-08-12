import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiUser } from 'react-icons/fi';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Every action counts. Whether you donate, volunteer, or spread awareness, 
            you're helping us protect the environment for future generations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/donate"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FiHeart className="mr-2" />
              Make a Donation
            </Link>

            <Link
              to="/volunteer"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
            >
              <FiUser className="mr-2" />
              Become a Volunteer
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
