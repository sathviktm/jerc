import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const FeaturedProjects = ({ projects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No featured projects available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="h-48 bg-gray-200 relative">
            {project.images && project.images.length > 0 ? (
              <img
                src={project.images[0].url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">Project Image</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {project.shortDescription}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 capitalize">
                {project.category}
              </span>
              <Link
                to={`/projects/${project._id}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                Learn More
                <FiArrowRight className="ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedProjects;
