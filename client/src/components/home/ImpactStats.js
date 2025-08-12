import React from 'react';
import { motion } from 'framer-motion';

const ImpactStats = ({ stats }) => {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Our Impact
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Together, we've achieved remarkable results in environmental conservation
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                {stat.number}
              </div>
              <div className="text-primary-100">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
