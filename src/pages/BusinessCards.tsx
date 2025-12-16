import { motion } from "framer-motion";
import { Plus, Eye, Edit, Share2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { mockBusinessCards } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

export default function BusinessCards() {
  return (
    <div className="app-container content-area">
      <Header title="Business Cards" showBack />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Create New Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/business-cards/create">
            <Button className="w-full h-14 gradient-primary text-primary-foreground rounded-xl shadow-glow">
              <Plus className="w-5 h-5 mr-2" />
              Create New Card
            </Button>
          </Link>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 rounded-xl p-4 mb-6"
        >
          <p className="text-sm text-foreground">
            <span className="font-semibold">Pro Tip:</span> Create multiple cards for different purposes - 
            one for business, one for networking events, and more!
          </p>
        </motion.div>

        {/* Cards Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-muted-foreground mb-4"
        >
          You have <span className="font-semibold text-foreground">{mockBusinessCards.length}</span> business card(s)
        </motion.p>

        {/* Cards List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {mockBusinessCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-card rounded-2xl overflow-hidden shadow-soft"
            >
              {/* Card Preview */}
              <div 
                className="h-36 p-4 relative"
                style={{
                  background: `linear-gradient(135deg, ${card.primaryColor} 0%, ${card.secondaryColor} 100%)`
                }}
              >
                <div className="text-white">
                  <h3 className="font-bold text-xl">{card.fullName}</h3>
                  <p className="text-white/80 text-sm mt-1">{card.profession}</p>
                  <p className="text-white/70 text-xs mt-0.5">{card.company}</p>
                </div>
                <span className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium capitalize">
                  {card.template}
                </span>
              </div>
              
              {/* Card Actions */}
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(card.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <Link to={`/business-cards/${card.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to={`/business-cards/edit/${card.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {mockBusinessCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary-soft flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No Cards Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first digital business card to share with others
            </p>
            <Link to="/business-cards/create">
              <Button className="gradient-primary text-primary-foreground">
                Create Your First Card
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
