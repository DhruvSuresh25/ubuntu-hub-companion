import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Building2, Briefcase, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: Building2, label: "Orgs", path: "/organizations" },
  { icon: Briefcase, label: "Business", path: "/businesses" },
  { icon: MoreHorizontal, label: "More", path: "/more" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center py-2 px-3"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1 : 0.95,
                }}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-2 w-12 h-1 rounded-full gradient-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-sm")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
