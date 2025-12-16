import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

interface DonateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDonate: (amount: number, name: string, email: string, message: string, isAnonymous: boolean) => void;
  campaignTitle: string;
}

const suggestedAmounts = [100, 500, 1000, 2500, 5000, 10000];

export function DonateDialog({ open, onOpenChange, onDonate, campaignTitle }: DonateDialogProps) {
  const { profile } = useProfile();
  const { user } = useAuth();
  
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedAmount = customAmount || amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAmount || parseFloat(selectedAmount) <= 0) return;
    
    setLoading(true);
    await onDonate(
      parseFloat(selectedAmount),
      name,
      email,
      message,
      isAnonymous
    );
    setLoading(false);
    
    // Reset form
    setAmount("");
    setCustomAmount("");
    setMessage("");
    setIsAnonymous(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Make a Donation
          </DialogTitle>
          <DialogDescription className="line-clamp-1">
            Supporting: {campaignTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Suggested Amounts */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setAmount(amt.toString());
                    setCustomAmount("");
                  }}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    amount === amt.toString() && !customAmount
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="customAmount" className="text-sm font-medium mb-2 block">
              Or enter custom amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="customAmount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount("");
                }}
                className="pl-8 bg-card"
                min="1"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="donorName" className="text-sm font-medium mb-2 block">
              Your Name
            </Label>
            <Input
              id="donorName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-card"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="donorEmail" className="text-sm font-medium mb-2 block">
              Email (for receipt)
            </Label>
            <Input
              id="donorEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-card"
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium mb-2 block">
              Leave a message (optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Words of encouragement..."
              className="bg-card min-h-[80px]"
            />
          </div>

          {/* Anonymous */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous" 
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Make my donation anonymous
            </Label>
          </div>

          {/* Submit */}
          <Button 
            type="submit"
            className="w-full gradient-primary shadow-glow py-6 text-lg"
            disabled={!selectedAmount || parseFloat(selectedAmount) <= 0 || !name || loading}
          >
            {loading ? "Processing..." : `Donate ₹${selectedAmount ? parseFloat(selectedAmount).toLocaleString() : "0"}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
