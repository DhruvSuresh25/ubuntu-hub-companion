import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import Organizations from "./pages/Organizations";
import Businesses from "./pages/Businesses";
import More from "./pages/More";
import BusinessCards from "./pages/BusinessCards";
import BusinessCardCreate from "./pages/BusinessCardCreate";
import BusinessCardView from "./pages/BusinessCardView";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/more" element={<More />} />
          <Route path="/business-cards" element={<BusinessCards />} />
          <Route path="/business-cards/create" element={<BusinessCardCreate />} />
          <Route path="/business-cards/:id" element={<BusinessCardView />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
