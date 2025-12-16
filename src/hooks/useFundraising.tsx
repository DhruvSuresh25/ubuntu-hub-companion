import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Campaign {
  id: string;
  user_id: string;
  title: string;
  description: string;
  story: string | null;
  image_url: string | null;
  goal_amount: number;
  raised_amount: number;
  category: string;
  status: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_id: string | null;
  donor_name: string;
  donor_email: string | null;
  amount: number;
  message: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export function useFundraising() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fundraising_campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCampaigns = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("fundraising_campaigns")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyCampaigns(data || []);
    } catch (error: any) {
      console.error("Error fetching my campaigns:", error);
    }
  };

  const getCampaign = async (id: string): Promise<Campaign | null> => {
    try {
      const { data, error } = await supabase
        .from("fundraising_campaigns")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error fetching campaign:", error);
      return null;
    }
  };

  const getCampaignDonations = async (campaignId: string): Promise<Donation[]> => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };

  const createCampaign = async (campaign: Omit<Campaign, "id" | "user_id" | "raised_amount" | "created_at" | "updated_at">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to create a campaign",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("fundraising_campaigns")
        .insert({
          ...campaign,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Campaign created successfully!",
      });
      
      await fetchCampaigns();
      await fetchMyCampaigns();
      return data;
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
      return null;
    }
  };

  const makeDonation = async (
    campaignId: string,
    amount: number,
    donorName: string,
    donorEmail?: string,
    message?: string,
    isAnonymous: boolean = false
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to donate",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from("donations")
        .insert({
          campaign_id: campaignId,
          donor_id: user.id,
          donor_name: isAnonymous ? "Anonymous" : donorName,
          donor_email: donorEmail,
          amount,
          message,
          is_anonymous: isAnonymous,
        });

      if (error) throw error;
      
      toast({
        title: "Thank you!",
        description: "Your donation was successful!",
      });
      
      await fetchCampaigns();
      return true;
    } catch (error: any) {
      console.error("Error making donation:", error);
      toast({
        title: "Error",
        description: "Failed to process donation",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const { error } = await supabase
        .from("fundraising_campaigns")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Campaign updated successfully!",
      });
      
      await fetchCampaigns();
      await fetchMyCampaigns();
      return true;
    } catch (error: any) {
      console.error("Error updating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyCampaigns();
    }
  }, [user]);

  return {
    campaigns,
    myCampaigns,
    loading,
    fetchCampaigns,
    getCampaign,
    getCampaignDonations,
    createCampaign,
    makeDonation,
    updateCampaign,
  };
}
