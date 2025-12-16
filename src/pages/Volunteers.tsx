import { motion } from "framer-motion";
import { MapPin, Clock, Users, Search, Filter, Heart, Building2 } from "lucide-react";
import { mockVolunteers } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Food", "Education", "Environment", "Health", "Community"];

export default function Volunteers() {
  const { toast } = useToast();

  const handleSignUp = (title: string) => {
    toast({
      title: "Signed Up! 🙌",
      description: `You've registered to volunteer for "${title}"`,
    });
  };

  return (
    <div className="app-container content-area">
      <Header title="Volunteer" showBack />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-primary rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Heart className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-primary-foreground font-bold text-lg">Make a Difference</h2>
              <p className="text-primary-foreground/80 text-sm">Find opportunities to give back</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search opportunities..." 
              className="pl-10 bg-card border-border rounded-xl"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-border">
            <Filter className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
        >
          {categories.map((cat, index) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                index === 0 
                  ? "gradient-primary text-primary-foreground" 
                  : "bg-card text-foreground border border-border hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Opportunities List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {mockVolunteers.map((volunteer, index) => (
            <motion.div
              key={volunteer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-card rounded-2xl p-4 shadow-soft"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="inline-block text-xs bg-card-green text-emerald-600 px-2 py-1 rounded-full mb-2">
                    {volunteer.category}
                  </span>
                  <h3 className="font-semibold text-foreground">{volunteer.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-primary font-semibold text-sm">{volunteer.spotsAvailable}</span>
                  <p className="text-xs text-muted-foreground">spots left</p>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">{volunteer.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>{volunteer.organization}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(volunteer.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{volunteer.location}</span>
                </div>
              </div>

              <Button
                onClick={() => handleSignUp(volunteer.title)}
                className="w-full h-11 gradient-primary text-primary-foreground rounded-xl font-medium"
              >
                Sign Up to Volunteer
              </Button>
            </motion.div>
          ))}

          {/* More Opportunities Coming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary-soft flex items-center justify-center mb-3">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              More opportunities coming soon!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
