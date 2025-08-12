import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Projects', href: '/projects' },
    { name: 'Get Involved', href: '/volunteer' },
    { name: 'Donate', href: '/donate' },
    { name: 'Events', href: '/events' },
    { name: 'News', href: '/news' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/eco-ngo' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/eco-ngo' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/eco-ngo' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/company/eco-ngo' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/eco-ngo' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiHeart className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Eco NGO</h3>
                <p className="text-sm text-gray-400">Protecting Our Planet</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              We are dedicated to environmental conservation, working tirelessly to protect 
              our planet's biodiversity and create a sustainable future for all.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/projects?category=conservation" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">
                  Wildlife Conservation
                </Link>
              </li>
              <li>
                <Link to="/projects?category=reforestation" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">
                  Reforestation
                </Link>
              </li>
              <li>
                <Link to="/projects?category=marine" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">
                  Marine Protection
                </Link>
              </li>
              <li>
                <Link to="/projects?category=education" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">
                  Environmental Education
                </Link>
              </li>
              <li>
                <Link to="/projects?category=community" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">
                  Community Outreach
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    123 Conservation Drive<br />
                    Eco City, Green State 12345<br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+15551234567"
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:info@eco-ngo.org"
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  info@eco-ngo.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates on our projects and events.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Eco NGO. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
