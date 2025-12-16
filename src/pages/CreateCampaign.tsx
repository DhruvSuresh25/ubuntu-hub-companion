import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Calendar, Target, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFundraising } from "@/hooks/useFundraising";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "medical", label: "Medical" },
  { value: "education", label: "Education" },
  { value: "community", label: "Community" },
  { value: "emergency", label: "Emergency" },
  { value: "environment", label: "Environment" },
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { createCampaign } = useFundraising();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    story: "",
    image_url: "",
    goal_amount: "",
    category: "community",
    end_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.goal_amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const campaign = await createCampaign({
      title: formData.title,
      description: formData.description,
      story: formData.story || null,
      image_url: formData.image_url || null,
      goal_amount: parseFloat(formData.goal_amount),
      category: formData.category,
      status: "active",
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
    });

    setLoading(false);
    
    if (campaign) {
      navigate(`/fundraise/${campaign.id}`);
    }
  };

  return (
    <div className="app-container content-area">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Create Campaign</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            Campaign Title *
          </Label>
          <Input
            id="title"
            placeholder="Help fund medical treatment..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-card border-border"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Label htmlFor="description" className="text-sm font-medium mb-2 block">
            Short Description *
          </Label>
          <Textarea
            id="description"
            placeholder="Brief description of your campaign..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-card border-border min-h-[80px]"
          />
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="story" className="text-sm font-medium mb-2 block">
            Full Story
          </Label>
          <Textarea
            id="story"
            placeholder="Share the complete story behind your campaign..."
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            className="bg-card border-border min-h-[150px]"
          />
        </motion.div>

        {/* Image URL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Label htmlFor="image" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Image className="w-4 h-4 text-primary" />
            Cover Image URL
          </Label>
          <Input
            id="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="bg-card border-border"
          />
          {formData.image_url && (
            <div className="mt-3 rounded-xl overflow-hidden">
              <img 
                src={formData.image_url} 
                alt="Preview" 
                className="w-full h-40 object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </motion.div>

        {/* Goal Amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="goal" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            Fundraising Goal (₹) *
          </Label>
          <Input
            id="goal"
            type="number"
            placeholder="50000"
            min="100"
            value={formData.goal_amount}
            onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
            className="bg-card border-border"
          />
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Label className="text-sm font-medium mb-2 block">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* End Date */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="endDate" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            End Date (Optional)
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="bg-card border-border"
            min={new Date().toISOString().split('T')[0]}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="pt-4"
        >
          <Button 
            type="submit" 
            className="w-full gradient-primary shadow-glow py-6 text-lg rounded-xl"
            disabled={loading}
          >
            {loading ? "Creating..." : "Launch Campaign"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
