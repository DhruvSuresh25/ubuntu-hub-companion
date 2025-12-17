import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Crown, Star, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemberships, MembershipPlan } from "@/hooks/useMemberships";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const planIcons: Record<string, React.ReactNode> = {
  student: <Sparkles className="w-6 h-6" />,
  standard: <Star className="w-6 h-6" />,
  corporate: <Crown className="w-6 h-6" />,
  vip: <Crown className="w-6 h-6" />,
};

export default function Memberships() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchPlans, subscribe } = useMemberships();
  const { user } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await fetchPlans();
      setPlans(data);
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: MembershipPlan) => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }
    try {
      await subscribe(plan.id, plan.organization_id || undefined);
      toast.success(`Subscribed to ${plan.name}!`);
    } catch (error) {
      toast.error("Failed to subscribe");
    }
  };

  return (
    <div className="app-container content-area">
      <Header title="Membership Plans" showBack />
      
      <div className="px-4 max-w-2xl mx-auto">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-2xl p-6 mb-6 text-primary-foreground"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Membership Plans</h2>
              <p className="text-sm opacity-90">Choose the plan that fits your needs</p>
            </div>
          </div>
        </motion.div>

        {/* Plans List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CreditCard className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Plans Available</h3>
            <p className="text-muted-foreground">Membership plans coming soon</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card rounded-xl p-6 shadow-soft border-2 ${
                  plan.plan_type === "vip" || plan.plan_type === "corporate"
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.plan_type === "vip" || plan.plan_type === "corporate"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {planIcons[plan.plan_type] || <Star className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {plan.plan_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      R{plan.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      /{plan.duration_months} month{plan.duration_months > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {plan.description && (
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                )}

                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  className="w-full"
                  variant={plan.plan_type === "vip" || plan.plan_type === "corporate" ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan)}
                >
                  Subscribe Now
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
