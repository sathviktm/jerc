import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
          alt="Beautiful forest landscape"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Protecting Our
            <span className="text-primary-400 block">Planet's Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Join our mission to conserve biodiversity, restore ecosystems, and create 
            a sustainable future for generations to come.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/donate"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Make a Donation
              <FiArrowRight className="ml-2" />
            </Link>

            <Link
              to="/volunteer"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Become a Volunteer
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                50K+
              </div>
              <div className="text-sm md:text-base text-gray-300">
                Trees Planted
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                2.5K+
              </div>
              <div className="text-sm md:text-base text-gray-300">
                Volunteers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                100+
              </div>
              <div className="text-sm md:text-base text-gray-300">
                Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                $2.5M+
              </div>
              <div className="text-sm md:text-base text-gray-300">
                Funds Raised
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>

      {/* Video play button (optional) */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20 hidden lg:block"
      >
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
          <FiPlay className="text-white text-xl ml-1" />
        </div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
