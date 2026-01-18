import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Bell, Lock, Globe, HelpCircle, 
  FileText, Shield, ChevronRight, LogOut
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const [toggles, setToggles] = useState({
    notifications: true,
    emailNotifications: false,
  });

  // Dialog states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleItemClick = (label: string, path?: string) => {
    if (path) {
      navigate(path);
      return;
    }

    switch (label) {
      case "Edit Profile":
        setEditProfileOpen(true);
        break;
      case "Change Password":
        setChangePasswordOpen(true);
        break;
      case "Language":
        setLanguageOpen(true);
        break;
      case "Privacy Settings":
      case "Two-Factor Auth":
      case "Data & Storage":
      case "Terms of Service":
      case "Privacy Policy":
        toast({
          title: "Coming Soon",
          description: `${label} will be available soon.`,
        });
        break;
      default:
        break;
    }
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setEditProfileOpen(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    });
    setChangePasswordOpen(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    toast({
      title: "Language Changed",
      description: `Language has been changed to ${value}.`,
    });
    setLanguageOpen(false);
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", type: "link" as const },
        { icon: Lock, label: "Change Password", type: "link" as const },
        { icon: Globe, label: "Language", value: selectedLanguage, type: "link" as const },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Push Notifications", type: "toggle" as const, key: "notifications" },
        { icon: Bell, label: "Email Notifications", type: "toggle" as const, key: "emailNotifications" },
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

  return (
    <div className="app-container content-area">
      <Header title="Settings" showBack />
      
      <div className="px-4 max-w-md mx-auto pb-24">
        {/* User Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-card rounded-2xl p-4 shadow-soft flex items-center gap-4">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">Signed in</p>
              </div>
            </div>
          </motion.div>
        )}

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
                <button
                  key={item.label}
                  onClick={() => item.type === "link" ? handleItemClick(item.label, (item as any).path) : null}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/50 transition-colors ${
                    index !== section.items.length - 1 ? "border-b border-border" : ""
                  } ${item.type === "toggle" ? "cursor-default" : "cursor-pointer"}`}
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
                </button>
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
        {user && (
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
        )}

        {/* Sign In Button for non-authenticated users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button 
              onClick={() => navigate("/auth")}
              className="w-full flex items-center justify-center gap-2 py-3 text-primary font-medium hover:bg-primary/10 rounded-xl transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Enter your name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-1.5"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="mt-1.5"
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full">
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Language Dialog */}
      <Dialog open={languageOpen} onOpenChange={setLanguageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
