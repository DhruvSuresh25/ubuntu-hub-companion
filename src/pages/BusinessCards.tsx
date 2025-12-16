import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, Edit, Share2, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BusinessCard {
  id: string;
  full_name: string;
  profession: string;
  company: string;
  template: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  created_at: string;
}

export default function BusinessCards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCards();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('business_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business cards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('business_cards')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setCards(cards.filter(card => card.id !== deleteId));
      toast({
        title: "Card Deleted",
        description: "Your business card has been deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business card",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleShare = async (card: BusinessCard) => {
    const shareUrl = `${window.location.origin}/business-cards/${card.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.full_name}'s Business Card`,
          text: `Check out ${card.full_name}'s digital business card`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Business card link copied to clipboard",
      });
    }
  };

  return (
    <div className="app-container content-area">
      <Header title="Business Cards" showBack />
      
      <div className="px-4 max-w-md mx-auto pb-24">
        {/* Create New Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/business-cards/create">
            <Button className="w-full h-14 gradient-primary text-primary-foreground rounded-xl shadow-glow">
              <Plus className="w-5 h-5 mr-2" />
              Create New Card
            </Button>
          </Link>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 rounded-xl p-4 mb-6"
        >
          <p className="text-sm text-foreground">
            <span className="font-semibold">Pro Tip:</span> Create multiple cards for different purposes - 
            one for business, one for networking events, and more!
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary-soft flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Sign In Required</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Please sign in to create and manage your business cards
            </p>
            <Link to="/auth">
              <Button className="gradient-primary text-primary-foreground">
                Sign In
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Cards Count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-muted-foreground mb-4"
            >
              You have <span className="font-semibold text-foreground">{cards.length}</span> business card(s)
            </motion.p>

            {/* Cards List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft"
                >
                  {/* Card Preview */}
                  <div 
                    className="h-36 p-4 relative"
                    style={{
                      background: `linear-gradient(135deg, ${card.primary_color} 0%, ${card.secondary_color} 100%)`
                    }}
                  >
                    {/* Accent line */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ backgroundColor: card.accent_color }}
                    />
                    <div className="text-white ml-2">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${card.accent_color}30`, border: `1px solid ${card.accent_color}` }}
                      >
                        <span className="text-lg font-bold" style={{ color: card.accent_color }}>
                          {card.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl">{card.full_name}</h3>
                      <p className="text-white/80 text-sm mt-1">{card.profession}</p>
                      <p className="text-white/70 text-xs mt-0.5">{card.company}</p>
                    </div>
                    <span className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium capitalize">
                      {card.template}
                    </span>
                  </div>
                  
                  {/* Card Actions */}
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(card.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link to={`/business-cards/${card.id}`}>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/business-cards/edit/${card.id}`}>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 rounded-lg"
                        onClick={() => handleShare(card)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 rounded-lg text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(card.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {cards.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-full gradient-primary-soft flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Cards Yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first digital business card to share with others
                </p>
                <Link to="/business-cards/create">
                  <Button className="gradient-primary text-primary-foreground">
                    Create Your First Card
                  </Button>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business Card?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your business card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
