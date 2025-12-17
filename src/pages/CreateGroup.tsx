import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Upload } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroups } from "@/hooks/useGroups";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const groupTypes = [
  { value: "general", label: "General" },
  { value: "youth", label: "Youth Wing" },
  { value: "women", label: "Women's Wing" },
  { value: "industry", label: "Industry Group" },
  { value: "committee", label: "Committee" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
];

export default function CreateGroup() {
  const navigate = useNavigate();
  const { createGroup } = useGroups();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    group_type: "general",
    image_url: "",
    organization_id: null as string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to create a group");
      navigate("/auth");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    setLoading(true);
    try {
      await createGroup({
        name: formData.name,
        description: formData.description || null,
        group_type: formData.group_type,
        image_url: formData.image_url || null,
        organization_id: formData.organization_id,
      });
      toast.success("Group created successfully!");
      navigate("/groups");
    } catch (error: any) {
      toast.error(error.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container content-area">
      <Header title="Create Group" showBack />
      
      <div className="px-4 max-w-2xl mx-auto pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-secondary/30 via-secondary/20 to-transparent rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-secondary/30 flex items-center justify-center">
              <Users className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">New Group</h2>
              <p className="text-sm text-muted-foreground">Create a community group or committee</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Group Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter group name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group_type">Group Type</Label>
                <Select
                  value={formData.group_type}
                  onValueChange={(value) => setFormData({ ...formData, group_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your group and its purpose..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Cover Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.png"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </div>
    </div>
  );
}
