import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DonatePage from './pages/DonatePage';
import VolunteerPage from './pages/VolunteerPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminVolunteersPage from './pages/admin/AdminVolunteersPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminDonationsPage from './pages/admin/AdminDonationsPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Environmental NGO - Protecting Our Planet</title>
        <meta name="description" content="Join our mission to protect the environment through conservation, reforestation, and wildlife protection." />
        <meta name="keywords" content="environmental, conservation, NGO, wildlife, reforestation, sustainability" />
        <link rel="canonical" href="https://eco-ngo.org" />
      </Helmet>
      
      <ScrollToTop />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/projects" element={<AdminProjectsPage />} />
            <Route path="/admin/volunteers" element={<AdminVolunteersPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route path="/admin/news" element={<AdminNewsPage />} />
            <Route path="/admin/donations" element={<AdminDonationsPage />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
