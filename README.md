# Dreams Home - Real Estate Platform

A production-ready, buyer-focused real estate website with a complete admin panel.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (Database + Authentication)
- **Deployment**: Vercel

## Features

### Buyer Website
- Hero section with search
- Property search and filtering
- Property listing with pagination
- Detailed property pages
- Enquiry forms
- WhatsApp integration
- Mobile-first responsive design
- SEO optimized

### Admin Panel
- Secure authentication
- Dashboard with statistics
- Property management (CRUD)
- Lead management
- Image upload
- Tag management

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real-estate-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the SQL schema:
   - Open Supabase SQL Editor
   - Copy and execute `supabase-schema.sql`

3. Configure Authentication:
   - Go to Authentication > Providers
   - Enable Email/Password provider

4. Create admin user:
   - Go to Authentication > Users
   - Add new user with admin email

## Deployment

### Vercel Deployment

1. Push your code to GitHub

2. Import repository in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Add New Project
   - Import your GitHub repository

3. Configure environment variables in Vercel:
   - Go to Settings > Environment Variables
   - Add all variables from `.env.example`

4. Deploy:
   - Click Deploy
   - Wait for build to complete

### Custom Domain (Optional)

1. Go to Vercel Project Settings > Domains
2. Add your custom domain
3. Configure DNS records

## Project Structure

```
app/
  ├── layout.tsx           # Root layout
  ├── page.tsx             # Homepage
  ├── properties/
  │   ├── page.tsx         # Property listing
  │   └── [id]/page.tsx    # Property detail
  ├── contact/page.tsx     # Contact page
  └── admin/
      ├── login/page.tsx   # Admin login
      ├── dashboard/page.tsx
      ├── properties/      # Property management
      └── leads/page.tsx   # Lead management

components/
  ├── Header/
  ├── Footer/
  ├── Hero/
  ├── SearchBar/
  ├── PropertyCard/
  ├── EnquiryForm/
  ├── Filters/
  ├── Testimonials/
  ├── MobileStickyCTA/
  └── Admin/
      ├── Sidebar/
      └── ProtectedRoute/

lib/
  ├── supabase.ts          # Supabase client
  ├── auth.ts              # Auth utilities
  └── whatsapp.ts          # WhatsApp integration

types/
  ├── property.ts          # Property types
  └── lead.ts              # Lead types
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp phone number |

## Performance Targets

- Lighthouse Score ≥ 90
- Core Web Vitals compliant
- Lazy loading for images
- Optimized bundle size

## License

MIT License
