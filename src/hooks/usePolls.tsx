import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Poll {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  poll_type: string;
  is_anonymous: boolean;
  end_date: string | null;
  status: string;
  created_at: string;
  options?: PollOption[];
  total_votes?: number;
  user_voted?: boolean;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

export function usePolls() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    const { data: pollsData, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching polls:', error);
      setLoading(false);
      return;
    }

    // Fetch options for each poll
    const pollsWithOptions = await Promise.all(
      (pollsData || []).map(async (poll) => {
        const { data: options } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', poll.id);

        const { data: votes } = await supabase
          .from('poll_votes')
          .select('*')
          .eq('poll_id', poll.id);

        const userVoted = user ? votes?.some(v => v.user_id === user.id) : false;
        const totalVotes = options?.reduce((sum, opt) => sum + opt.vote_count, 0) || 0;

        return {
          ...poll,
          options: options || [],
          total_votes: totalVotes,
          user_voted: userVoted
        };
      })
    );

    setPolls(pollsWithOptions);
    setLoading(false);
  };

  const createPoll = async (poll: {
    title: string;
    description?: string;
    poll_type: string;
    is_anonymous: boolean;
    end_date?: string;
    options: string[];
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data: newPoll, error: pollError } = await supabase
      .from('polls')
      .insert({
        user_id: user.id,
        title: poll.title,
        description: poll.description,
        poll_type: poll.poll_type,
        is_anonymous: poll.is_anonymous,
        end_date: poll.end_date
      })
      .select()
      .single();

    if (pollError) return { error: pollError };

    // Insert options
    const optionsToInsert = poll.options.map(text => ({
      poll_id: newPoll.id,
      option_text: text
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);

    if (optionsError) return { error: optionsError };

    await fetchPolls();
    return { error: null, data: newPoll };
  };

  const vote = async (pollId: string, optionId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('poll_votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: user.id
      });

    if (error) return { error };

    // Update vote count manually
    const { data: option } = await supabase
      .from('poll_options')
      .select('vote_count')
      .eq('id', optionId)
      .single();

    if (option) {
      await supabase
        .from('poll_options')
        .update({ vote_count: option.vote_count + 1 })
        .eq('id', optionId);
    }

    await fetchPolls();
    return { error: null };
  };

  return { polls, loading, createPoll, vote, refetch: fetchPolls };
}
