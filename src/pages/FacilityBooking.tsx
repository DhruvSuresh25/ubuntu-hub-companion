import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, MapPin, Users, Clock, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFacilities } from '@/hooks/useFacilities';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function FacilityBooking() {
  const navigate = useNavigate();
  const { facilities, bookings, loading, createBooking, cancelBooking } = useFacilities();
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  
  const [newBooking, setNewBooking] = useState({
    title: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  const handleCreateBooking = async () => {
    if (!selectedFacility) {
      toast.error('Please select a facility');
      return;
    }
    if (!newBooking.title.trim()) {
      toast.error('Please enter a booking title');
      return;
    }
    if (!newBooking.start_time || !newBooking.end_time) {
      toast.error('Please select start and end times');
      return;
    }

    const { error } = await createBooking({
      facility_id: selectedFacility,
      title: newBooking.title,
      start_time: newBooking.start_time,
      end_time: newBooking.end_time,
      notes: newBooking.notes || undefined
    });

    if (error) {
      toast.error('Failed to create booking');
    } else {
      toast.success('Booking created successfully');
      setBookingOpen(false);
      setNewBooking({ title: '', start_time: '', end_time: '', notes: '' });
      setSelectedFacility('');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await cancelBooking(bookingId);
    if (error) {
      toast.error('Failed to cancel booking');
    } else {
      toast.success('Booking cancelled');
    }
  };

  const userBookings = bookings.filter(b => b.user_id === user?.id && b.status !== 'cancelled');
  const upcomingBookings = bookings.filter(b => 
    b.status !== 'cancelled' && 
    new Date(b.start_time) > new Date()
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Facility Booking</h1>
          </div>
          {user && (
            <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Book a Facility</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select Facility</Label>
                    <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map(f => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name} {f.hourly_rate > 0 && `($${f.hourly_rate}/hr)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Booking Title</Label>
                    <Input 
                      value={newBooking.title}
                      onChange={e => setNewBooking(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Team Meeting"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input 
                        type="datetime-local"
                        value={newBooking.start_time}
                        onChange={e => setNewBooking(prev => ({ ...prev, start_time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input 
                        type="datetime-local"
                        value={newBooking.end_time}
                        onChange={e => setNewBooking(prev => ({ ...prev, end_time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Notes (optional)</Label>
                    <Textarea 
                      value={newBooking.notes}
                      onChange={e => setNewBooking(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special requirements..."
                    />
                  </div>
                  <Button onClick={handleCreateBooking} className="w-full">
                    Create Booking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Available Facilities */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Available Facilities</h2>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : facilities.length === 0 ? (
            <Card className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No facilities available yet.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {facilities.map(facility => (
                <Card key={facility.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {facility.image_url ? (
                        <img 
                          src={facility.image_url} 
                          alt={facility.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                          <Building className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{facility.name}</h3>
                        {facility.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {facility.location}
                          </p>
                        )}
                        {facility.capacity && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Capacity: {facility.capacity}
                          </p>
                        )}
                        {facility.hourly_rate > 0 && (
                          <Badge variant="secondary" className="mt-2">
                            ${facility.hourly_rate}/hour
                          </Badge>
                        )}
                        {facility.amenities && facility.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {facility.amenities.map((amenity, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Your Bookings */}
        {user && userBookings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Your Bookings</h2>
            <div className="space-y-3">
              {userBookings.map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.facility?.name}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(booking.start_time), 'MMM d, h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{booking.status}</Badge>
                        {booking.status !== 'cancelled' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Upcoming Reservations</h2>
            <div className="space-y-2">
              {upcomingBookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{booking.facility?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.start_time), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
