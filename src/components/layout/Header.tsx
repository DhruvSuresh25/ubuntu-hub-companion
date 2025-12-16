import { ChevronLeft, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  transparent?: boolean;
}

export function Header({ 
  title, 
  showBack = false, 
  showSearch = false, 
  showNotification = false,
  transparent = false 
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 px-4 py-3 ${transparent ? 'bg-transparent' : 'bg-background/95 backdrop-blur-lg border-b border-border'}`}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          )}
          {showNotification && (
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
