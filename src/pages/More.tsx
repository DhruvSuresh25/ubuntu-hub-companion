import { motion } from "framer-motion";
import { 
  CreditCard, Heart, FileText, Users, ImageIcon, 
  Megaphone, Vote, Settings, HelpCircle, LogOut,
  ChevronRight, User
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { mockUser } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuSections = [
  {
    title: "Services",
    items: [
      { icon: CreditCard, label: "Business Cards", path: "/business-cards", badge: "2" },
      { icon: Heart, label: "Donations", path: "/donations" },
      { icon: Users, label: "Volunteers", path: "/volunteers" },
      { icon: Megaphone, label: "Announcements", path: "/announcements" },
    ]
  },
  {
    title: "Content",
    items: [
      { icon: FileText, label: "Documents", path: "/documents" },
      { icon: ImageIcon, label: "Gallery", path: "/gallery" },
      { icon: Vote, label: "Polls", path: "/polls" },
    ]
  },
  {
    title: "Account",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
      { icon: HelpCircle, label: "Help & Support", path: "/help" },
    ]
  },
];

export default function More() {
  return (
    <div className="app-container content-area">
      <Header title="More" />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/profile"
            className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-soft card-hover"
          >
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={mockUser.avatar} />
              <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{mockUser.name}</h3>
              <p className="text-muted-foreground text-sm">{mockUser.email}</p>
              <p className="text-primary text-xs mt-1">{mockUser.profession}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </motion.div>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (sectionIndex + 1) }}
            className="mb-6"
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h3>
            <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
              {section.items.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors ${
                    index !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary-soft flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="flex-1 font-medium text-foreground">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button className="w-full flex items-center justify-center gap-2 py-3 text-destructive font-medium hover:bg-destructive/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
