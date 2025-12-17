import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, Filter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGroups, Group } from "@/hooks/useGroups";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const groupTypes = [
  { value: "all", label: "All" },
  { value: "youth", label: "Youth" },
  { value: "women", label: "Women" },
  { value: "industry", label: "Industry" },
  { value: "committee", label: "Committee" },
  { value: "general", label: "General" },
];

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const { fetchGroups, joinGroup } = useGroups();
  const { user } = useAuth();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (group: Group) => {
    if (!user) {
      toast.error("Please login to join groups");
      return;
    }
    try {
      await joinGroup(group.id);
      toast.success(`Joined ${group.name}!`);
    } catch (error: any) {
      if (error.message?.includes("duplicate")) {
        toast.info("You're already a member of this group");
      } else {
        toast.error("Failed to join group");
      }
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || group.group_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="app-container content-area">
      <Header title="Groups & Committees" showBack />
      
      <div className="px-4 max-w-2xl mx-auto">
        {/* Hero Banner */}
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
              <h2 className="text-xl font-bold text-foreground">Groups & Committees</h2>
              <p className="text-sm text-muted-foreground">Join communities that match your interests</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {groupTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="whitespace-nowrap"
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Groups List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Groups Found</h3>
            <p className="text-muted-foreground">Check back later for new groups</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                    {group.image_url ? (
                      <img src={group.image_url} alt={group.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {group.group_type}
                      </Badge>
                    </div>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button size="sm" onClick={() => handleJoinGroup(group)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Join Group
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
