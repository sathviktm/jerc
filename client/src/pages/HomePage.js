import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { FiArrowRight, FiUsers, FiTree, FiHeart, FiTarget } from 'react-icons/fi';
import { FaLeaf, FaRecycle, FaWater, FaSeedling } from 'react-icons/fa';
import HeroSection from '../components/home/HeroSection';
import FeaturedProjects from '../components/home/FeaturedProjects';
import ImpactStats from '../components/home/ImpactStats';
import MissionSection from '../components/home/MissionSection';
import CallToAction from '../components/home/CallToAction';
import { getFeaturedProjects } from '../services/api';

const HomePage = () => {
  const { data: featuredProjects, isLoading } = useQuery(
    'featuredProjects',
    getFeaturedProjects,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const stats = [
    {
      icon: FiTree,
      number: '50,000+',
      label: 'Trees Planted',
      color: 'text-green-600',
    },
    {
      icon: FiUsers,
      number: '2,500+',
      label: 'Volunteers',
      color: 'text-blue-600',
    },
    {
      icon: FiHeart,
      number: '100+',
      label: 'Projects Completed',
      color: 'text-red-600',
    },
    {
      icon: FiTarget,
      number: '$2.5M+',
      label: 'Funds Raised',
      color: 'text-purple-600',
    },
  ];

  const services = [
    {
      icon: FaLeaf,
      title: 'Conservation',
      description: 'Protecting endangered species and their habitats through sustainable practices.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: FaRecycle,
      title: 'Waste Management',
      description: 'Implementing innovative recycling and waste reduction programs.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FaWater,
      title: 'Water Conservation',
      description: 'Preserving water resources and promoting sustainable water practices.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: FaSeedling,
      title: 'Reforestation',
      description: 'Restoring forests and creating green spaces for future generations.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Mission Statement */}
      <MissionSection />

      {/* Impact Stats */}
      <ImpactStats stats={stats} />

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We focus on four key areas to create lasting environmental impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${service.bgColor} rounded-full mb-6`}>
                  <service.icon className={`text-2xl ${service.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our ongoing initiatives that are making a real difference
            </p>
          </motion.div>

          <FeaturedProjects projects={featuredProjects} isLoading={isLoading} />

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              View All Projects
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
};

export default HomePage;
