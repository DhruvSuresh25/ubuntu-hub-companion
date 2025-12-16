import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Organizations from "./pages/Organizations";
import OrganizationDetails from "./pages/OrganizationDetails";
import Businesses from "./pages/Businesses";
import More from "./pages/More";
import BusinessCards from "./pages/BusinessCards";
import BusinessCardCreate from "./pages/BusinessCardCreate";
import BusinessCardView from "./pages/BusinessCardView";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Volunteers from "./pages/Volunteers";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Fundraise from "./pages/Fundraise";
import CampaignDetails from "./pages/CampaignDetails";
import CreateCampaign from "./pages/CreateCampaign";

const queryClient = new QueryClient();

// Layout component to conditionally show BottomNav
function AppLayout() {
  const location = useLocation();
  const hideNavRoutes = ["/onboarding", "/auth"];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organizations/:id" element={<OrganizationDetails />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/more" element={<More />} />
        <Route path="/business-cards" element={<BusinessCards />} />
        <Route path="/business-cards/create" element={<BusinessCardCreate />} />
        <Route path="/business-cards/:id" element={<BusinessCardView />} />
        <Route path="/business-cards/edit/:id" element={<BusinessCardCreate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/fundraise" element={<Fundraise />} />
        <Route path="/fundraise/create" element={<CreateCampaign />} />
        <Route path="/fundraise/:id" element={<CampaignDetails />} />
        {/* Placeholder routes */}
        <Route path="/documents" element={<More />} />
        <Route path="/gallery" element={<More />} />
        <Route path="/polls" element={<More />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppLayout />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
