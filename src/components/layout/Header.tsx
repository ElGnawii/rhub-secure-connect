import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  userName: string;
  userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="h-16 gradient-card border-b border-border shadow-sm flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth w-64"
          />
        </div>
      </div>

      {/* User info and notifications */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center p-0">
            3
          </Badge>
        </Button>

        {/* User profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="ml-2">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}