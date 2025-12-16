import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockUser, mockBusinessCards, mockOrganizations } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Edit, Mail, Phone, MapPin, Briefcase, Building2, 
  CreditCard, ChevronRight, Settings 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const joinedOrgs = mockOrganizations.filter(org => org.isJoined);

  return (
    <div className="app-container content-area">
      <Header title="Profile" showBack />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 border-4 border-primary/20 mx-auto">
              <AvatarImage src={mockUser.avatar} />
              <AvatarFallback className="text-2xl">{mockUser.name[0]}</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Edit className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <h2 className="font-bold text-xl text-foreground mt-4">{mockUser.name}</h2>
          <p className="text-primary text-sm font-medium">{mockUser.profession}</p>
          {mockUser.bio && (
            <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">{mockUser.bio}</p>
          )}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-soft mb-6"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-card-blue flex items-center justify-center">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{mockUser.email}</p>
              </div>
            </div>
            {mockUser.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card-green flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{mockUser.phone}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Business Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Business Cards
            </h3>
            <Link to="/business-cards" className="text-primary text-sm font-medium">
              View All
            </Link>
          </div>
          <Link 
            to="/business-cards"
            className="block bg-card rounded-2xl p-4 shadow-soft card-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">My Cards</p>
                  <p className="text-sm text-muted-foreground">{mockBusinessCards.length} cards created</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* My Organizations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              My Organizations
            </h3>
            <Link to="/organizations" className="text-primary text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
            {joinedOrgs.map((org, index) => (
              <Link
                key={org.id}
                to={`/organizations/${org.id}`}
                className={`flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors ${
                  index !== joinedOrgs.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-lg gradient-primary-soft flex items-center justify-center">
                  <img src={org.logo} alt={org.name} className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm line-clamp-1">{org.name}</p>
                  <p className="text-xs text-muted-foreground">{org.memberCount} members</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline"
            className="w-full h-12 rounded-xl border-border"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
