import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';

const MissionSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to protecting the environment through conservation, 
            education, and community engagement. Our mission is to create a 
            sustainable future for all living beings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <FiTarget className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Our Vision
            </h3>
            <p className="text-gray-600">
              A world where nature thrives, biodiversity is protected, and 
              communities live in harmony with the environment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <FiEye className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600">
              To conserve biodiversity, restore ecosystems, and empower 
              communities to protect our planet for future generations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <FiHeart className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Our Values
            </h3>
            <p className="text-gray-600">
              Integrity, collaboration, innovation, and a deep commitment 
              to environmental stewardship guide everything we do.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
