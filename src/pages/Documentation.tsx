import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Documentation() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden in print */}
      <div className="print:hidden sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
        <Button onClick={handlePrint} className="gap-2">
          <FileDown className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
        {/* Cover Page */}
        <div className="text-center mb-16 print:mb-12 print:pt-20">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-foreground font-bold text-3xl">U</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Ubuntu Hub</h1>
          <p className="text-xl text-muted-foreground mb-4">Developer Handover Documentation</p>
          <p className="text-sm text-muted-foreground">Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Table of Contents */}
        <section className="mb-12 print:break-after-page">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Project Overview</li>
            <li>Technology Stack</li>
            <li>Project Structure</li>
            <li>Database Schema</li>
            <li>Authentication System</li>
            <li>Design System</li>
            <li>Routes & Pages</li>
            <li>Environment Variables</li>
            <li>Key Files Reference</li>
            <li>Getting Started</li>
          </ol>
        </section>

        {/* 1. Project Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">1. Project Overview</h2>
          <p className="text-muted-foreground mb-4">
            Ubuntu Hub is a comprehensive <strong>community management platform</strong> designed for associations, 
            churches, clubs, and community organizations. Built around Kootami's 5-pillar architecture:
          </p>
          <div className="grid gap-3">
            {[
              { title: "Association & Community Management", desc: "Chapters, member/group management, membership plans, facility booking" },
              { title: "Event & Conference Management", desc: "Event creation, ticketing, check-in, volunteer coordination, analytics" },
              { title: "Fundraising & Donations", desc: "Campaign creation, donation processing, approval workflows" },
              { title: "Member App & Business Networking", desc: "Mobile-first member app, business profile promotion, community services" },
              { title: "Admin, Billing & Integrations", desc: "Central dashboard, billing/finance, security, third-party integrations" },
            ].map((pillar, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold text-foreground">{i + 1}. {pillar.title}</h4>
                <p className="text-sm text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Technology Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">2. Technology Stack</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">Layer</th>
                  <th className="text-left py-2 px-4 font-semibold">Technology</th>
                  <th className="text-left py-2 px-4 font-semibold">Version</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-2 px-4">Frontend Framework</td><td className="py-2 px-4">React + TypeScript</td><td className="py-2 px-4">^18.3.1</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Build Tool</td><td className="py-2 px-4">Vite</td><td className="py-2 px-4">Latest</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Styling</td><td className="py-2 px-4">Tailwind CSS</td><td className="py-2 px-4">Latest</td></tr>
                <tr className="border-b"><td className="py-2 px-4">UI Components</td><td className="py-2 px-4">shadcn/ui + Radix</td><td className="py-2 px-4">Latest</td></tr>
                <tr className="border-b"><td className="py-2 px-4">State Management</td><td className="py-2 px-4">TanStack React Query</td><td className="py-2 px-4">^5.83.0</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Routing</td><td className="py-2 px-4">React Router</td><td className="py-2 px-4">^6.30.1</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Backend</td><td className="py-2 px-4">Lovable Cloud (Supabase)</td><td className="py-2 px-4">^2.88.0</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Authentication</td><td className="py-2 px-4">Supabase Auth</td><td className="py-2 px-4">Built-in</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Animations</td><td className="py-2 px-4">Framer Motion</td><td className="py-2 px-4">^12.23.26</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Forms</td><td className="py-2 px-4">React Hook Form + Zod</td><td className="py-2 px-4">^7.61.1</td></tr>
                <tr className="border-b"><td className="py-2 px-4">Charts</td><td className="py-2 px-4">Recharts</td><td className="py-2 px-4">^2.15.4</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Project Structure */}
        <section className="mb-12 print:break-before-page">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">3. Project Structure</h2>
          <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
{`ubuntu-hub/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── layout/            # AppLayout, Sidebar, TopNav, BottomNav, MobileMenu
│   │   ├── ui/                # shadcn components (50+ components)
│   │   └── fundraise/         # Feature-specific components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.tsx        # Authentication context & methods
│   │   ├── useProfile.tsx     # User profile management
│   │   ├── useEvents.tsx      # Events data hook
│   │   ├── useOrganizations.tsx
│   │   ├── useFundraising.tsx
│   │   ├── usePolls.tsx
│   │   └── ... (12+ hooks)
│   ├── pages/                 # Route page components (40+ pages)
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts      # Supabase client (auto-generated)
│   │       └── types.ts       # Database types (auto-generated)
│   ├── data/
│   │   └── mockData.ts        # Development mock data
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts           # Utility functions (cn, etc.)
│   ├── App.tsx                # Main app with routes
│   ├── App.css                # Global styles
│   ├── index.css              # Tailwind + CSS variables
│   └── main.tsx               # React entry point
├── supabase/
│   ├── config.toml            # Supabase configuration
│   └── migrations/            # Database migrations
├── .env                       # Environment variables
├── tailwind.config.ts         # Tailwind configuration
├── vite.config.ts             # Vite configuration
└── package.json               # Dependencies`}
          </pre>
        </section>

        {/* 4. Database Schema */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">4. Database Schema</h2>
          <p className="text-muted-foreground mb-4">The database consists of 19 tables with Row Level Security (RLS) enabled:</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">User Management</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">profiles</td><td className="py-2 px-3">Extended user information</td><td className="py-2 px-3">full_name, bio, avatar_url, occupation, location, interests[]</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">user_roles</td><td className="py-2 px-3">Role-based access control</td><td className="py-2 px-3">role (enum), organization_id, chapter_id</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Organization Management</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">organizations</td><td className="py-2 px-3">Main organizations</td><td className="py-2 px-3">name, description, owner_id, logo_url</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">chapters</td><td className="py-2 px-3">Sub-divisions</td><td className="py-2 px-3">name, organization_id, location</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">groups</td><td className="py-2 px-3">Community groups</td><td className="py-2 px-3">name, group_type, organization_id</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">group_members</td><td className="py-2 px-3">Group membership</td><td className="py-2 px-3">group_id, user_id, role</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Events</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">events</td><td className="py-2 px-3">Event listings</td><td className="py-2 px-3">title, start_date, location, category, is_ticketed, ticket_price</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">event_registrations</td><td className="py-2 px-3">User signups</td><td className="py-2 px-3">event_id, user_id, status, ticket_code</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">event_sponsors</td><td className="py-2 px-3">Event sponsors</td><td className="py-2 px-3">event_id, name, tier, logo_url</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Business Directory</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">businesses</td><td className="py-2 px-3">Business listings</td><td className="py-2 px-3">name, category, is_verified, organization_id</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">business_cards</td><td className="py-2 px-3">Digital business cards</td><td className="py-2 px-3">full_name, profession, company, template, colors</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">business_deals</td><td className="py-2 px-3">Special offers</td><td className="py-2 px-3">business_id, title, discount_type, discount_value</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Fundraising</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">fundraising_campaigns</td><td className="py-2 px-3">Donation campaigns</td><td className="py-2 px-3">title, goal_amount, raised_amount, status</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">donations</td><td className="py-2 px-3">Donation records</td><td className="py-2 px-3">campaign_id, amount, donor_name, is_anonymous</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Engagement Features</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">polls</td><td className="py-2 px-3">Community polls</td><td className="py-2 px-3">title, poll_type, is_anonymous, end_date</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">poll_options</td><td className="py-2 px-3">Poll choices</td><td className="py-2 px-3">poll_id, option_text, vote_count</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">poll_votes</td><td className="py-2 px-3">User votes</td><td className="py-2 px-3">poll_id, option_id, user_id</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">announcements</td><td className="py-2 px-3">Community announcements</td><td className="py-2 px-3">title, content, priority, is_pinned</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Facilities & Volunteering</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">facilities</td><td className="py-2 px-3">Bookable venues</td><td className="py-2 px-3">name, capacity, hourly_rate, amenities[]</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">facility_bookings</td><td className="py-2 px-3">Reservations</td><td className="py-2 px-3">facility_id, start_time, end_time, status</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">volunteer_opportunities</td><td className="py-2 px-3">Volunteer listings</td><td className="py-2 px-3">title, skills_needed[], spots_available</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">volunteer_signups</td><td className="py-2 px-3">Volunteer signups</td><td className="py-2 px-3">opportunity_id, user_id, status</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Membership & Documents</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3">Table</th><th className="text-left py-2 px-3">Purpose</th><th className="text-left py-2 px-3">Key Fields</th></tr></thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 px-3 font-mono">membership_plans</td><td className="py-2 px-3">Subscription tiers</td><td className="py-2 px-3">name, price, duration_months, features[]</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">member_subscriptions</td><td className="py-2 px-3">Active memberships</td><td className="py-2 px-3">plan_id, user_id, status, payment_status</td></tr>
                  <tr className="border-b"><td className="py-2 px-3 font-mono">documents</td><td className="py-2 px-3">File storage</td><td className="py-2 px-3">title, file_url, category, is_public</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">User Roles (Enum)</h4>
            <code className="text-sm">super_admin | chapter_admin | event_manager | finance_manager | moderator | member</code>
          </div>
        </section>

        {/* 5. Authentication */}
        <section className="mb-12 print:break-before-page">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">5. Authentication System</h2>
          
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Auth Provider</h4>
              <p className="text-sm text-muted-foreground">Uses Supabase Auth with email/password authentication. Email verification is required before sign-in.</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Auth Context (useAuth hook)</h4>
              <pre className="text-sm overflow-x-auto mt-2">
{`interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email, password, fullName, phone?) => Promise<{ error }>;
  signIn: (email, password) => Promise<{ error }>;
  signOut: () => Promise<void>;
}`}
              </pre>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Protected Routes</h4>
              <p className="text-sm text-muted-foreground">Routes without layout: <code>/onboarding</code>, <code>/auth</code></p>
              <p className="text-sm text-muted-foreground mt-1">All other routes wrapped in <code>AppLayout</code> component.</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Profile Auto-Creation</h4>
              <p className="text-sm text-muted-foreground">A database trigger automatically creates a profile row when a new user signs up.</p>
            </div>
          </div>
        </section>

        {/* 6. Design System */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">6. Design System</h2>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Theme</h4>
              <p className="text-muted-foreground">Light mode only with a lavender/magenta color palette.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Color Tokens (CSS Variables)</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-background border"></div><code>--background</code></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-foreground"></div><code>--foreground</code></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-primary"></div><code>--primary</code></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-secondary"></div><code>--secondary</code></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-muted"></div><code>--muted</code></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-accent"></div><code>--accent</code></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-card border"></div><code>--card</code></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-destructive"></div><code>--destructive</code></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Gradients</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><div className="w-12 h-6 rounded gradient-primary"></div><code className="text-sm">gradient-primary</code></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Component Library</h4>
              <p className="text-muted-foreground text-sm">50+ shadcn/ui components in <code>src/components/ui/</code></p>
              <p className="text-muted-foreground text-sm mt-1">Key components: Button, Card, Dialog, Sheet, Form, Input, Select, Table, Tabs, Toast</p>
            </div>
          </div>
        </section>

        {/* 7. Routes */}
        <section className="mb-12 print:break-before-page">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">7. Routes & Pages</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Route</th>
                  <th className="text-left py-2 px-3">Page</th>
                  <th className="text-left py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-2 px-3 font-mono">/</td><td className="py-2 px-3">Home</td><td className="py-2 px-3">Dashboard with quick actions</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/auth</td><td className="py-2 px-3">Auth</td><td className="py-2 px-3">Login/Signup forms</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/onboarding</td><td className="py-2 px-3">Onboarding</td><td className="py-2 px-3">New user onboarding</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/profile</td><td className="py-2 px-3">Profile</td><td className="py-2 px-3">User profile page</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/settings</td><td className="py-2 px-3">Settings</td><td className="py-2 px-3">App settings</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/organizations</td><td className="py-2 px-3">Organizations</td><td className="py-2 px-3">Organization listing</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/organizations/create</td><td className="py-2 px-3">CreateOrganization</td><td className="py-2 px-3">New organization form</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/organizations/:id</td><td className="py-2 px-3">OrganizationDetails</td><td className="py-2 px-3">Organization detail view</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/events</td><td className="py-2 px-3">Events</td><td className="py-2 px-3">Events listing</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/events/create</td><td className="py-2 px-3">CreateEvent</td><td className="py-2 px-3">New event form</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/events/:id</td><td className="py-2 px-3">EventDetails</td><td className="py-2 px-3">Event detail view</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/businesses</td><td className="py-2 px-3">Businesses</td><td className="py-2 px-3">Business directory</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/business-cards</td><td className="py-2 px-3">BusinessCards</td><td className="py-2 px-3">Digital business cards</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/business-cards/create</td><td className="py-2 px-3">BusinessCardCreate</td><td className="py-2 px-3">Create/edit card</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/business-cards/:id</td><td className="py-2 px-3">BusinessCardView</td><td className="py-2 px-3">View card</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/fundraise</td><td className="py-2 px-3">Fundraise</td><td className="py-2 px-3">Fundraising campaigns</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/fundraise/create</td><td className="py-2 px-3">CreateCampaign</td><td className="py-2 px-3">New campaign form</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/fundraise/:id</td><td className="py-2 px-3">CampaignDetails</td><td className="py-2 px-3">Campaign detail view</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/members</td><td className="py-2 px-3">MemberDirectory</td><td className="py-2 px-3">Member listing</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/groups</td><td className="py-2 px-3">Groups</td><td className="py-2 px-3">Community groups</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/groups/create</td><td className="py-2 px-3">CreateGroup</td><td className="py-2 px-3">New group form</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/polls</td><td className="py-2 px-3">Polls</td><td className="py-2 px-3">Community polls</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/facilities</td><td className="py-2 px-3">FacilityBooking</td><td className="py-2 px-3">Venue reservations</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/volunteers</td><td className="py-2 px-3">Volunteers</td><td className="py-2 px-3">Volunteer opportunities</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/announcements</td><td className="py-2 px-3">Announcements</td><td className="py-2 px-3">Community announcements</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/documents</td><td className="py-2 px-3">Documents</td><td className="py-2 px-3">Document storage</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/memberships</td><td className="py-2 px-3">Memberships</td><td className="py-2 px-3">Membership plans</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/more</td><td className="py-2 px-3">More</td><td className="py-2 px-3">Additional features</td></tr>
                <tr className="border-b"><td className="py-2 px-3 font-mono">/help</td><td className="py-2 px-3">Help</td><td className="py-2 px-3">Help & support</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 8. Environment Variables */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">8. Environment Variables</h2>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <pre className="text-sm">
{`# .env (auto-generated, do not edit)
VITE_SUPABASE_PROJECT_ID="cckndwjrpedaqdgxttse"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJI..."
VITE_SUPABASE_URL="https://cckndwjrpedaqdgxttse.supabase.co"`}
            </pre>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Note:</strong> These environment variables are auto-generated and managed by Lovable Cloud. Do not edit manually.
          </p>
        </section>

        {/* 9. Key Files */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">9. Key Files Reference</h2>
          
          <div className="space-y-3">
            {[
              { file: "src/App.tsx", desc: "Main app component with route definitions and provider wrappers" },
              { file: "src/main.tsx", desc: "React entry point, renders App component" },
              { file: "src/hooks/useAuth.tsx", desc: "Authentication context provider and hook" },
              { file: "src/hooks/useProfile.tsx", desc: "User profile data fetching and updates" },
              { file: "src/components/layout/AppLayout.tsx", desc: "Main layout with sidebar/nav" },
              { file: "src/components/layout/Sidebar.tsx", desc: "Desktop sidebar navigation" },
              { file: "src/components/layout/BottomNav.tsx", desc: "Mobile bottom navigation" },
              { file: "src/integrations/supabase/client.ts", desc: "Supabase client (auto-generated)" },
              { file: "src/integrations/supabase/types.ts", desc: "Database TypeScript types (auto-generated, read-only)" },
              { file: "src/index.css", desc: "Global styles and CSS variables" },
              { file: "tailwind.config.ts", desc: "Tailwind CSS configuration" },
              { file: "src/data/mockData.ts", desc: "Mock data for development" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 text-sm">
                <code className="font-mono text-primary whitespace-nowrap">{item.file}</code>
                <span className="text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Getting Started */}
        <section className="mb-12 print:break-before-page">
          <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">10. Getting Started</h2>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Prerequisites</h4>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                <li>Node.js 18+ and npm</li>
                <li>Git</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Local Development</h4>
              <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
{`# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd ubuntu-hub

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Important Notes</h4>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                <li>Do not edit auto-generated files: <code>client.ts</code>, <code>types.ts</code>, <code>.env</code></li>
                <li>Database changes should be made through migrations</li>
                <li>Use semantic color tokens instead of hardcoded colors</li>
                <li>Follow existing component patterns for consistency</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm border-t pt-8 mt-12">
          <p>Ubuntu Hub - Community United</p>
          <p className="mt-1">Documentation generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:break-before-page { break-before: page; }
          .print\\:break-after-page { break-after: page; }
          @page { margin: 1in; size: A4; }
        }
      `}</style>
    </div>
  );
}
