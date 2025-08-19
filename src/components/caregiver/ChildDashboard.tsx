import { useState } from "react";
import { ArrowLeft, Calendar, Pill, FileText, BarChart3, Plus, Phone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  genotype?: string;
  lastActivity: string;
  status: 'good' | 'attention' | 'crisis';
  lastPainLog?: string;
  lastMedication?: string;
  upcomingAppointment?: string;
  medicationDue?: string;
}

interface ChildDashboardProps {
  child: ChildProfile;
  onBack: () => void;
}

const ChildDashboard = ({ child, onBack }: ChildDashboardProps) => {
  const [activeTab, setActiveTab] = useState('entries');
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} functionality`,
      description: `${action} feature would be implemented here`
    });
  };

  return (
    <div className="min-h-screen cella-gradient">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-brand-charcoal"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Profiles
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('Emergency call')}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <Phone className="w-4 h-4 mr-1" />
            Emergency
          </Button>
        </div>

        {/* Child Overview */}
        <Card className="glass-effect mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <Avatar className="w-20 h-20 ring-4 ring-white/50">
                <AvatarImage src={child.avatar} alt={child.name} />
                <AvatarFallback className="bg-brand-red/10 text-brand-red text-2xl">
                  {child.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Child Info */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                  <h1 className="text-2xl font-bold text-brand-charcoal">
                    {child.name}
                  </h1>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(child.status)} text-xs font-medium w-fit mx-auto sm:mx-0`}
                  >
                    {child.status === 'good' && 'Doing well'}
                    {child.status === 'attention' && 'Needs attention'}
                    {child.status === 'crisis' && 'Crisis mode'}
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-brand-charcoal/70">
                  <p>{child.age} years old</p>
                  {child.genotype && <p>Genotype: {child.genotype}</p>}
                  <p>Last activity: {child.lastActivity}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-xl">😰</div>
                </div>
                <div>
                  <p className="text-xs text-brand-charcoal/60">Last Pain Log</p>
                  <p className="text-sm font-medium text-brand-charcoal">
                    {child.lastPainLog || 'No recent pain'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-xs text-brand-charcoal/60">Last Medication</p>
                  <p className="text-sm font-medium text-brand-charcoal">
                    {child.lastMedication || 'No recent meds'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-brand-charcoal/60">Next Appointment</p>
                  <p className="text-sm font-medium text-brand-charcoal">
                    {child.upcomingAppointment || 'None scheduled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medication Alert */}
        {child.medicationDue && (
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-blue-800 font-medium">
                    💊 {child.medicationDue}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 text-xs">
                    Remind Later
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                    Mark Taken
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="entries" className="text-xs sm:text-sm">Entries</TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs sm:text-sm">Appointments</TabsTrigger>
            <TabsTrigger value="medications" className="text-xs sm:text-sm">Medications</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4">
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Entries</CardTitle>
                <Button size="sm" onClick={() => handleQuickAction('Add entry')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Entry
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border">
                    <div className="text-xl">😰</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Mild pain episode</p>
                      <p className="text-xs text-brand-charcoal/60">2 hours ago • Pain level: 4/10</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border">
                    <div className="text-xl">💊</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hydroxyurea taken</p>
                      <p className="text-xs text-brand-charcoal/60">4 hours ago • 500mg</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border">
                    <div className="text-xl">💧</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Water intake logged</p>
                      <p className="text-xs text-brand-charcoal/60">6 hours ago • 500ml</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Appointments</CardTitle>
                <Button size="sm" onClick={() => handleQuickAction('Schedule appointment')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dr. Johnson - Hematology</p>
                      <p className="text-xs text-brand-charcoal/60">Next Friday, 2:30 PM</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Reschedule
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Annual Checkup</p>
                      <p className="text-xs text-brand-charcoal/60">Last month • Completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Medications</CardTitle>
                <Button size="sm" onClick={() => handleQuickAction('Add medication')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Med
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border">
                    <Pill className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hydroxyurea</p>
                      <p className="text-xs text-brand-charcoal/60">500mg • Daily at 8:00 AM</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Folic Acid</p>
                      <p className="text-xs text-brand-charcoal/60">5mg • Daily at 8:00 AM</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Progress & Reports</CardTitle>
                <Button size="sm" onClick={() => handleQuickAction('Export report')}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border text-center">
                      <div className="text-2xl font-bold text-green-700">7</div>
                      <div className="text-xs text-green-600">Pain-free days</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border text-center">
                      <div className="text-2xl font-bold text-blue-700">95%</div>
                      <div className="text-xs text-blue-600">Med compliance</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Monthly Report</p>
                        <p className="text-xs text-brand-charcoal/60">Pain trends & medication</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Caregiver Quick Actions */}
        <Card className="glass-effect mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleQuickAction('Add caregiver note')}
              >
                <FileText className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="text-sm font-medium">Add Note</div>
                  <div className="text-xs text-brand-charcoal/60">Log observations</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleQuickAction('Mark appointment attended')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="text-sm font-medium">Mark Attended</div>
                  <div className="text-xs text-brand-charcoal/60">Appointment check-in</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleQuickAction('Export health report')}
              >
                <Download className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="text-sm font-medium">Export Data</div>
                  <div className="text-xs text-brand-charcoal/60">For doctor visits</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildDashboard;