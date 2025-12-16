import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Heart, Users, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFundraising } from "@/hooks/useFundraising";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["All", "Medical", "Education", "Community", "Emergency", "Environment"];

export default function Fundraise() {
  const { campaigns, loading } = useFundraising();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesCategory = selectedCategory === "All" || 
        campaign.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [campaigns, selectedCategory, searchQuery]);

  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised_amount, 0);
  const totalCampaigns = campaigns.length;

  return (
    <div className="app-container content-area">
      <Header title="Fundraise" showNotification />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-primary rounded-2xl p-5 mb-6 text-primary-foreground"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Total Raised</p>
              <h2 className="text-2xl font-bold">₹{totalRaised.toLocaleString()}</h2>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 opacity-80" />
              <span className="text-sm">{totalCampaigns} Campaigns</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 opacity-80" />
              <span className="text-sm">Supporting causes</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Create */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-10 bg-card border-border rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="gradient-primary rounded-xl shadow-glow">
            <Link to="/fundraise/create">
              <Plus className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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

        {/* Campaigns List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-soft">
                <Skeleton className="w-full h-40 rounded-xl mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-2 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">Be the first to start a fundraising campaign!</p>
              <Button asChild className="gradient-primary">
                <Link to="/fundraise/create">Create Campaign</Link>
              </Button>
            </div>
          ) : (
            filteredCampaigns.map((campaign, index) => {
              const progress = (campaign.raised_amount / campaign.goal_amount) * 100;
              const daysLeft = campaign.end_date 
                ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                : null;

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link 
                    to={`/fundraise/${campaign.id}`}
                    className="block bg-card rounded-2xl overflow-hidden shadow-soft card-hover"
                  >
                    {campaign.image_url && (
                      <div className="relative h-40">
                        <img 
                          src={campaign.image_url} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-background/90 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full">
                            {campaign.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
                        {campaign.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {campaign.description}
                      </p>
                      
                      <Progress value={Math.min(progress, 100)} className="h-2 mb-3" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-primary">
                            ₹{campaign.raised_amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of ₹{campaign.goal_amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {Math.round(progress)}%
                          </p>
                          {daysLeft !== null && (
                            <p className="text-xs text-muted-foreground">
                              {daysLeft} days left
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
