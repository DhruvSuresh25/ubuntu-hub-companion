import { motion } from "framer-motion";
import { Users, MapPin, Search, Filter, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { mockOrganizations } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["All", "Technology", "Environment", "Education", "Arts", "Sports"];

export default function Organizations() {
  return (
    <div className="app-container content-area">
      <Header title="Organizations" showNotification />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search organizations..." 
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
          transition={{ delay: 0.1 }}
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

        {/* Organizations List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {mockOrganizations.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                to={`/organizations/${org.id}`}
                className="block bg-card rounded-2xl p-4 shadow-soft card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl gradient-primary-soft flex items-center justify-center flex-shrink-0">
                    <img src={org.logo} alt={org.name} className="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">{org.name}</h3>
                      {org.isJoined ? (
                        <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3" />
                          Joined
                        </span>
                      ) : (
                        <Button size="sm" className="h-7 px-3 text-xs gradient-primary text-primary-foreground">
                          <Plus className="w-3 h-3 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{org.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{org.memberCount} members</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{org.location}</span>
                      </div>
                    </div>
                    <span className="inline-block mt-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {org.category}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
