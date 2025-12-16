import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, Download, Mail, Phone, Globe, Edit, QrCode, Linkedin, Twitter, Instagram, Building2, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { supabase } from "@/integrations/supabase/client";

interface BusinessCard {
  id: string;
  full_name: string;
  profession: string;
  company: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  bio: string | null;
  template: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  created_at: string;
}

export default function BusinessCardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCard();
    }
  }, [id]);

  const fetchCard = async () => {
    try {
      const { data, error } = await supabase
        .from('business_cards')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setCard(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/business-cards/${card?.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card?.full_name}'s Business Card`,
          text: `Check out ${card?.full_name}'s digital business card`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Card link has been copied to clipboard",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Coming Soon",
      description: "Download feature will be available soon",
    });
  };

  const getCardBackground = () => {
    if (!card) return "";
    switch (card.template) {
      case "aurora":
        return `linear-gradient(135deg, ${card.primary_color} 0%, ${card.secondary_color} 50%, ${card.accent_color} 100%)`;
      case "midnight":
        return `linear-gradient(to right, ${card.primary_color}, ${card.secondary_color}, ${card.accent_color})`;
      case "sunset":
        return `linear-gradient(to top right, ${card.primary_color}, ${card.secondary_color})`;
      default:
        return `linear-gradient(135deg, ${card.primary_color} 0%, ${card.secondary_color} 100%)`;
    }
  };

  if (isLoading) {
    return (
      <div className="app-container content-area flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="app-container content-area">
        <Header title="Business Card" showBack />
        <div className="px-4 max-w-md mx-auto text-center py-12">
          <h3 className="font-semibold text-foreground mb-2">Card Not Found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            This business card doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/business-cards")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const CardFront = () => (
    <div 
      className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden backface-hidden"
      style={{ background: getCardBackground() }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="40" fill={card.accent_color} />
        </svg>
      </div>
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: card.accent_color }}
      />
      
      <div className="relative z-10">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${card.accent_color}20`, border: `2px solid ${card.accent_color}` }}
        >
          <span className="text-2xl font-bold" style={{ color: card.accent_color }}>
            {card.full_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="font-bold text-3xl text-white tracking-tight">
          {card.full_name}
        </h3>
        <p className="text-white/80 text-lg mt-1 font-medium">
          {card.profession}
        </p>
        <p className="text-white/60 text-sm mt-0.5 flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          {card.company}
        </p>
      </div>
      
      <div className="relative z-10 flex justify-between items-end">
        <div className="space-y-1">
          {card.email && (
            <p className="text-white/80 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: card.accent_color }} />
              {card.email}
            </p>
          )}
          {card.phone && (
            <p className="text-white/80 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4" style={{ color: card.accent_color }} />
              {card.phone}
            </p>
          )}
          {card.website && (
            <p className="text-white/80 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" style={{ color: card.accent_color }} />
              {card.website}
            </p>
          )}
        </div>
        <div 
          className="p-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
        >
          <QRCode 
            value={`${window.location.origin}/business-cards/${card.id}`}
            size={70}
          />
        </div>
      </div>
    </div>
  );

  const CardBack = () => (
    <div 
      className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden backface-hidden rotate-y-180"
      style={{ background: getCardBackground() }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${card.accent_color} 0, ${card.accent_color} 1px, transparent 0, transparent 50%)`,
          backgroundSize: '10px 10px'
        }} />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
        {card.bio ? (
          <p className="text-white/90 text-base italic leading-relaxed max-w-[90%]">
            "{card.bio}"
          </p>
        ) : (
          <p className="text-white/50 text-sm italic">No bio added</p>
        )}
      </div>
      
      <div className="relative z-10 flex justify-center gap-4">
        {card.linkedin && (
          <a 
            href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ backgroundColor: `${card.accent_color}30`, border: `1px solid ${card.accent_color}` }}
          >
            <Linkedin className="w-6 h-6" style={{ color: card.accent_color }} />
          </a>
        )}
        {card.twitter && (
          <a 
            href={card.twitter.startsWith('http') ? card.twitter : `https://twitter.com/${card.twitter.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ backgroundColor: `${card.accent_color}30`, border: `1px solid ${card.accent_color}` }}
          >
            <Twitter className="w-6 h-6" style={{ color: card.accent_color }} />
          </a>
        )}
        {card.instagram && (
          <a 
            href={card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ backgroundColor: `${card.accent_color}30`, border: `1px solid ${card.accent_color}` }}
          >
            <Instagram className="w-6 h-6" style={{ color: card.accent_color }} />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-container content-area">
      <Header title="Business Card" showBack />
      
      <div className="px-4 max-w-md mx-auto pb-24">
        {/* Card Display with Flip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="perspective-1000">
            <motion.div
              className="relative w-full aspect-[1.75/1] cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <CardFront />
              <CardBack />
            </motion.div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Tap card to flip • Created {new Date(card.created_at).toLocaleDateString()}
          </p>
        </motion.div>

        {/* QR Code Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <QrCode className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm">QR Code Included</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Anyone can scan the QR code to view your digital card and save your contact info.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Button 
            onClick={handleShare}
            className="h-12 gradient-primary text-primary-foreground rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Card
          </Button>
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="h-12 rounded-xl border-border"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </motion.div>

        {/* Contact Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl overflow-hidden shadow-soft mb-6"
        >
          <h4 className="font-semibold text-foreground px-4 pt-4 pb-2">Quick Contact</h4>
          {card.email && (
            <a 
              href={`mailto:${card.email}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary-soft flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Send Email</p>
                <p className="text-xs text-muted-foreground">{card.email}</p>
              </div>
            </a>
          )}
          {card.phone && (
            <a 
              href={`tel:${card.phone}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary-soft flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Call Now</p>
                <p className="text-xs text-muted-foreground">{card.phone}</p>
              </div>
            </a>
          )}
          {card.website && (
            <a 
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary-soft flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Visit Website</p>
                <p className="text-xs text-muted-foreground">{card.website}</p>
              </div>
            </a>
          )}
          {!card.email && !card.phone && !card.website && (
            <p className="px-4 py-3 text-sm text-muted-foreground">No contact info added</p>
          )}
        </motion.div>

        {/* Edit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline"
            onClick={() => navigate(`/business-cards/edit/${card.id}`)}
            className="w-full h-12 rounded-xl border-border"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Card
          </Button>
        </motion.div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
