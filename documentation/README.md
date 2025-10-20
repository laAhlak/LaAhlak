# LaAhlak - Europe → Jordan Remittance PWA

A modern, mobile-first Progressive Web Application (PWA) for seamless money transfers from Europe to Jordan. LaAhlak offers competitive 4% fees, live exchange rates, and a Revolut-inspired interface for secure and efficient remittances.

## 🌍 Overview

LaAhlak is a specialized remittance platform designed to facilitate money transfers from Europe to Jordan with:
- **Low Fees**: Only 4% transaction fee
- **Live Exchange Rates**: Real-time currency conversion
- **Fast Transfers**: Quick and secure money transfers
- **PWA Support**: Install as a native app on any device
- **Mobile-First**: Optimized for mobile banking experience

## 🚀 Features

- **Secure Authentication**: Supabase-powered user management
- **Live Exchange Rates**: Real-time EUR to JOD conversion
- **Payment Processing**: Stripe integration for secure transactions
- **Transaction History**: Complete transfer tracking and analytics
- **Beneficiary Management**: Save and manage recipient details
- **PWA Capabilities**: Install as native app with offline support
- **Analytics**: Plausible integration for privacy-focused analytics
- **Mobile-First Design**: Optimized for mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Styling**: TailwindCSS
- **Analytics**: Plausible
- **Language**: TypeScript
- **PWA**: Next.js PWA capabilities
- **Authentication**: Supabase Auth

## 🎨 Design System

### Color Palette
- **Primary**: #00C38A (Green)
- **Dark Background**: #0B1220
- **Secondary Dark**: #1e293b
- **Text**: White/Gray variations
- **Accents**: Primary color variations

### Typography
- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

## 📱 Pages

- **Home** (`/`): Landing page with feature overview
- **Login** (`/login`): Authentication page
- **Dashboard** (`/dashboard`): Main app interface with balance and transactions
- **Send** (`/send`): Money transfer functionality
- **Settings** (`/settings`): User preferences and account management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Supabase account
- Stripe account
- Plausible account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd laahlak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain (optional)
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel + Supabase Deployment

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations
   - Configure Row Level Security (RLS) policies
   - Set up authentication providers

3. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure Supabase URL and keys are correctly set
   - Configure Stripe webhooks for production

4. **Set up Domain**
   - Configure custom domain in Vercel
   - Update Supabase auth settings with production URL
   - Configure Plausible analytics domain

## 📁 Project Structure

```
laahlak/
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication page
│   ├── dashboard/         # Main dashboard with balance & transactions
│   ├── send/              # Money transfer functionality
│   ├── settings/          # User preferences & account management
│   ├── api/               # API routes for Stripe & Supabase
│   ├── globals.css        # Global styles & PWA styles
│   ├── layout.tsx         # Root layout with PWA meta
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useStripe.ts      # Stripe integration hook
│   └── useLocalStorage.ts # Local storage hook
├── lib/                  # Core utilities
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe configuration
│   └── utils.ts          # Utility functions
├── utils/                # Additional utilities
│   ├── constants.ts      # App constants
│   ├── validation.ts     # Form validation
│   └── exchange.ts       # Exchange rate utilities
├── public/               # Static assets & PWA files
│   ├── icons/            # PWA icons
│   └── manifest.json     # PWA manifest
├── supabase/             # Database migrations & functions
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # TailwindCSS configuration
└── package.json          # Dependencies and scripts
```

## 🗺️ Future Roadmap

### Phase 1: Core Features (Current)
- ✅ PWA with mobile-first design
- ✅ Supabase authentication
- ✅ Stripe payment integration
- ✅ Basic remittance functionality
- ✅ Live exchange rates

### Phase 2: Enhanced Features
- 🔄 Native mobile apps (iOS & Android)
- 🔄 Push notifications for transaction updates
- 🔄 Saved beneficiaries management
- 🔄 Advanced transaction analytics
- 🔄 Multi-language support (Arabic/English)

### Phase 3: Advanced Features
- 📋 Biometric authentication
- 📋 Advanced fraud detection
- 📋 Multi-currency support
- 📋 Business accounts
- 📋 API for third-party integrations

### Phase 4: Scale & Growth
- 📋 Referral program
- 📋 Loyalty rewards
- 📋 Advanced compliance features
- 📋 White-label solutions

## 🎯 Key Features

### Remittance-Specific Features
- **Live Exchange Rates**: Real-time EUR to JOD conversion
- **Low Fees**: Competitive 4% transaction fee
- **Fast Transfers**: Quick processing times
- **Beneficiary Management**: Save recipient details
- **Transaction Tracking**: Complete transfer history
- **PWA Support**: Install as native app

### Technical Features
- **Secure Authentication**: Supabase-powered user management
- **Payment Processing**: Stripe integration for secure transactions
- **Real-time Updates**: Live data synchronization
- **Offline Support**: PWA capabilities for offline usage
- **Analytics**: Privacy-focused analytics with Plausible

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Analytics (Optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain

# Exchange Rate API (Optional)
NEXT_PUBLIC_EXCHANGE_API_KEY=your_exchange_api_key
```

## 📱 PWA Features

- **Installable**: Add to home screen on any device
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Transaction updates and alerts
- **App-like Experience**: Native app feel in browser
- **Fast Loading**: Optimized for mobile networks

## 🔒 Security Features

- **End-to-End Encryption**: Secure data transmission
- **PCI Compliance**: Stripe handles payment security
- **Row Level Security**: Database-level access control
- **Authentication**: Secure user management
- **Fraud Detection**: Advanced security measures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Revolut
- Built with Next.js, Supabase, and Stripe
- PWA capabilities powered by Next.js
- Analytics by Plausible

---

**LaAhlak** - Europe → Jordan Remittance Made Simple 💸🇯🇴
