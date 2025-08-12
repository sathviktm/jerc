# Environmental NGO Website

A comprehensive, responsive web application for environmental NGOs featuring donation processing, volunteer management, project showcase, events calendar, news/blog section, and an admin dashboard.

## 🌟 Features

### Public Features
- **Homepage** with mission statement and impactful imagery
- **Projects Section** showcasing ongoing and completed environmental projects
- **Donation System** with Stripe and Razorpay integration
- **Volunteer Signup** with email confirmation
- **Events Calendar** with registration functionality
- **News/Blog Section** for updates and articles
- **Contact Page** with interactive map
- **Responsive Design** optimized for all devices
- **Accessibility** compliant with WCAG guidelines

### Admin Features
- **Dashboard** with analytics and statistics
- **Project Management** - create, edit, delete projects
- **Volunteer Management** - approve, reject, manage volunteers
- **Event Management** - create and manage events
- **News Management** - publish and manage articles
- **Donation Tracking** - view and manage donations
- **User Management** - admin and moderator roles
- **Reports** - generate detailed reports

### Technical Features
- **Secure Authentication** with JWT tokens
- **File Upload** with Cloudinary integration
- **Email Notifications** with Nodemailer
- **Payment Processing** with Stripe and Razorpay
- **Database** with MongoDB and Mongoose
- **API** with Express.js and validation
- **Frontend** with React and modern UI/UX
- **Real-time Updates** with React Query
- **SEO Optimized** with meta tags and structured data

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eco-ngo-website
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000

   # Database
   MONGODB_URI=mongodb://localhost:27017/eco-ngo

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@eco-ngo.org

   # Payment Gateways
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Google Maps API (for contact page map)
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   npm run dev
   ```

   **Frontend (in a new terminal):**
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin/login

## 📁 Project Structure

```
eco-ngo-website/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   └── package.json
├── models/                # MongoDB models
├── routes/                # API routes
├── middleware/            # Express middleware
├── uploads/               # File uploads
├── server.js             # Express server
├── package.json
└── README.md
```

## 🔧 Configuration

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `eco-ngo`
3. Update `MONGODB_URI` in your `.env` file

### Email Setup
1. Create a Gmail account or use existing
2. Enable 2-factor authentication
3. Generate an app password
4. Update `EMAIL_USER` and `EMAIL_PASS` in `.env`

### Payment Setup
1. **Stripe:**
   - Create a Stripe account
   - Get your API keys from dashboard
   - Update `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`

2. **Razorpay:**
   - Create a Razorpay account
   - Get your API keys from dashboard
   - Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Update the Cloudinary variables in `.env`

### Google Maps Setup
1. Create a Google Cloud account
2. Enable Maps JavaScript API
3. Create an API key
4. Update `GOOGLE_MAPS_API_KEY` in `.env`

## 👥 Admin Setup

1. **Create Admin User**
   ```bash
   # Start MongoDB shell
   mongo
   
   # Switch to your database
   use eco-ngo
   
   # Insert admin user (password will be hashed automatically)
   db.users.insertOne({
     username: "admin",
     email: "admin@eco-ngo.org",
     password: "admin123",
     role: "admin",
     isActive: true
   })
   ```

2. **Login to Admin Panel**
   - Go to http://localhost:3000/admin/login
   - Use the credentials you created above

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Frontend Deployment (Netlify/Vercel)
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to your preferred platform

### Database Deployment
- Use MongoDB Atlas for cloud database
- Update `MONGODB_URI` in production environment

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js security headers
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- Semantic HTML structure

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## 📊 Performance

- Lazy loading for images
- Code splitting
- Optimized bundle size
- CDN integration
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@eco-ngo.org
- Documentation: [Link to docs]

## 🔄 Updates

Stay updated with the latest features and security patches by:
- Following the repository
- Checking releases regularly
- Subscribing to update notifications

---

**Built with ❤️ for environmental conservation**
