import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, Clock, Users, Calendar, Share2, Heart, 
  Building2, ChevronRight, CheckCircle2 
} from "lucide-react";
import { mockEvents, mockOrganizations } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function EventDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const event = mockEvents.find(e => e.id === id) || mockEvents[0];
  const organizer = mockOrganizations.find(o => o.id === event.organizerId);

  const handleRSVP = () => {
    toast({
      title: "You're In! 🎉",
      description: "You've successfully registered for this event",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Event link has been copied to clipboard",
    });
  };

  return (
    <div className="app-container content-area">
      <Header title="" showBack transparent />
      
      {/* Hero Image */}
      <div className="relative -mt-16">
        <div className="h-64 relative">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-4"
        >
          <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 right-4 flex gap-2"
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      <div className="px-4 -mt-8 max-w-md mx-auto relative z-10">
        {/* Title & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-soft mb-4"
        >
          <h1 className="text-xl font-bold text-foreground mb-4">{event.title}</h1>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-xl bg-card-blue flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-xl bg-card-green flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-foreground font-medium">{event.location}</p>
                <p className="text-sm">View on Map</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-xl bg-card-purple flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">{event.attendeeCount} Attending</p>
                <p className="text-sm">Limited spots available</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Organizer */}
        {organizer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to={`/organizations/${organizer.id}`}
              className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-soft mb-4"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary-soft flex items-center justify-center">
                <img src={organizer.logo} alt={organizer.name} className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Organized by</p>
                <p className="font-semibold text-foreground">{organizer.name}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-soft mb-4"
        >
          <h3 className="font-semibold text-foreground mb-3">About This Event</h3>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Join us for an amazing experience! This event brings together community members 
            for networking, learning, and fun. Don't miss out on this opportunity to connect 
            with like-minded individuals.
          </p>
        </motion.div>

        {/* Attendees Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 shadow-soft mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">Attendees</h3>
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Avatar key={i} className="w-10 h-10 border-2 border-card">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm text-muted-foreground ml-3">
              +{event.attendeeCount - 5} others attending
            </p>
          </div>
        </motion.div>

        {/* RSVP Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-4"
        >
          <Button
            onClick={handleRSVP}
            className="w-full h-14 gradient-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-glow"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            RSVP Now - Free
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
