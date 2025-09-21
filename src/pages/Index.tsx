import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PayslipSection } from "@/components/payslips/PayslipSection";
import { RequestsSection } from "@/components/requests/RequestsSection";
import { ApprovalInterface } from "@/components/workflow/ApprovalInterface";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "payslips":
        return <PayslipSection />;
      case "requests":
        return <RequestsSection />;
      case "approvals":
        return <ApprovalInterface />;
      case "calendar":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Calendrier des congés</h2>
            <p className="text-muted-foreground">Cette section sera développée prochainement</p>
          </div>
        );
      case "communications":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Communications RH</h2>
            <p className="text-muted-foreground">Cette section sera développée prochainement</p>
          </div>
        );
      case "notifications":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <p className="text-muted-foreground">Cette section sera développée prochainement</p>
          </div>
        );
      case "profile":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
            <p className="text-muted-foreground">Cette section sera développée prochainement</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
