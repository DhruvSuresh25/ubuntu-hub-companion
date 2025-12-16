import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, Calendar, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFundraising, Campaign, Donation } from "@/hooks/useFundraising";
import { DonateDialog } from "@/components/fundraise/DonateDialog";
import { formatDistanceToNow } from "date-fns";

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCampaign, getCampaignDonations, makeDonation } = useFundraising();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      
      const [campaignData, donationsData] = await Promise.all([
        getCampaign(id),
        getCampaignDonations(id),
      ]);
      
      setCampaign(campaignData);
      setDonations(donationsData);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleDonate = async (amount: number, name: string, email: string, message: string, isAnonymous: boolean) => {
    if (!id) return;
    const success = await makeDonation(id, amount, name, email, message, isAnonymous);
    if (success) {
      setDonateOpen(false);
      // Refresh data
      const [campaignData, donationsData] = await Promise.all([
        getCampaign(id),
        getCampaignDonations(id),
      ]);
      setCampaign(campaignData);
      setDonations(donationsData);
    }
  };

  const handleShare = async () => {
    if (navigator.share && campaign) {
      await navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="app-container content-area">
        <div className="px-4 pt-4">
          <Skeleton className="w-full h-56 rounded-2xl mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="app-container content-area flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Campaign not found</h3>
          <Button onClick={() => navigate("/fundraise")}>Back to Campaigns</Button>
        </div>
      </div>
    );
  }

  const progress = (campaign.raised_amount / campaign.goal_amount) * 100;
  const daysLeft = campaign.end_date 
    ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="app-container content-area">
      {/* Header Image */}
      <div className="relative">
        {campaign.image_url ? (
          <img 
            src={campaign.image_url} 
            alt={campaign.title}
            className="w-full h-56 object-cover"
          />
        ) : (
          <div className="w-full h-56 gradient-primary flex items-center justify-center">
            <Heart className="w-16 h-16 text-primary-foreground/50" />
          </div>
        )}
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-background/80 backdrop-blur-sm rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-background/80 backdrop-blur-sm rounded-full"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-background/90 backdrop-blur-sm text-sm font-medium px-4 py-1.5 rounded-full">
            {campaign.category}
          </span>
        </div>
      </div>

      <div className="px-4 -mt-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-soft mb-4"
        >
          <h1 className="text-xl font-bold text-foreground mb-2">{campaign.title}</h1>
          <p className="text-muted-foreground text-sm mb-4">{campaign.description}</p>

          {/* Progress */}
          <Progress value={Math.min(progress, 100)} className="h-3 mb-4" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-primary">₹{campaign.raised_amount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Raised</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{Math.round(progress)}%</p>
              <p className="text-xs text-muted-foreground">of ₹{campaign.goal_amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{donations.length}</p>
              <p className="text-xs text-muted-foreground">Donors</p>
            </div>
          </div>

          {daysLeft !== null && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{daysLeft > 0 ? `${daysLeft} days remaining` : "Campaign ended"}</span>
            </div>
          )}
        </motion.div>

        {/* Story Section */}
        {campaign.story && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-5 shadow-soft mb-4"
          >
            <h2 className="font-semibold text-lg mb-3">Story</h2>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">{campaign.story}</p>
          </motion.div>
        )}

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-soft mb-24"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Recent Donations</h2>
          </div>
          
          {donations.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Be the first to support this campaign!
            </p>
          ) : (
            <div className="space-y-4">
              {donations.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="gradient-primary-soft text-primary">
                      {donation.is_anonymous ? "A" : donation.donor_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">
                        {donation.is_anonymous ? "Anonymous" : donation.donor_name}
                      </p>
                      <p className="font-semibold text-primary">₹{donation.amount.toLocaleString()}</p>
                    </div>
                    {donation.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{donation.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Fixed Donate Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-md mx-auto">
          <Button 
            className="w-full gradient-primary shadow-glow text-lg py-6 rounded-xl"
            onClick={() => setDonateOpen(true)}
          >
            <Heart className="w-5 h-5 mr-2" />
            Donate Now
          </Button>
        </div>
      </div>

      <DonateDialog 
        open={donateOpen} 
        onOpenChange={setDonateOpen}
        onDonate={handleDonate}
        campaignTitle={campaign.title}
      />
    </div>
  );
}
