# NEETAI Coach Portal

The comprehensive coaching institute management platform for NEET preparation.

## Overview

The Coach Portal is a Next.js application designed for coaching institutes to manage their NEET preparation programs. It provides a complete solution for student management, assessment creation, analytics, and parent communication.

## Features

### 🎓 Student Management
- Comprehensive student profiles with academic history
- Batch management and enrollment
- Performance tracking and analytics
- Parent contact management
- Bulk import/export capabilities

### 📊 Analytics & Reporting
- Real-time performance dashboards
- Predictive NEET score analytics
- Subject-wise performance tracking
- Custom report generation
- Parent and teacher insights

### 📝 Assessment Management
- Custom test creation with question bank integration
- Auto-grading and manual review
- Test scheduling and batch assignment
- Performance analysis and feedback

### 👥 Communication
- Parent-teacher communication portal
- Automated progress reports
- Announcement system
- SMS and email integration

### 💰 Billing & Subscriptions
- Subscription management
- Invoice generation
- Payment tracking
- Revenue analytics

### 🎨 White-Label Customization
- Custom branding and themes
- Domain customization
- Email template personalization
- Mobile app branding

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.2+ (strict mode)
- **Styling**: Tailwind CSS v4 + Radix UI
- **Database**: Supabase (PostgreSQL + Realtime)
- **Authentication**: Supabase Auth with RLS
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Supabase account
- Environment variables configured

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your Supabase credentials and other required environment variables.

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3002`

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard pages
│   ├── login/             # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── services/             # API service layers
├── stores/               # Zustand state management
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Key Features Implementation

### Authentication & Authorization
- Role-based access control (Institute Owner, Teacher, Admin Staff, Parent)
- Supabase Auth integration with middleware protection
- Session management and automatic token refresh

### Dashboard & Navigation
- Responsive sidebar with role-based menu items
- Real-time metrics and analytics
- Quick action buttons for common tasks

### Student Management
- Advanced filtering and search capabilities
- Bulk operations (import, export, assign batches)
- Detailed performance tracking
- Parent contact management

### Assessment System
- Integration with NEETAI question bank
- Custom test creation with multiple question types
- Automated grading and analysis
- Scheduling and batch assignment

### Analytics & Reporting
- Student performance trends
- Batch comparison analytics
- Subject-wise insights
- Predictive NEET score modeling

### Communication System
- Multi-channel notifications (email, SMS, in-app)
- Parent-teacher communication
- Automated progress reports
- Announcement system

## API Integration

The coach portal integrates with the main NEETAI platform through:

- **Question Bank API**: Access to 50,000+ NEET questions
- **AI Tutoring API**: AI-powered explanations and insights
- **Analytics API**: Advanced performance analytics
- **Sync APIs**: Real-time data synchronization

## Security & Compliance

- Row Level Security (RLS) policies
- Input validation and sanitization
- Audit logging for critical actions
- GDPR compliance tools
- Rate limiting and DDoS protection

## Deployment

The application is deployed on Vercel with:

- Automatic deployments from Git
- Environment variable management
- CDN for static assets
- Performance monitoring
- SSL certificates

## Subscription Tiers

### White-Label Solution
- **Setup Fee**: ₹5,00,000 (one-time)
- **Monthly per student**: ₹99
- **Minimum**: 100 students
- Custom branding, dedicated support, analytics portal

### Integration Package
- **API Access**: ₹50,000/month
- **Teacher Dashboard**: ₹25,000/month
- Question bank, AI tutoring, analytics APIs

### School Partnerships
- **Institution License**: ₹2,00,000/year
- Unlimited students, complete curriculum integration
- Teacher training and support included

## Support

For technical support and questions:
- Create an issue in the repository
- Contact the NEETAI development team
- Check the documentation and guides

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for NEET coaching institutes across India.