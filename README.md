# GetMeAChai ☕

**A modern crowdfunding platform for creators to receive support from their audience**

GetMeAChai is a full-stack Next.js application that allows creators to set up personalized pages where supporters can make donations ("buy them a chai") to help fund their creative projects and goals.

![GetMeAChai Banner](public/img1.png)

## ✨ Features

### 🎨 **Creator Pages**
- **Personalized Profiles**: Custom creator pages with cover photos, profile pictures, and detailed descriptions
- **Dynamic Content**: About sections, skills showcase, recent updates, and social links
- **Goal Tracking**: Set funding goals with progress visualization
- **Statistics Dashboard**: View supporters, total funds raised, and ratings

### 💰 **Payment Processing**
- **Stripe Integration**: Secure payment processing with multiple payment methods
- **Flexible Donations**: Predefined amounts ($3, $5, $10, $25, $50) or custom amounts
- **Personal Messages**: Supporters can include encouraging messages with their donations
- **Real-time Updates**: Instant payment confirmations and goal progress updates

### 🔐 **Authentication System**
- **Multiple Sign-in Options**: Google, GitHub, and email/password authentication
- **Next-Auth Integration**: Secure session management with JWT tokens
- **Protected Routes**: Dashboard and admin areas require authentication
- **User Management**: Profile creation and management system

### 📊 **Admin Dashboard**
- **Payment Management**: View all payments, track earnings, and manage withdrawals
- **Analytics Overview**: Total earnings, available balance, and pending payments
- **Account Settings**: Manage profile information and page settings
- **Withdrawal System**: Request withdrawals with automatic fee calculation (5% platform fee)

### 🌐 **Discovery System**
- **Creator Discovery**: Browse and search through creator profiles
- **Category Filtering**: Filter by Technology, Art & Design, Music, Gaming, Education, etc.
- **Search Functionality**: Search by creator name, skills, or keywords
- **Grid/List Views**: Toggle between different viewing modes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎯 **User Experience**
- **Dynamic Page Titles**: SEO-friendly titles that change based on content
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Comprehensive error pages with helpful navigation
- **Toast Notifications**: Real-time feedback for user actions
- **Responsive Navigation**: Mobile-friendly navigation with dropdown menus

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.3.5**: React framework with App Router
- **React 19.0.0**: Modern React with hooks and concurrent features
- **Tailwind CSS 4**: Utility-first CSS framework for styling
- **Lucide React**: Modern icon library
- **Framer Motion**: Smooth animations and transitions
- **React Toastify**: Toast notifications

### **Backend**
- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: NoSQL database for user and payment data
- **Mongoose**: MongoDB object modeling for Node.js
- **NextAuth.js**: Authentication library with multiple providers

### **Payment Processing**
- **Stripe**: Payment processing and checkout sessions
- **Webhook Handling**: Real-time payment status updates
- **Secure Transactions**: PCI-compliant payment handling

### **Development Tools**
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS post-processing
- **Critters**: Critical CSS inlining
- **Tailwind Merge**: Utility class merging

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun
- MongoDB database (local or cloud)
- Stripe account for payment processing

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/get-me-a-chai.git
cd get-me-a-chai
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### **3. Environment Variables**
Create a `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=your URI
# or for MongoDB Atlas:
# MONGODB_URI= your URI

# NextAuth Configuration
NEXTAUTH_URL=your URL
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Configuration (Optional)
EMAIL_SERVER=smtp://username:password@smtp.gmail.com:587
EMAIL_FROM=noreply@getmeachai.com
```

### **4. Database Setup**
The application will automatically create the necessary collections in MongoDB. You can optionally seed the database with sample data:

```bash
npm run seed-pages
```

### **5. Stripe Setup**
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints for payment processing
4. Configure webhook events: `checkout.session.completed`, `payment_intent.succeeded`, etc.

### **6. Run the Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Production Deployment

### **Build the Application**
```bash
npm run build
npm start
```

### **Environment Setup**
- Configure production environment variables
- Set up MongoDB Atlas for cloud database
- Configure Stripe webhook endpoints for production
- Set up proper domain for NextAuth

### **Deployment Options**
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative with good Next.js support
- **Railway**: Simple deployment with database hosting
- **Docker**: Containerized deployment

## 📁 Project Structure

```
get-me-a-chai/
├── app/                          # Next.js App Router
│   ├── [username]/               # Dynamic creator pages
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── admin/                # Admin API endpoints
│   │   ├── create-checkout-session/ # Stripe checkout
│   │   ├── webhooks/             # Stripe webhooks
│   │   └── ...                   # Other API endpoints
│   ├── create-page/              # Creator page creation
│   ├── dashboard/                # User dashboard
│   ├── discover/                 # Creator discovery
│   ├── edit-page/                # Page editing
│   ├── signin/                   # Authentication pages
│   ├── signup/
│   ├── success/                  # Payment success
│   ├── cancel/                   # Payment cancellation
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ChaiButton.js            # Payment button component
│   ├── Footer.js                # Site footer
│   ├── Main.js                  # Homepage component
│   ├── Navbar.js                # Navigation bar
│   └── SessionWrapper.js        # Auth wrapper
├── hooks/                        # Custom React hooks
│   └── useDocumentTitle.js      # Dynamic page titles
├── lib/                          # Utility libraries
│   ├── mongodb.js               # Database connection
│   └── userUtils.js             # User-related utilities
├── models/                       # MongoDB models
│   ├── Page.js                  # Creator page model
│   ├── Payment.js               # Payment model
│   └── User.js                  # User model
├── public/                       # Static assets
├── scripts/                      # Utility scripts
│   └── seedPages.js             # Database seeding
└── package.json                 # Dependencies and scripts
```

## 🎯 Usage Guide

### **For Creators**
1. **Sign Up**: Create an account using email, Google, or GitHub
2. **Create Page**: Set up your creator profile with description, goals, and links
3. **Customize**: Add cover photos, profile pictures, and detailed information
4. **Share**: Share your page URL with supporters
5. **Manage**: Use the dashboard to track payments and manage your page

### **For Supporters**
1. **Discover**: Browse creators on the discover page
2. **Explore**: View creator profiles and their goals
3. **Support**: Choose an amount and leave a message
4. **Payment**: Complete secure payment through Stripe
5. **Confirmation**: Receive payment confirmation and updates

### **Admin Features**
- View all payments and earnings
- Request withdrawals (5% platform fee)
- Manage account settings
- Edit page information
- View analytics and statistics

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signup` - Create new user account
- `GET /api/auth/session` - Get current session

### **Pages**
- `GET /api/pages` - Get all creator pages
- `GET /api/page?username=...` - Get specific creator page
- `POST /api/page` - Create new creator page
- `PUT /api/page` - Update creator page

### **Payments**
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/save-payment` - Save payment record
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### **Admin**
- `GET /api/admin/account` - Get admin account info
- `GET /api/admin/payments` - Get payment history
- `POST /api/admin/withdraw` - Request withdrawal

## 🐛 Known Issues & Limitations

- **Mobile Optimization**: Some admin dashboard features may need mobile improvements
- **File Uploads**: Currently uses URL-based image uploads (no file upload system)
- **Email Notifications**: Email system not fully implemented
- **Subscription Support**: Only one-time payments supported (no recurring subscriptions)
- **Multi-currency**: Only USD currency supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow ESLint configuration
- Write meaningful commit messages
- Test payment flows thoroughly
- Ensure responsive design
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Stripe**: For secure payment processing
- **MongoDB**: For flexible database solutions
- **Tailwind CSS**: For utility-first styling
- **Lucide Icons**: For beautiful icon library
- **Vercel**: For seamless deployment platform


---

**Made with ❤️ by creators, for creators**

*GetMeAChai - Turning creativity into sustainable income, one chai at a time ☕*
