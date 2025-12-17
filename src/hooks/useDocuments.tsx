import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Document {
  id: string;
  organization_id: string | null;
  uploaded_by: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchDocuments = async (category?: string) => {
    setLoading(true);
    let query = supabase.from('documents').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    setLoading(false);
    if (error) throw error;
    return data as Document[];
  };

  const uploadDocument = async (
    file: File,
    metadata: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'uploaded_by' | 'file_url' | 'file_size'>
  ) => {
    if (!user) throw new Error('Must be logged in');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('documents')
      .insert({
        ...metadata,
        uploaded_by: user.id,
        file_url: publicUrl,
        file_size: file.size,
        file_type: fileExt,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Document;
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  };

  return {
    loading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
  };
}
