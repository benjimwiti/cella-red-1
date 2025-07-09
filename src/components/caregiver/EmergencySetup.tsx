
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Plus, Shield, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  warriorId?: string;
  isDefault: boolean;
}

interface EmergencySetupProps {
  warriors: WarriorProfile[];
}

const EmergencySetup = ({ warriors }: EmergencySetupProps) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      phone: '+1-555-0123',
      relationship: 'Primary Doctor',
      isDefault: false
    },
    {
      id: '2',
      name: 'Children\'s Hospital ER',
      phone: '+1-555-0911',
      relationship: 'Emergency Room',
      isDefault: true
    },
    {
      id: '3',
      name: 'Mom (Jane Doe)',
      phone: '+1-555-0456',
      relationship: 'Mother',
      warriorId: '1',
      isDefault: false
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    warriorId: '',
    isDefault: false
  });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      relationship: formData.relationship,
      warriorId: formData.warriorId || undefined,
      isDefault: formData.isDefault
    };

    setContacts([...contacts, newContact]);
    setFormData({
      name: '',
      phone: '',
      relationship: '',
      warriorId: '',
      isDefault: false
    });
    setShowAddModal(false);
  };

  const handleCall = (phone: string) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${phone}`);
  };

  const handleDelete = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const setAsDefault = (contactId: string) => {
    setContacts(contacts.map(c => ({
      ...c,
      isDefault: c.id === contactId
    })));
  };

  const generalContacts = contacts.filter(c => !c.warriorId);
  const warriorSpecificContacts = contacts.filter(c => c.warriorId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Setup</h1>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-brand-red hover:bg-brand-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Emergency Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. Smith, Hospital Name, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1-555-0123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship/Role</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="Primary Doctor, Emergency Room, Family Member"
                />
              </div>

              <div className="space-y-2">
                <Label>Specific to Warrior (Optional)</Label>
                <Select value={formData.warriorId} onValueChange={(value) => setFormData({ ...formData, warriorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All warriors (general contact)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All warriors (general contact)</SelectItem>
                    {warriors.map((warrior) => (
                      <SelectItem key={warrior.id} value={warrior.id}>
                        {warrior.name} only
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-brand-red hover:bg-brand-red/90">
                  Add Contact
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Call Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <Shield className="w-5 h-5" />
            <span>Emergency Quick Call</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.filter(c => c.isDefault).map((contact) => (
              <Button
                key={contact.id}
                onClick={() => handleCall(contact.phone)}
                className="h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-3"
              >
                <Phone className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{contact.name}</div>
                  <div className="text-sm opacity-90">{contact.phone}</div>
                </div>
              </Button>
            ))}
            <Button
              onClick={() => handleCall('911')}
              className="h-16 bg-red-800 hover:bg-red-900 text-white flex items-center justify-center space-x-3"
            >
              <Phone className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Emergency Services</div>
                <div className="text-sm opacity-90">911</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* General Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>General Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {generalContacts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No general emergency contacts added</p>
          ) : (
            <div className="space-y-3">
              {generalContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center space-x-2">
                        <span>{contact.name}</span>
                        {contact.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      {contact.relationship && (
                        <p className="text-sm text-gray-500">{contact.relationship}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCall(contact.phone)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    {!contact.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAsDefault(contact.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warrior-Specific Contacts */}
      {warriorSpecificContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Warrior-Specific Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warriorSpecificContacts.map((contact) => {
                const warrior = warriors.find(w => w.id === contact.warriorId);
                return (
                  <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center space-x-2">
                          <span>{contact.name}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {warrior?.name}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        {contact.relationship && (
                          <p className="text-sm text-gray-500">{contact.relationship}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(contact.phone)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencySetup;
