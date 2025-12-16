import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Palette, Sparkles, RotateCcw, Mail, Phone, Globe, Linkedin, Twitter, Instagram, User, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Template = "elegant" | "aurora" | "midnight" | "sunset" | "nature" | "royal";

interface CardData {
  fullName: string;
  profession: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  bio: string;
  template: Template;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const templates: { 
  id: Template; 
  name: string; 
  primary: string; 
  secondary: string;
  accent: string;
  pattern: string;
}[] = [
  { id: "elegant", name: "Elegant", primary: "#1a1a2e", secondary: "#16213e", accent: "#e94560", pattern: "elegant" },
  { id: "aurora", name: "Aurora", primary: "#667eea", secondary: "#764ba2", accent: "#f093fb", pattern: "aurora" },
  { id: "midnight", name: "Midnight", primary: "#0f0c29", secondary: "#302b63", accent: "#24243e", pattern: "midnight" },
  { id: "sunset", name: "Sunset", primary: "#ff6b6b", secondary: "#feca57", accent: "#ff9ff3", pattern: "sunset" },
  { id: "nature", name: "Nature", primary: "#11998e", secondary: "#38ef7d", accent: "#a8edea", pattern: "nature" },
  { id: "royal", name: "Royal", primary: "#141E30", secondary: "#243B55", accent: "#c9a227", pattern: "royal" },
];

const colorPresets = [
  { name: "Crimson Night", primary: "#1a1a2e", secondary: "#16213e", accent: "#e94560" },
  { name: "Ocean Dream", primary: "#2193b0", secondary: "#6dd5ed", accent: "#fff" },
  { name: "Purple Haze", primary: "#667eea", secondary: "#764ba2", accent: "#f093fb" },
  { name: "Forest Mist", primary: "#134e5e", secondary: "#71b280", accent: "#a8edea" },
  { name: "Golden Hour", primary: "#f12711", secondary: "#f5af19", accent: "#fff" },
  { name: "Rose Garden", primary: "#ee9ca7", secondary: "#ffdde1", accent: "#c94b4b" },
  { name: "Midnight Blue", primary: "#0f0c29", secondary: "#302b63", accent: "#24243e" },
  { name: "Emerald City", primary: "#11998e", secondary: "#38ef7d", accent: "#fff" },
];

export default function BusinessCardCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  
  const [cardData, setCardData] = useState<CardData>({
    fullName: "",
    profession: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    bio: "",
    template: "elegant",
    primaryColor: "#1a1a2e",
    secondaryColor: "#16213e",
    accentColor: "#e94560",
  });

  // Fetch existing card if editing
  useEffect(() => {
    if (id && user) {
      fetchCard();
    }
  }, [id, user]);

  const fetchCard = async () => {
    try {
      const { data, error } = await supabase
        .from('business_cards')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setCardData({
          fullName: data.full_name,
          profession: data.profession,
          company: data.company,
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
          bio: data.bio || "",
          template: data.template as Template,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          accentColor: data.accent_color,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business card",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setCardData({
      ...cardData,
      template: template.id,
      primaryColor: template.primary,
      secondaryColor: template.secondary,
      accentColor: template.accent,
    });
  };

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setCardData({
      ...cardData,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    });
  };

  const handleGenerate = async () => {
    if (!cardData.fullName || !cardData.profession || !cardData.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, profession, and company",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to create a business card",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      const cardPayload = {
        user_id: user.id,
        full_name: cardData.fullName,
        profession: cardData.profession,
        company: cardData.company,
        email: cardData.email || null,
        phone: cardData.phone || null,
        website: cardData.website || null,
        linkedin: cardData.linkedin || null,
        twitter: cardData.twitter || null,
        instagram: cardData.instagram || null,
        bio: cardData.bio || null,
        template: cardData.template,
        primary_color: cardData.primaryColor,
        secondary_color: cardData.secondaryColor,
        accent_color: cardData.accentColor,
      };

      if (id) {
        // Update existing card
        const { error } = await supabase
          .from('business_cards')
          .update(cardPayload)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Card Updated!",
          description: "Your business card has been updated successfully",
        });
      } else {
        // Create new card
        const { error } = await supabase
          .from('business_cards')
          .insert(cardPayload);

        if (error) throw error;

        toast({
          title: "Card Created!",
          description: "Your business card has been saved successfully",
        });
      }

      navigate("/business-cards");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save business card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCardBackground = () => {
    const template = templates.find(t => t.id === cardData.template);
    switch (template?.pattern) {
      case "aurora":
        return `linear-gradient(135deg, ${cardData.primaryColor} 0%, ${cardData.secondaryColor} 50%, ${cardData.accentColor} 100%)`;
      case "midnight":
        return `linear-gradient(to right, ${cardData.primaryColor}, ${cardData.secondaryColor}, ${cardData.accentColor})`;
      case "sunset":
        return `linear-gradient(to top right, ${cardData.primaryColor}, ${cardData.secondaryColor})`;
      default:
        return `linear-gradient(135deg, ${cardData.primaryColor} 0%, ${cardData.secondaryColor} 100%)`;
    }
  };

  const CardFront = () => (
    <div 
      className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden backface-hidden"
      style={{ background: getCardBackground() }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="40" fill={cardData.accentColor} />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="80" r="30" fill={cardData.accentColor} />
        </svg>
      </div>
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: cardData.accentColor }}
      />
      
      <div className="relative z-10">
        <motion.div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${cardData.accentColor}20`, border: `2px solid ${cardData.accentColor}` }}
        >
          <span className="text-2xl font-bold" style={{ color: cardData.accentColor }}>
            {cardData.fullName ? cardData.fullName.charAt(0).toUpperCase() : "?"}
          </span>
        </motion.div>
        <h3 className="font-bold text-2xl text-white tracking-tight">
          {cardData.fullName || "Your Name"}
        </h3>
        <p className="text-white/80 text-sm mt-1 font-medium">
          {cardData.profession || "Your Title"}
        </p>
        <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          {cardData.company || "Company"}
        </p>
      </div>
      
      <div className="relative z-10 flex justify-between items-end">
        <div className="space-y-1">
          {cardData.email && (
            <p className="text-white/80 text-xs flex items-center gap-1.5">
              <Mail className="w-3 h-3" style={{ color: cardData.accentColor }} />
              {cardData.email}
            </p>
          )}
          {cardData.phone && (
            <p className="text-white/80 text-xs flex items-center gap-1.5">
              <Phone className="w-3 h-3" style={{ color: cardData.accentColor }} />
              {cardData.phone}
            </p>
          )}
          {cardData.website && (
            <p className="text-white/80 text-xs flex items-center gap-1.5">
              <Globe className="w-3 h-3" style={{ color: cardData.accentColor }} />
              {cardData.website}
            </p>
          )}
        </div>
        <div 
          className="p-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
        >
          <QRCode 
            value={`https://ubuntuhub.app/card/preview`}
            size={48}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
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
          backgroundImage: `repeating-linear-gradient(45deg, ${cardData.accentColor} 0, ${cardData.accentColor} 1px, transparent 0, transparent 50%)`,
          backgroundSize: '10px 10px'
        }} />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
        {cardData.bio ? (
          <p className="text-white/90 text-sm italic leading-relaxed max-w-[90%]">
            "{cardData.bio}"
          </p>
        ) : (
          <p className="text-white/50 text-sm italic">Add a bio to personalize your card</p>
        )}
      </div>
      
      <div className="relative z-10 flex justify-center gap-4">
        {cardData.linkedin && (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${cardData.accentColor}30`, border: `1px solid ${cardData.accentColor}` }}
          >
            <Linkedin className="w-5 h-5" style={{ color: cardData.accentColor }} />
          </div>
        )}
        {cardData.twitter && (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${cardData.accentColor}30`, border: `1px solid ${cardData.accentColor}` }}
          >
            <Twitter className="w-5 h-5" style={{ color: cardData.accentColor }} />
          </div>
        )}
        {cardData.instagram && (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${cardData.accentColor}30`, border: `1px solid ${cardData.accentColor}` }}
          >
            <Instagram className="w-5 h-5" style={{ color: cardData.accentColor }} />
          </div>
        )}
        {!cardData.linkedin && !cardData.twitter && !cardData.instagram && (
          <p className="text-white/40 text-xs">Add social links to display here</p>
        )}
      </div>
    </div>
  );

  if (isFetching) {
    return (
      <div className="app-container content-area flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="app-container content-area bg-gradient-to-b from-background to-muted/30">
      <Header title={id ? "Edit Card" : "Create Card"} showBack />
      
      <div className="px-4 max-w-md mx-auto pb-32">
        {/* 3D Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Live Preview
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Flip Card
            </Button>
          </div>
          
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
          <p className="text-center text-xs text-muted-foreground mt-2">
            Tap the card to flip
          </p>
        </motion.div>

        {/* Templates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Label className="text-sm font-semibold mb-3 block">Choose Style</Label>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateSelect(template)}
                className={`relative rounded-xl overflow-hidden h-20 transition-all ${
                  cardData.template === template.id 
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                    : "ring-1 ring-border"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${template.primary} 0%, ${template.secondary} 100%)`
                }}
              >
                <div 
                  className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: template.accent }}
                />
                
                {cardData.template === template.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                  </motion.div>
                )}
                <span className="absolute bottom-2 left-2 text-[11px] text-white font-semibold drop-shadow-md">
                  {template.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Color Presets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Palette
          </Label>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {colorPresets.map((preset) => (
              <motion.button
                key={preset.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleColorPreset(preset)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl transition-all shadow-md ${
                  cardData.primaryColor === preset.primary 
                    ? "ring-2 ring-offset-2 ring-offset-background ring-primary" 
                    : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`
                }}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full mx-auto mt-1"
                  style={{ backgroundColor: preset.accent }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Form Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details" className="gap-1.5 text-xs">
                <User className="w-3.5 h-3.5" />
                Details
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1.5 text-xs">
                <Mail className="w-3.5 h-3.5" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-1.5 text-xs">
                <Globe className="w-3.5 h-3.5" />
                Social
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="bg-card rounded-2xl p-4 shadow-soft space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={cardData.fullName}
                    onChange={(e) => setCardData({ ...cardData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="profession" className="text-xs font-medium text-muted-foreground">Profession / Title *</Label>
                  <Input
                    id="profession"
                    value={cardData.profession}
                    onChange={(e) => setCardData({ ...cardData, profession: e.target.value })}
                    placeholder="Software Developer"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-xs font-medium text-muted-foreground">Company *</Label>
                  <Input
                    id="company"
                    value={cardData.company}
                    onChange={(e) => setCardData({ ...cardData, company: e.target.value })}
                    placeholder="Tech Solutions Inc."
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="bio" className="text-xs font-medium text-muted-foreground">Short Bio</Label>
                    <span className="text-[10px] text-muted-foreground">{cardData.bio.length}/200</span>
                  </div>
                  <Textarea
                    id="bio"
                    value={cardData.bio}
                    onChange={(e) => setCardData({ ...cardData, bio: e.target.value.slice(0, 200) })}
                    placeholder="A brief description about yourself..."
                    className="mt-1.5 resize-none bg-background/50"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="bg-card rounded-2xl p-4 shadow-soft space-y-4">
                <div>
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cardData.email}
                    onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    value={cardData.phone}
                    onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="text-xs font-medium text-muted-foreground">Website</Label>
                  <Input
                    id="website"
                    value={cardData.website}
                    onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                    placeholder="www.example.com"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="bg-card rounded-2xl p-4 shadow-soft space-y-4">
                <div>
                  <Label htmlFor="linkedin" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={cardData.linkedin}
                    onChange={(e) => setCardData({ ...cardData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/johndoe"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    value={cardData.twitter}
                    onChange={(e) => setCardData({ ...cardData, twitter: e.target.value })}
                    placeholder="@johndoe"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={cardData.instagram}
                    onChange={(e) => setCardData({ ...cardData, instagram: e.target.value })}
                    placeholder="@johndoe"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto"
        >
          <Button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-14 gradient-primary text-primary-foreground rounded-2xl shadow-glow text-base font-semibold gap-2"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {id ? "Update Business Card" : "Generate Business Card"}
              </>
            )}
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
