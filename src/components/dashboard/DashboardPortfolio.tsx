import { FolderOpen, Plus, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardPortfolioProps {
  onAddProperty?: () => void;
}

const DashboardPortfolio = ({ onAddProperty }: DashboardPortfolioProps) => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden">
            <Menu className="w-6 h-6" />
          </SidebarTrigger>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              My Portfolio
            </h1>
            <p className="text-muted-foreground">Manage your listed properties.</p>
          </div>
        </div>
        <Button onClick={onAddProperty} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Properties Grid */}
      <Card className="bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Properties Listed</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            Start by adding your first property to showcase to potential renters.
          </p>
          <Button onClick={onAddProperty} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Property
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPortfolio;
