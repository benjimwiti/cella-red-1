
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calendar, Activity } from "lucide-react";

interface WarriorProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  lastCrisis: string;
  status: 'good' | 'attention' | 'crisis';
  hydrationStatus: 'good' | 'warning';
  medicationStatus: 'good' | 'warning' | 'missed';
}

interface ReportsExporterProps {
  warriors: WarriorProfile[];
}

const ReportsExporter = ({ warriors }: ReportsExporterProps) => {
  const [selectedWarrior, setSelectedWarrior] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('pdf');

  const dataTypes = [
    { id: 'hydration', label: 'Hydration Logs', icon: '💧' },
    { id: 'medications', label: 'Medication Logs', icon: '💊' },
    { id: 'crisis', label: 'Crisis Episodes', icon: '🚨' },
    { id: 'pain', label: 'Pain Levels', icon: '📊' },
    { id: 'meals', label: 'Meal Logs', icon: '🍽️' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'sleep', label: 'Sleep Patterns', icon: '😴' }
  ];

  const timePeriods = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    if (checked) {
      setSelectedData([...selectedData, dataType]);
    } else {
      setSelectedData(selectedData.filter(d => d !== dataType));
    }
  };

  const handleExport = () => {
    if (!selectedWarrior || !selectedPeriod || selectedData.length === 0) {
      alert('Please select all required fields');
      return;
    }

    const warrior = warriors.find(w => w.id === selectedWarrior);
    const period = timePeriods.find(p => p.value === selectedPeriod);
    
    // Simulate export process
    const filename = `${warrior?.name}_health_report_${period?.label.replace(/\s+/g, '_').toLowerCase()}.${exportFormat}`;
    
    // In a real app, this would generate and download the actual file
    console.log('Exporting report:', {
      warrior: warrior?.name,
      period: period?.label,
      dataTypes: selectedData,
      format: exportFormat,
      filename
    });

    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    link.click();

    alert(`Report exported successfully!\nFile: ${filename}`);
  };

  const generateQuickReport = (warriorId: string, days: number) => {
    const warrior = warriors.find(w => w.id === warriorId);
    const filename = `${warrior?.name}_quick_report_${days}days.pdf`;
    
    console.log('Generating quick report:', {
      warrior: warrior?.name,
      days,
      filename
    });

    alert(`Quick report generated!\nFile: ${filename}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Export Reports</h1>
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-brand-red" />
          <span className="text-sm text-gray-600">Generate comprehensive health reports</span>
        </div>
      </div>

      {/* Quick Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warriors.map((warrior) => (
              <div key={warrior.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white font-semibold">
                    {warrior.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{warrior.name}</h3>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateQuickReport(warrior.id, 7)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Last 7 Days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateQuickReport(warrior.id, 30)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Last 30 Days
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warrior Selection */}
          <div className="space-y-2">
            <Label>Select Warrior</Label>
            <Select value={selectedWarrior} onValueChange={setSelectedWarrior}>
              <SelectTrigger>
                <SelectValue placeholder="Choose warrior" />
              </SelectTrigger>
              <SelectContent>
                {warriors.map((warrior) => (
                  <SelectItem key={warrior.id} value={warrior.id}>
                    {warrior.name} (Age {warrior.age})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Period Selection */}
          <div className="space-y-2">
            <Label>Time Period</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Type Selection */}
          <div className="space-y-3">
            <Label>Data to Include</Label>
            <div className="grid grid-cols-2 gap-3">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={dataType.id}
                    checked={selectedData.includes(dataType.id)}
                    onCheckedChange={(checked) => handleDataTypeChange(dataType.id, checked as boolean)}
                  />
                  <Label htmlFor={dataType.id} className="text-sm cursor-pointer">
                    <span className="mr-2">{dataType.icon}</span>
                    {dataType.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
            disabled={!selectedWarrior || !selectedPeriod || selectedData.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Generate & Download Report
          </Button>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Doctor Visit Summary</h3>
              <p className="text-sm text-gray-600 mb-3">Comprehensive health overview for medical appointments</p>
              <Button variant="outline" size="sm">
                Use Template
              </Button>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Monthly Progress</h3>
              <p className="text-sm text-gray-600 mb-3">Track improvements and patterns over time</p>
              <Button variant="outline" size="sm">
                Use Template
              </Button>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Crisis Analysis</h3>
              <p className="text-sm text-gray-600 mb-3">Detailed analysis of crisis episodes and triggers</p>
              <Button variant="outline" size="sm">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsExporter;
