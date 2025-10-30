import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  genotype?: string;
  lastActivity: string;
  status: 'good' | 'attention' | 'crisis';
  medicationDue?: string;
}

interface ChildProfilesProps {
  children: ChildProfile[];
  onSelectChild: (child: ChildProfile) => void;
  onAddChild: () => void;
  onBack: () => void;
}

const ChildProfiles = ({ onBack, children, onSelectChild, onAddChild }: ChildProfilesProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'good': return '😊';
      case 'attention': return '⚠️';
      case 'crisis': return '🚨';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen cella-gradient">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
         <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Your Children
          </h1>
          <p className="text-foreground/60">
            Manage health tracking for each child
          </p>
        </div>

        {/* Add Child Card - Always visible at top */}
        <Card 
          className="glass-effect border-dashed border-2 border-brand-red/30 hover:border-brand-red/50 cursor-pointer transition-all duration-200 mb-6"
          onClick={onAddChild}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-brand-red" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-foreground">Add Another Child</h3>
                <p className="text-sm text-foreground/60">Create a new health profile</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children Grid */}
        {children.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Active Profiles ({children.length})
            </h2>
            
            {/* Mobile: Stack vertically, Desktop: Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {children.map((child) => (
                <Card
                  key={child.id}
                  className="glass-effect hover:shadow-lg cursor-pointer transition-all duration-200"
                  onClick={() => onSelectChild(child)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <Avatar className="w-16 h-16 ring-2 ring-white/50 flex-shrink-0">
                        <AvatarImage src={child.avatar} alt={child.name} />
                        <AvatarFallback className="bg-brand-red/10 text-brand-red text-lg">
                          {child.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Child Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg truncate">
                              {child.name}
                            </h3>
                            <p className="text-foreground/60 text-sm">
                              {child.age} years old
                              {child.genotype && ` • ${child.genotype}`}
                            </p>
                          </div>
                          <span className="text-xl flex-shrink-0">
                            {getStatusEmoji(child.status)}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(child.status)} text-xs font-medium`}
                        >
                          {child.status === 'good' && 'Doing well'}
                          {child.status === 'attention' && 'Needs attention'}
                          {child.status === 'crisis' && 'Crisis mode'}
                        </Badge>

                        {/* Last Activity */}
                        <p className="text-xs text-foreground/50">
                          Last activity: {child.lastActivity}
                        </p>

                        {/* Medication Alert */}
                        {child.medicationDue && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                            <p className="text-xs text-blue-800 font-medium">
                              💊 {child.medicationDue}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">👶</div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No children added yet
            </h3>
            <p className="text-foreground/60 mb-6">
              Add your first child to start tracking their health journey
            </p>
            <Button 
              className="bg-brand-red hover:bg-brand-red/90 text-white"
              onClick={onAddChild}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Child
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildProfiles;