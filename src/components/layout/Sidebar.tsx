import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  MessageSquare, 
  User, 
  Settings,
  LogOut,
  CreditCard,
  ClipboardList,
  Bell,
  CheckCircle,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "payslips", label: "Bulletins de paie", icon: CreditCard },
    { id: "requests", label: "Mes demandes", icon: ClipboardList },
    { id: "approvals", label: "Approbations", icon: CheckCircle },
    { id: "calendar", label: "Congés", icon: Calendar },
    { id: "communications", label: "Communications", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Mon profil", icon: User },
    ...(user?.role === 'admin' ? [{ id: "admin", label: "Administration", icon: Shield }] : []),
  ];
  return (
    <div className="w-64 gradient-card border-r border-border shadow-md flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Portail RH</h1>
            <p className="text-sm text-muted-foreground">Espace employé</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-smooth",
                isActive 
                  ? "gradient-primary text-primary-foreground shadow-corporate" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-smooth"
        >
          <Settings className="w-5 h-5 mr-3" />
          Paramètres
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive transition-smooth"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}