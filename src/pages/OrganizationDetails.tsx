import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, Users, Calendar, Share2, Globe, Mail, Phone,
  Check, Plus, ChevronRight
} from "lucide-react";
import { mockOrganizations, mockEvents } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function OrganizationDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const org = mockOrganizations.find(o => o.id === id) || mockOrganizations[0];
  const orgEvents = mockEvents.filter(e => e.organizerId === org.id);

  const handleJoin = () => {
    toast({
      title: org.isJoined ? "Left Organization" : "Joined! 🎉",
      description: org.isJoined 
        ? `You have left ${org.name}` 
        : `Welcome to ${org.name}`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Organization link has been copied to clipboard",
    });
  };

  return (
    <div className="app-container content-area">
      <Header title="" showBack transparent />
      
      {/* Header Section */}
      <div className="gradient-primary px-4 pt-2 pb-20 -mt-14">
        <div className="max-w-md mx-auto pt-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <img src={org.logo} alt={org.name} className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">{org.name}</h1>
                <span className="inline-block mt-1 text-xs bg-primary-foreground/20 text-primary-foreground px-2 py-1 rounded-full">
                  {org.category}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="px-4 -mt-12 max-w-md mx-auto">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-soft mb-4"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{org.memberCount}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{orgEvents.length}</p>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4.8</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <Button
              onClick={handleJoin}
              className={`flex-1 h-11 rounded-xl font-medium ${
                org.isJoined 
                  ? "bg-secondary text-secondary-foreground" 
                  : "gradient-primary text-primary-foreground"
              }`}
            >
              {org.isJoined ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Joined
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Join
                </>
              )}
            </Button>
            <Button variant="outline" className="h-11 rounded-xl px-4">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 shadow-soft mb-4"
        >
          <h3 className="font-semibold text-foreground mb-3">About</h3>
          <p className="text-muted-foreground leading-relaxed">{org.description}</p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            We are committed to building a strong community through events, workshops, and 
            networking opportunities. Join us to connect with like-minded individuals.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl overflow-hidden shadow-soft mb-4"
        >
          <h3 className="font-semibold text-foreground px-5 pt-5 pb-3">Contact</h3>
          <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-card-green flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{org.location}</p>
              <p className="text-xs text-muted-foreground">Location</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-card-blue flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">www.{org.name.toLowerCase().replace(/\s/g, '')}.org</p>
              <p className="text-xs text-muted-foreground">Website</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-card-purple flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">contact@{org.name.toLowerCase().replace(/\s/g, '')}.org</p>
              <p className="text-xs text-muted-foreground">Email</p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        {orgEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Upcoming Events</h3>
              <Link to="/events" className="text-primary text-sm font-medium">See all</Link>
            </div>
            <div className="space-y-3">
              {orgEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-soft card-hover"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm line-clamp-1">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time.split(' - ')[0]}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{event.attendeeCount} attending</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
