import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileUploadPlaceholder from '@/components/FileUploadPlaceholder';
import { 
  User, Mail, Phone, MapPin, Briefcase, 
  BookOpen, Award, Plus, Trash2, Check, AlertCircle
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';


const EditableField = ({ isEditing, value, onChange, name, label, icon: Icon, type = "text", placeholder, userDataValue, as: Component = Input }) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    {isEditing ? (
      <Component
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        rows={type === "textarea" ? 4 : undefined}
      />
    ) : (
      <div className={`flex items-center h-10 px-3 rounded-md border border-input bg-background ${type === "textarea" ? 'min-h-[100px] h-auto py-2 items-start' : ''}`}>
        {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground" />}
        <span className="whitespace-pre-line">{userDataValue}</span>
      </div>
    )}
  </div>
);

const EditableList = ({ isEditing, items, setItems, itemName, fields, onAddItem, onRemoveItem, onChangeItem, itemIcon: ItemIcon }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold capitalize">{itemName}s</h3>
      {isEditing && (
        <Button variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-1" /> Add {itemName}
        </Button>
      )}
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id || index} className="relative">
          {isEditing ? (
            <div className="space-y-3 p-4 border border-border rounded-md">
              <div className="absolute top-2 right-2">
                <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id || index)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label className="capitalize">{field.label || field.name}</Label>
                  <Input
                    value={item[field.name]}
                    onChange={(e) => onChangeItem(item.id || index, field.name, e.target.value)}
                    placeholder={field.placeholder || field.label || field.name}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex">
              {ItemIcon && <div className="mr-4 mt-1"><ItemIcon className="h-5 w-5 text-primary" /></div>}
              <div>
                <h4 className="font-medium">{item[fields[0].name]}</h4>
                {fields.slice(1).map(field => (
                  <p key={field.name} className="text-muted-foreground">{item[field.name]}{field.name === 'year' ? '' : field.name === 'period' ? '' : ''}</p>
                ))}
                 {item.company && item.period && <p className="text-muted-foreground">{item.company}, {item.period}</p>}
                 {item.description && <p className="text-muted-foreground mt-1">{item.description}</p>}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const ProfileForm = ({ isEditing, formData, setFormData, userData }) => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({ ...prev, profilePicture: null }));
    }
  };

  const handleCryptoToggle = (checked) => {
    setFormData(prev => ({ ...prev, acceptsCrypto: checked }));
  };

  const handleSkillsChange = (newSkills) => {
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };
  
  const addSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && !formData.skills.includes(newSkill)) {
      handleSkillsChange([...formData.skills, newSkill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    handleSkillsChange(formData.skills.filter(skill => skill !== skillToRemove));
  };

  const handleListChange = (listName, index, field, value) => {
    setFormData(prev => {
      const newList = [...prev[listName]];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [listName]: newList };
    });
  };

  const addListItem = (listName, newItemTemplate) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], { ...newItemTemplate, id: uuidv4() }]
    }));
  };

  const removeListItem = (listName, id) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(item => item.id !== id)
    }));
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <FileUploadPlaceholder onFileUpload={handleFileUpload} label="Upload Profile Picture" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField isEditing={isEditing} value={formData.name} onChange={handleInputChange} name="name" label="Full Name" icon={User} userDataValue={userData.name} />
          <EditableField isEditing={isEditing} value={formData.email} onChange={handleInputChange} name="email" label="Email" icon={Mail} type="email" userDataValue={userData.email} />
          <EditableField isEditing={isEditing} value={formData.phone} onChange={handleInputChange} name="phone" label="Phone" icon={Phone} userDataValue={userData.phone} />
          <EditableField isEditing={isEditing} value={formData.location} onChange={handleInputChange} name="location" label="Location" icon={MapPin} userDataValue={userData.location} />
        </div>
        
        <EditableField isEditing={isEditing} value={formData.bio} onChange={handleInputChange} name="bio" label="Bio" as={Textarea} type="textarea" userDataValue={userData.bio} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField isEditing={isEditing} value={formData.title} onChange={handleInputChange} name="title" label="Professional Title" icon={Briefcase} userDataValue={userData.title} />
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            {isEditing ? (
              <Input id="hourlyRate" name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} />
            ) : (
              <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                <span>${userData.hourlyRate}/hour</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="acceptsCrypto">Accept Cryptocurrency</Label>
            {isEditing ? (
              <Switch id="acceptsCrypto" checked={formData.acceptsCrypto} onCheckedChange={handleCryptoToggle} />
            ) : (
              <Badge variant={userData.acceptsCrypto ? "default" : "secondary"}>
                {userData.acceptsCrypto ? <Check className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                {userData.acceptsCrypto ? "Enabled" : "Disabled"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Allow clients to pay you using cryptocurrency.</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Skills</h3>
            {isEditing && <Button variant="outline" size="sm" onClick={addSkill}><Plus className="h-4 w-4 mr-1" /> Add Skill</Button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {(isEditing ? formData.skills : userData.skills).map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                {isEditing && <button onClick={() => removeSkill(skill)} className="ml-1 rounded-full hover:bg-secondary/80 p-0.5"><Trash2 className="h-3 w-3" /></button>}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />
        
        <EditableList
          isEditing={isEditing}
          items={isEditing ? formData.education : userData.education}
          setItems={(newItems) => setFormData(prev => ({ ...prev, education: newItems }))}
          itemName="Education"
          fields={[{ name: 'degree', label: 'Degree' }, { name: 'institution', label: 'Institution' }, { name: 'year', label: 'Year' }]}
          onAddItem={() => addListItem('education', { id: uuidv4(), degree: '', institution: '', year: '' })}
          onRemoveItem={(id) => removeListItem('education', id)}
          onChangeItem={(id, field, value) => {
            const index = formData.education.findIndex(item => item.id === id);
            if (index !== -1) handleListChange('education', index, field, value);
          }}
          itemIcon={BookOpen}
        />

        <Separator />

        <EditableList
          isEditing={isEditing}
          items={isEditing ? formData.experience : userData.experience}
          setItems={(newItems) => setFormData(prev => ({ ...prev, experience: newItems }))}
          itemName="Experience"
          fields={[
            { name: 'title', label: 'Title' }, 
            { name: 'company', label: 'Company' }, 
            { name: 'period', label: 'Period' },
            { name: 'description', label: 'Description (Optional)' }
          ]}
          onAddItem={() => addListItem('experience', { id: uuidv4(), title: '', company: '', period: '', description: '' })}
          onRemoveItem={(id) => removeListItem('experience', id)}
          onChangeItem={(id, field, value) => {
            const index = formData.experience.findIndex(item => item.id === id);
            if (index !== -1) handleListChange('experience', index, field, value);
          }}
          itemIcon={Briefcase}
        />

        <Separator />

        <EditableList
          isEditing={isEditing}
          items={isEditing ? formData.certifications : userData.certifications}
          setItems={(newItems) => setFormData(prev => ({ ...prev, certifications: newItems }))}
          itemName="Certification"
          fields={[{ name: 'name', label: 'Certification Name' }]}
          onAddItem={() => addListItem('certifications', { id: uuidv4(), name: '' })}
          onRemoveItem={(id) => removeListItem('certifications', id)}
          onChangeItem={(id, field, value) => {
            const index = formData.certifications.findIndex(item => item.id === id);
            if (index !== -1) handleListChange('certifications', index, field, value);
          }}
          itemIcon={Award}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileForm;