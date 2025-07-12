# ReWear - Community Clothing Exchange

## Overview

ReWear is a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The platform promotes sustainable fashion and reduces textile waste by encouraging users to reuse wearable garments instead of discarding them.

## Video Submission Link

https://youtu.be/V_Yk8N4VGpo

## 🎯 Mission

Transform how people think about clothing consumption by creating a community-driven platform that makes sustainable fashion accessible, rewarding, and social.

## ✨ Core Features

### User Authentication & Onboarding

- **Secure Registration**: Email/password signup with validation
- **Login System**: Streamlined user authentication
- **Registration Page**: Multi-field form with social login integration

### Landing Experience

- **Platform Introduction**: Clear value proposition and mission statement
- **Primary Actions**:
  - "Start Swapping" - Direct user onboarding
  - "Browse Items" - Explore available clothing
  - "List an Item" - Quick item upload
- **Featured Items**: Carousel showcasing popular and recent listings

### User Dashboard

- **Profile Management**: Personal details and account settings
- **Points Balance**: Track earned and spent points
- **My Listings**: Overview of uploaded items with status indicators
- **Swap History**: Complete record of ongoing and completed exchanges
- **Quick Actions**: Fast access to frequently used features

### Item Management System

- **Detailed Item Pages**:
  - High-quality image galleries
  - Comprehensive descriptions (title, category, type, size, condition)
  - Uploader information and ratings
  - Availability status indicators
- **Flexible Exchange Options**:
  - Direct swap requests
  - Point-based redemption system
- **Smart Categorization**: Organized by clothing type, size, and condition

### Content Creation

- **Add New Item Flow**:
  - Multi-image upload with preview
  - Structured form fields (title, description, category, type, size, condition)
  - Tag system for improved discoverability
  - Submit and approval workflow

### Administrative Controls

- **Content Moderation**: Review and approve/reject item listings
- **Community Management**: Remove inappropriate or spam content
- **Lightweight Admin Panel**: Efficient oversight tools
- **User Management**: Handle user accounts and resolve disputes

## 🔧 Technical Architecture

### Frontend Stack

- **Framework**: Vite + TypeScript
- **Styling**: Tailwind CSS
- **Key Benefits**: Fast development, type safety, responsive design

### Backend Infrastructure

- **Runtime**: Node.js with Express
- **Features**: RESTful API, middleware support, scalable architecture

### Database

- **Platform**: MongoDB
- **Advantages**: Flexible document structure, scalable for user-generated content

## 🎨 User Experience Patterns

### Navigation Flow

1. **Landing Page** → Registration/Login
2. **Dashboard** → Browse Items or Add New Item
3. **Item Discovery** → Item Detail → Swap Request
4. **Profile Management** → Track Swaps and Points

### Key Interactions

- **Search & Filter**: Advanced filtering by categories, sizes, and conditions
- **Swap Requests**: Direct messaging and negotiation system
- **Points System**: Gamified experience encouraging active participation
- **Image Management**: Multiple photo uploads with optimization

## 🌱 Sustainability Impact

### Environmental Benefits

- **Waste Reduction**: Extends clothing lifecycle
- **Resource Conservation**: Reduces demand for new textile production
- **Carbon Footprint**: Minimizes transportation through local exchanges

### Community Building

- **Social Responsibility**: Promotes conscious consumption
- **Economic Value**: Provides cost-effective clothing access
- **Educational**: Raises awareness about sustainable fashion

## 📱 Screen Architecture

### Core Pages Identified

1. **Screen 1**: Login Page - User authentication entry point
2. **Screen 2**: Registration Page - New user onboarding with social integration
3. **Screen 3**: Landing Page - Platform introduction and featured content
4. **Screen 4**: Browse/Search - Item discovery with filtering options
5. **Screen 5**: Item Catalog - Grid view of available items
6. **Screen 6**: User Dashboard - Personal account management
7. **Screen 7**: Item Detail - Comprehensive item information
8. **Admin Panel**: Content moderation and user management

## 🚀 Implementation Roadmap

### Phase 1: Core Platform

- User authentication and basic profiles
- Item listing and browsing functionality
- Basic swap request system

### Phase 2: Enhanced Features

- Points system implementation
- Advanced search and filtering
- Image optimization and galleries

### Phase 3: Community Features

- User ratings and reviews
- Social features and messaging
- Mobile responsiveness optimization

### Phase 4: Administration

- Complete admin panel
- Content moderation tools
- Analytics and reporting

## 🎯 Success Metrics

### User Engagement

- Active monthly users
- Items listed per user
- Successful swap completion rate

### Platform Health

- Average time from listing to swap
- User retention rate
- Community growth metrics

### Environmental Impact

- Total items exchanged
- Estimated waste reduction
- Carbon footprint savings

## 🔐 Security Considerations

- Secure user authentication
- Image upload validation
- Content moderation protocols
- Privacy protection measures
- Safe transaction handling

## 📈 Future Enhancements

### Potential Features

- Mobile app development
- AI-powered size and style matching
- Integration with shipping services
- Expanded reward system
- Community challenges and events

### Scalability Planning

- Database optimization strategies
- CDN implementation for images
- Caching mechanisms
- Load balancing considerations

---

## Team Members:

- [Hardik kasliwal](https://github.com/THECH13F)
- [Prerit Kotak](https://github.com/Kotak-Prerit)
- [kuldeep khalotiya](https://github.com/Kuldeep-2303)
- [Dhvani Patel](https://github.com/pateldhvani20)

**ReWear** represents a meaningful step toward sustainable fashion consumption, combining technology with community values to create positive environmental impact while providing genuine value to users.

---

## 🚀 How to Run This Project

### Prerequisites

Before running this project, make sure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (local installation) or **MongoDB Atlas** account

### Project Structure

```
odoo-Hackathon/
├── client/          # Frontend (React + TypeScript + Vite)
├── server/          # Backend (Node.js + Express)
└── README.md
```

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/Kotak-Prerit/odoo.round1.git
cd odoo-Hackathon
```

#### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

#### 3. Environment Configuration

Create a `.env` file in the `server/database/` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/rewear

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_SECRET_ID=your-google-client-secret

# Email Configuration (for notifications)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:5173
```

**Note**: For Gmail, you need to use an App Password instead of your regular password. Create one at: Google Account → Security → 2-Step Verification → App passwords

#### 4. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

#### 5. Cloudinary Setup (Image Upload)

Create a `.env` file in the `client/` directory:

```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

To set up Cloudinary:

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name from the dashboard
3. Create an upload preset in Settings → Upload → Upload presets

### Running the Project

#### Option 1: Run Both Servers Simultaneously

1. **Start the Backend Server**:

   ```bash
   cd server
   npm start
   ```

   The backend will run on `http://localhost:5000`

2. **Start the Frontend Server** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

#### Option 2: Using Package Scripts

If you have a root `package.json` with scripts (optional):

```bash
# From the root directory
npm run dev        # Start both frontend and backend
npm run server     # Start only backend
npm run client     # Start only frontend
```

### Accessing the Application

1. **Frontend**: Open your browser and navigate to `http://localhost:5173`
2. **Backend API**: Available at `http://localhost:5000/api`

### Key Features to Test

1. **User Registration/Login**: Create a new account or log in
2. **Browse Items**: Visit `/browse` to see all available items
3. **List an Item**: Add new items with images via Cloudinary
4. **Swap System**: Create swap requests between users
5. **Dashboard**: View your listings, purchases, and swap requests
6. **Product Details**: Click on any item to see detailed information

### API Endpoints

The backend provides the following main endpoints:

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/items` - Get all items (with pagination)
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get specific item
- `POST /api/swaps` - Create swap request
- `GET /api/swaps/my-requests` - Get user's outgoing swap requests
- `GET /api/swaps/received` - Get user's incoming swap requests

### Troubleshooting

#### Common Issues:

1. **MongoDB Connection Error**:

   - Verify your MongoDB URI in the `.env` file
   - Ensure MongoDB Atlas allows connections from your IP
   - Check if MongoDB service is running (for local installations)

2. **Cloudinary Upload Issues**:

   - Verify your Cloud Name and Upload Preset
   - Ensure upload preset is set to "unsigned" mode

3. **Email Notifications Not Working**:

   - Use Gmail App Password instead of regular password
   - Enable 2-Factor Authentication on your Google account first

4. **Port Already in Use**:
   - Backend: Change port in `server/app.js`
   - Frontend: Vite will automatically suggest an alternative port

#### Development Commands:

```bash
# Backend
cd server
npm run dev          # Run with nodemon (auto-restart)
npm start           # Run normally

# Frontend
cd client
npm run dev         # Development server with hot reload
npm run build       # Build for production
npm run preview     # Preview production build
```

### Database Schema

The application uses MongoDB with the following main collections:

- **Users**: User accounts and authentication
- **Items**: Product listings with images and details
- **SwapRequests**: Swap transactions between users
- **Purchases**: Purchase history and transactions

### Tech Stack Summary

**Frontend:**

- React 19.1.0 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Formik + Yup for form handling
- Axios for API calls

**Backend:**

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Nodemailer for email notifications
- Cloudinary for image storage

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Look for existing issues in the GitHub repository
3. Create a new issue with detailed information about the problem

---
