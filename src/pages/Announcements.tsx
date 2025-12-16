import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { mockAnnouncements } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Announcements() {
  return (
    <div className="app-container content-area">
      <Header title="Announcements" showBack />
      
      <div className="px-4 max-w-md mx-auto">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 rounded-xl p-4 mb-6"
        >
          <p className="text-sm text-foreground">
            <span className="font-semibold">Stay Updated:</span> Important announcements from 
            your organizations and community appear here.
          </p>
        </motion.div>

        {/* Announcements List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {mockAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-card rounded-2xl overflow-hidden shadow-soft"
            >
              {/* Header */}
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-11 h-11">
                      <AvatarImage src={announcement.authorAvatar} />
                      <AvatarFallback>{announcement.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{announcement.author}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.date).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                <h3 className="font-semibold text-foreground mb-2">{announcement.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{announcement.content}</p>
              </div>

              {/* Image */}
              {announcement.image && (
                <div className="px-4 pb-3">
                  <img 
                    src={announcement.image} 
                    alt={announcement.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{announcement.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{announcement.comments}</span>
                  </button>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="py-8 text-center"
        >
          <p className="text-muted-foreground text-sm">You're all caught up! ✨</p>
        </motion.div>
      </div>
    </div>
  );
}
