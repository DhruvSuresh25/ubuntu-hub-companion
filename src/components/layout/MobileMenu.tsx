import { Link, useLocation } from "react-router-dom";
import { 
  Home, Calendar, Building2, Briefcase, Users, Megaphone, 
  CreditCard, Heart, FileText, Settings, HelpCircle, Vote,
  MapPin, UsersRound
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";

const allNavItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: Building2, label: "Organizations", path: "/organizations" },
  { icon: UsersRound, label: "Groups", path: "/groups" },
  { icon: Briefcase, label: "Businesses", path: "/businesses" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: CreditCard, label: "Business Cards", path: "/business-cards" },
  { icon: Heart, label: "Fundraise", path: "/fundraise" },
  { icon: Megaphone, label: "Announcements", path: "/announcements" },
  { icon: Vote, label: "Polls", path: "/polls" },
  { icon: MapPin, label: "Facilities", path: "/facilities" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help", path: "/help" },
];

export function MobileMenu() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-sidebar-background">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">K</span>
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">Kootami</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {allNavItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <SheetClose asChild key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-primary font-medium" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span>{item.label}</span>
              </Link>
            </SheetClose>
          );
        })}
      </nav>
    </div>
  );
}
