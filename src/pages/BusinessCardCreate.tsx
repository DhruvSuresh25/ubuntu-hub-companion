import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

type Template = "modern" | "gradient" | "classic" | "minimal";

interface CardData {
  fullName: string;
  profession: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  bio: string;
  template: Template;
  primaryColor: string;
  secondaryColor: string;
}

const templates: { id: Template; name: string; primary: string; secondary: string }[] = [
  { id: "modern", name: "Modern", primary: "#8B5CF6", secondary: "#3B82F6" },
  { id: "gradient", name: "Gradient", primary: "#7C3AED", secondary: "#EC4899" },
  { id: "classic", name: "Classic", primary: "#1E40AF", secondary: "#3B82F6" },
  { id: "minimal", name: "Minimal", primary: "#374151", secondary: "#6B7280" },
];

const colorPresets = [
  { name: "Purple Blue", primary: "#8B5CF6", secondary: "#3B82F6" },
  { name: "Purple Pink", primary: "#9333EA", secondary: "#EC4899" },
  { name: "Ocean Blue", primary: "#0EA5E9", secondary: "#06B6D4" },
  { name: "Forest Green", primary: "#059669", secondary: "#10B981" },
  { name: "Sunset Orange", primary: "#F97316", secondary: "#FB923C" },
  { name: "Rose Pink", primary: "#E11D48", secondary: "#F43F5E" },
  { name: "Royal Purple", primary: "#7C3AED", secondary: "#A855F7" },
  { name: "Teal Cyan", primary: "#14B8A6", secondary: "#22D3D8" },
];

export default function BusinessCardCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cardData, setCardData] = useState<CardData>({
    fullName: "",
    profession: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    bio: "",
    template: "modern",
    primaryColor: "#8B5CF6",
    secondaryColor: "#3B82F6",
  });

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setCardData({
      ...cardData,
      template: template.id,
      primaryColor: template.primary,
      secondaryColor: template.secondary,
    });
  };

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setCardData({
      ...cardData,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
    });
  };

  const handleGenerate = () => {
    if (!cardData.fullName || !cardData.profession || !cardData.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, profession, and company",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Card Created!",
      description: "Your business card has been generated successfully",
    });
    navigate("/business-cards");
  };

  return (
    <div className="app-container content-area">
      <Header title="Create Card" showBack />
      
      <div className="px-4 max-w-md mx-auto pb-24">
        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Label className="text-sm font-medium mb-2 block">Live Preview</Label>
          <div 
            className="rounded-2xl overflow-hidden shadow-glow aspect-[1.75/1] p-5 relative"
            style={{
              background: `linear-gradient(135deg, ${cardData.primaryColor} 0%, ${cardData.secondaryColor} 100%)`
            }}
          >
            <div className="text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-2xl">{cardData.fullName || "Your Name"}</h3>
                <p className="text-white/80 text-sm mt-1">{cardData.profession || "Your Title"}</p>
                <p className="text-white/70 text-xs mt-0.5">{cardData.company || "Company"}</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-0.5 text-xs text-white/80">
                  {cardData.email && <p>{cardData.email}</p>}
                  {cardData.phone && <p>{cardData.phone}</p>}
                  {cardData.website && <p>{cardData.website}</p>}
                </div>
                <div className="bg-white p-1.5 rounded-lg">
                  <QRCode 
                    value={`https://ubuntuhub.app/card/preview`}
                    size={50}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Templates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Label className="text-sm font-medium mb-3 block">Choose Template</Label>
          <div className="grid grid-cols-4 gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`relative rounded-xl overflow-hidden h-16 transition-all ${
                  cardData.template === template.id ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${template.primary} 0%, ${template.secondary} 100%)`
                }}
              >
                {cardData.template === template.id && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium text-center">
                  {template.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Color Presets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <Label className="text-sm font-medium mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Presets
          </Label>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleColorPreset(preset)}
                className={`flex-shrink-0 w-10 h-10 rounded-full transition-all ${
                  cardData.primaryColor === preset.primary ? "ring-2 ring-offset-2 ring-foreground" : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={cardData.fullName}
              onChange={(e) => setCardData({ ...cardData, fullName: e.target.value })}
              placeholder="John Doe"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="profession">Profession / Title *</Label>
            <Input
              id="profession"
              value={cardData.profession}
              onChange={(e) => setCardData({ ...cardData, profession: e.target.value })}
              placeholder="Software Developer"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={cardData.company}
              onChange={(e) => setCardData({ ...cardData, company: e.target.value })}
              placeholder="Tech Solutions Inc."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
              placeholder="john@example.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={cardData.phone}
              onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={cardData.website}
              onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
              placeholder="www.example.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <div className="flex justify-between">
              <Label htmlFor="bio">Short Bio</Label>
              <span className="text-xs text-muted-foreground">{cardData.bio.length}/200</span>
            </div>
            <Textarea
              id="bio"
              value={cardData.bio}
              onChange={(e) => setCardData({ ...cardData, bio: e.target.value.slice(0, 200) })}
              placeholder="A brief description about yourself..."
              className="mt-1.5 resize-none"
              rows={3}
            />
          </div>
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
            className="w-full h-14 gradient-primary text-primary-foreground rounded-xl shadow-glow text-base font-semibold"
          >
            Generate Business Card
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
