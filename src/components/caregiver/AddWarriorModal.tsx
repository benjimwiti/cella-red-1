
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WarriorProfile {
  name: string;
  age: number;
  avatar: string;
  lastCrisis: string;
  status: 'good' | 'attention' | 'crisis';
  hydrationStatus: 'good' | 'warning';
  medicationStatus: 'good' | 'warning' | 'missed';
}

interface AddWarriorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (warrior: WarriorProfile) => void;
}

const AddWarriorModal = ({ isOpen, onClose, onAdd }: AddWarriorModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    avatar: ''
  });

  const avatarOptions = [
    { id: 'female', src: '/lovable-uploads/c59e64c1-b31d-4b6c-9512-be81ef112725.png', label: 'Female' },
    { id: 'male', src: '/lovable-uploads/afdd89fb-3254-4ffe-9672-724d48c77f44.png', label: 'Male' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age) return;

    const selectedAvatar = avatarOptions.find(a => a.id === formData.avatar)?.src || avatarOptions[0].src;

    const newWarrior: WarriorProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      avatar: selectedAvatar,
      lastCrisis: 'No recent crisis',
      status: 'good',
      hydrationStatus: 'good',
      medicationStatus: 'good'
    };

    onAdd(newWarrior);
    setFormData({ name: '', age: '', gender: '', avatar: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Warrior</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter warrior's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Enter age"
              min="1"
              max="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="flex space-x-4">
              {avatarOptions.map((option) => (
                <div
                  key={option.id}
                  className={`cursor-pointer p-2 rounded-lg border-2 transition-colors ${
                    formData.avatar === option.id ? 'border-brand-red' : 'border-gray-200'
                  }`}
                  onClick={() => setFormData({ ...formData, avatar: option.id })}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={option.src} alt={option.label} />
                    <AvatarFallback>{option.label[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-center mt-1">{option.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-brand-red hover:bg-brand-red/90">
              Add Warrior
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWarriorModal;
