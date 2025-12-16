import { motion } from "framer-motion";
import { 
  User, Bell, Lock, Globe, Moon, HelpCircle, 
  FileText, Shield, ChevronRight, LogOut
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", type: "link" as const },
      { icon: Lock, label: "Change Password", type: "link" as const },
      { icon: Globe, label: "Language", value: "English", type: "link" as const },
    ]
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Push Notifications", type: "toggle" as const, key: "notifications" },
      { icon: Bell, label: "Email Notifications", type: "toggle" as const, key: "emailNotifications" },
      { icon: Moon, label: "Dark Mode", type: "toggle" as const, key: "darkMode" },
    ]
  },
  {
    title: "Privacy & Security",
    items: [
      { icon: Shield, label: "Privacy Settings", type: "link" as const },
      { icon: Lock, label: "Two-Factor Auth", type: "link" as const },
      { icon: FileText, label: "Data & Storage", type: "link" as const },
    ]
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", type: "link" as const, path: "/help" },
      { icon: FileText, label: "Terms of Service", type: "link" as const },
      { icon: Shield, label: "Privacy Policy", type: "link" as const },
    ]
  },
];

export default function Settings() {
  const { toast } = useToast();
  const [toggles, setToggles] = useState({
    notifications: true,
    emailNotifications: false,
    darkMode: false,
  });

  const handleToggle = (key: string) => {
    setToggles(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} has been ${toggles[key as keyof typeof toggles] ? 'disabled' : 'enabled'}`,
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="app-container content-area">
      <Header title="Settings" showBack />
      
      <div className="px-4 max-w-md mx-auto">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * sectionIndex }}
            className="mb-6"
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h3>
            <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    index !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl gradient-primary-soft flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  
                  {item.type === "toggle" ? (
                    <Switch
                      checked={toggles[item.key as keyof typeof toggles]}
                      onCheckedChange={() => handleToggle(item.key!)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-xs text-muted-foreground">Ubuntu Hub v1.0.0</p>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 text-destructive font-medium hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
