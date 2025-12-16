import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, Download, Mail, Phone, Globe, Edit, QrCode } from "lucide-react";
import { mockBusinessCards } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

export default function BusinessCardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const card = mockBusinessCards.find(c => c.id === id) || mockBusinessCards[0];

  const handleShare = () => {
    navigator.clipboard.writeText(`https://ubuntuhub.app/card/${card.id}`);
    toast({
      title: "Link Copied!",
      description: "Card link has been copied to clipboard",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading...",
      description: "Your card is being downloaded as an image",
    });
  };

  return (
    <div className="app-container content-area">
      <Header title="Business Card" showBack />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Card Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div 
            className="rounded-2xl overflow-hidden shadow-glow aspect-[1.75/1] p-6 relative"
            style={{
              background: `linear-gradient(135deg, ${card.primaryColor} 0%, ${card.secondaryColor} 100%)`
            }}
          >
            <div className="text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-3xl">{card.fullName}</h3>
                <p className="text-white/80 text-lg mt-1">{card.profession}</p>
                <p className="text-white/70 mt-0.5">{card.company}</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1 text-sm text-white/80">
                  {card.email && <p>{card.email}</p>}
                  {card.phone && <p>{card.phone}</p>}
                  {card.website && <p>{card.website}</p>}
                </div>
                <div className="bg-white p-2 rounded-lg">
                  <QRCode 
                    value={`https://ubuntuhub.app/card/${card.id}`}
                    size={70}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Created on {new Date(card.createdAt).toLocaleDateString()}
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
              href={`https://${card.website}`}
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
    </div>
  );
}
