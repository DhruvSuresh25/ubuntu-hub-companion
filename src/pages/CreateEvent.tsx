import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    image_url: '',
    category: 'general',
    is_ticketed: false,
    ticket_price: 0,
    max_attendees: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create an event');
      return;
    }

    if (!formData.title.trim() || !formData.start_date) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    const { error } = await createEvent({
      title: formData.title,
      description: formData.description || undefined,
      location: formData.location || undefined,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      image_url: formData.image_url || undefined,
      category: formData.category,
      is_ticketed: formData.is_ticketed,
      ticket_price: formData.is_ticketed ? formData.ticket_price : 0,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined
    });

    setLoading(false);
    if (error) {
      toast.error('Failed to create event');
    } else {
      toast.success('Event created successfully!');
      navigate('/events');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Create Event</h1>
        </div>
      </header>

      <main className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input 
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your event..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={v => setFormData(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Location</Label>
                <Input 
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Event location"
                />
              </div>

              <div>
                <Label>Image URL</Label>
                <Input 
                  value={formData.image_url}
                  onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Start Date & Time *</Label>
                <Input 
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label>End Date & Time</Label>
                <Input 
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Maximum Attendees (optional)</Label>
                <Input 
                  type="number"
                  value={formData.max_attendees}
                  onChange={e => setFormData(prev => ({ ...prev, max_attendees: e.target.value }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Ticketed Event</Label>
                <Switch 
                  checked={formData.is_ticketed}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, is_ticketed: checked }))}
                />
              </div>

              {formData.is_ticketed && (
                <div>
                  <Label>Ticket Price ($)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.ticket_price}
                    onChange={e => setFormData(prev => ({ ...prev, ticket_price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </main>
    </div>
  );
}
