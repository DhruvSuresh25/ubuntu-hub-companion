import { motion } from "framer-motion";
import { Star, MapPin, Phone, Search, Filter, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { mockBusinesses } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["All", "Marketing", "Services", "Education", "Tech", "Food"];

export default function Businesses() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = useMemo(() => {
    return mockBusinesses.filter((business) => {
      const matchesCategory = selectedCategory === "All" || business.category === selectedCategory;
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);
  return (
    <div className="app-container content-area">
      <Header title="Businesses" showNotification />
      
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
              placeholder="Search businesses..." 
              className="pl-10 bg-card border-border rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? "gradient-primary text-primary-foreground" 
                  : "bg-card text-foreground border border-border hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Businesses List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                to={`/businesses/${business.id}`}
                className="block bg-card rounded-2xl p-4 shadow-soft card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">{business.name}</h3>
                      {business.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{business.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-medium text-foreground">{business.rating}</span>
                        <span>({business.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{business.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="inline-block text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        {business.category}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 text-xs text-primary hover:text-primary"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Contact
                      </Button>
                    </div>
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
