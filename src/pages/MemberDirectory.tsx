import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Briefcase, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useMembers } from '@/hooks/useMembers';

export default function MemberDirectory() {
  const navigate = useNavigate();
  const { members, loading, searchMembers } = useMembers();
  const [searchQuery, setSearchQuery] = useState('');

  const displayedMembers = searchQuery ? searchMembers(searchQuery) : members;
  const publicMembers = displayedMembers.filter(m => m.is_public);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Member Directory</h1>
        </div>
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, occupation, location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <main className="p-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading members...</div>
        ) : publicMembers.length === 0 ? (
          <Card className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No public members found.</p>
            <p className="text-sm text-muted-foreground mt-2">Members can make their profiles public in settings.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {publicMembers.map(member => (
              <Card key={member.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="text-lg">
                        {member.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{member.full_name || 'Anonymous'}</h3>
                      {member.occupation && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {member.occupation}
                        </p>
                      )}
                      {member.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {member.location}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-sm mt-2 line-clamp-2">{member.bio}</p>
                      )}
                      {member.interests && member.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.interests.slice(0, 3).map((interest, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {member.interests.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        {member.email && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${member.email}`}>
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </a>
                          </Button>
                        )}
                        {member.phone && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${member.phone}`}>
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
