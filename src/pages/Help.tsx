import { motion } from "framer-motion";
import { 
  Search, MessageCircle, Mail, Phone, FileText, 
  ChevronRight, ExternalLink, HelpCircle
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const faqItems = [
  {
    question: "How do I create a business card?",
    answer: "Go to More > Business Cards > Create New Card. Fill in your details, choose a template, and generate your card."
  },
  {
    question: "How do I join an organization?",
    answer: "Browse organizations and click the 'Join' button on any organization you're interested in."
  },
  {
    question: "Can I attend events without joining an organization?",
    answer: "Yes! You can RSVP to any public event. Some events may be exclusive to organization members."
  },
  {
    question: "How do I update my profile?",
    answer: "Go to Profile > tap the edit icon on your avatar, or go to Settings > Edit Profile."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard encryption to protect your data. Review our Privacy Policy for details."
  },
];

const supportOptions = [
  { icon: MessageCircle, label: "Live Chat", description: "Chat with our support team", action: "Start Chat" },
  { icon: Mail, label: "Email Support", description: "support@ubuntuhub.app", action: "Send Email" },
  { icon: Phone, label: "Phone Support", description: "Mon-Fri, 9am-5pm", action: "Call Now" },
];

export default function Help() {
  return (
    <div className="app-container content-area">
      <Header title="Help & Support" showBack />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help..." 
              className="pl-11 h-12 bg-card border-border rounded-xl"
            />
          </div>
        </motion.div>

        {/* Quick Support */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Contact Support
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {supportOptions.map((option) => (
              <div
                key={option.label}
                className="bg-card rounded-xl p-4 shadow-soft flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <option.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{option.label}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-lg">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Frequently Asked Questions
          </h3>
          <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className={`group ${index !== faqItems.length - 1 ? "border-b border-border" : ""}`}
              >
                <summary className="flex items-center justify-between px-4 py-4 cursor-pointer list-none">
                  <span className="font-medium text-foreground pr-4">{item.question}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Resources
          </h3>
          <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-card-blue flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent" />
              </div>
              <span className="flex-1 font-medium text-foreground">User Guide</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-card-green flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="flex-1 font-medium text-foreground">Video Tutorials</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-card-purple flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1 font-medium text-foreground">Community Forum</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </motion.div>

        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-primary-soft rounded-2xl p-5 text-center mb-6"
        >
          <h4 className="font-semibold text-foreground mb-2">Have Feedback?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            We'd love to hear your suggestions to make Ubuntu Hub better!
          </p>
          <Button className="gradient-primary text-primary-foreground rounded-xl">
            Send Feedback
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
