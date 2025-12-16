import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Vote, BarChart3, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePolls } from '@/hooks/usePolls';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Polls() {
  const navigate = useNavigate();
  const { polls, loading, createPoll, vote } = usePolls();
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    poll_type: 'single',
    is_anonymous: false,
    end_date: '',
    options: ['', '']
  });

  const handleCreatePoll = async () => {
    if (!newPoll.title.trim()) {
      toast.error('Please enter a poll title');
      return;
    }
    const validOptions = newPoll.options.filter(o => o.trim());
    if (validOptions.length < 2) {
      toast.error('Please add at least 2 options');
      return;
    }

    const { error } = await createPoll({
      ...newPoll,
      options: validOptions
    });

    if (error) {
      toast.error('Failed to create poll');
    } else {
      toast.success('Poll created successfully');
      setCreateOpen(false);
      setNewPoll({ title: '', description: '', poll_type: 'single', is_anonymous: false, end_date: '', options: ['', ''] });
    }
  };

  const handleVote = async (pollId: string) => {
    const optionId = selectedOptions[pollId];
    if (!optionId) {
      toast.error('Please select an option');
      return;
    }

    const { error } = await vote(pollId, optionId);
    if (error) {
      toast.error('Failed to submit vote');
    } else {
      toast.success('Vote submitted!');
    }
  };

  const addOption = () => {
    setNewPoll(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const updateOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((o, i) => i === index ? value : o)
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Polls & Surveys</h1>
          </div>
          {user && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Poll</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Question/Title</Label>
                    <Input 
                      value={newPoll.title}
                      onChange={e => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What would you like to ask?"
                    />
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Textarea 
                      value={newPoll.description}
                      onChange={e => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add more context..."
                    />
                  </div>
                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2 mt-2">
                      {newPoll.options.map((option, index) => (
                        <Input 
                          key={index}
                          value={option}
                          onChange={e => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                      <Button variant="outline" size="sm" onClick={addOption}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Anonymous voting</Label>
                    <Switch 
                      checked={newPoll.is_anonymous}
                      onCheckedChange={checked => setNewPoll(prev => ({ ...prev, is_anonymous: checked }))}
                    />
                  </div>
                  <div>
                    <Label>End Date (optional)</Label>
                    <Input 
                      type="datetime-local"
                      value={newPoll.end_date}
                      onChange={e => setNewPoll(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleCreatePoll} className="w-full">
                    Create Poll
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      <main className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading polls...</div>
        ) : polls.length === 0 ? (
          <Card className="text-center py-12">
            <Vote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No polls yet. Be the first to create one!</p>
          </Card>
        ) : (
          polls.map(poll => (
            <Card key={poll.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{poll.title}</CardTitle>
                    {poll.description && (
                      <p className="text-sm text-muted-foreground mt-1">{poll.description}</p>
                    )}
                  </div>
                  <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                    {poll.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {poll.total_votes} votes
                  </span>
                  {poll.end_date && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Ends {format(new Date(poll.end_date), 'MMM d')}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {poll.user_voted ? (
                  <div className="space-y-3">
                    {poll.options?.map(option => {
                      const percentage = poll.total_votes ? Math.round((option.vote_count / poll.total_votes) * 100) : 0;
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{option.option_text}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">{option.vote_count} votes</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <RadioGroup 
                      value={selectedOptions[poll.id] || ''}
                      onValueChange={value => setSelectedOptions(prev => ({ ...prev, [poll.id]: value }))}
                    >
                      {poll.options?.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="cursor-pointer">{option.option_text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {user ? (
                      <Button onClick={() => handleVote(poll.id)} className="w-full">
                        Submit Vote
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center">Sign in to vote</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
