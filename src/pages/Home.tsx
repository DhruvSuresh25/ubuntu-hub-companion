import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building2, Calendar, Briefcase, Users, Megaphone, CreditCard,
  Heart, ChevronRight
} from "lucide-react";
import { mockEvents, mockOrganizations, mockAnnouncements } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const quickActions = [
  { icon: Building2, label: "Organizations", path: "/organizations", color: "bg-card-purple" },
  { icon: Calendar, label: "Events", path: "/events", color: "bg-card-blue" },
  { icon: Briefcase, label: "Businesses", path: "/businesses", color: "bg-card-green" },
  { icon: CreditCard, label: "My Cards", path: "/business-cards", color: "bg-card-orange" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Guest';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-container content-area">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-primary px-4 pt-6 pb-8 rounded-b-3xl"
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-primary-foreground/30">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
                <h2 className="text-primary-foreground font-semibold text-lg">{displayName}</h2>
              </div>
            </div>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-primary-foreground/70" />
            <span className="text-primary-foreground/70 text-sm">Discover events, organizations...</span>
          </div>
        </div>
      </motion.div>

      <div className="px-4 -mt-4 max-w-md mx-auto">
        {/* Quick Actions */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-card rounded-2xl p-4 shadow-soft mb-6"
        >
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <motion.div key={action.path} variants={item}>
                <Link
                  to={action.path}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                    <action.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Upcoming Events</h3>
            <Link to="/events" className="text-primary text-sm font-medium">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {mockEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="flex-shrink-0 w-64 bg-card rounded-xl overflow-hidden shadow-soft card-hover"
              >
                <div className="h-32 bg-muted relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-xs font-medium text-primary">{event.category}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-foreground text-sm line-clamp-1">{event.title}</h4>
                  <p className="text-muted-foreground text-xs mt-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{event.attendeeCount} attending</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* My Organizations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">My Organizations</h3>
            <Link to="/organizations" className="text-primary text-sm font-medium">See all</Link>
          </div>
          <div className="space-y-3">
            {mockOrganizations.filter(org => org.isJoined).map((org) => (
              <Link
                key={org.id}
                to={`/organizations/${org.id}`}
                className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-soft card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary-soft flex items-center justify-center">
                  <img src={org.logo} alt={org.name} className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm line-clamp-1">{org.name}</h4>
                  <p className="text-muted-foreground text-xs">{org.memberCount} members</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Latest Announcements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Announcements</h3>
          </div>
          <div className="space-y-3">
            {mockAnnouncements.slice(0, 2).map((announcement) => (
              <div
                key={announcement.id}
                className="bg-card rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={announcement.authorAvatar} />
                    <AvatarFallback>{announcement.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground text-sm">{announcement.author}</h4>
                      <span className="text-xs text-muted-foreground">{new Date(announcement.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-foreground font-medium text-sm mt-1">{announcement.title}</p>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-muted-foreground text-xs hover:text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                        {announcement.likes}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
