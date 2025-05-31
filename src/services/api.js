import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  const message = error.message || error.error_description || 'An unexpected error occurred';
  toast.error(message);
  throw error;
};

// Complaints API
export const complaintsApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, comments(*), upvotes(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async create(complaintData) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert([{
          ...complaintData,
          status: 'OPEN',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Complaint submitted successfully');
      return data;
    } catch (error) {
      toast.error('Failed to submit complaint');
      handleSupabaseError(error);
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Complaint updated successfully');
      return data;
    } catch (error) {
      toast.error('Failed to update complaint');
      handleSupabaseError(error);
    }
  },

  async addComment(complaintId, comment) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          complaint_id: complaintId,
          content: comment.text,
          author: comment.author,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Comment added successfully');
      return data;
    } catch (error) {
      toast.error('Failed to add comment');
      handleSupabaseError(error);
    }
  },

  async toggleUpvote(complaintId, userId) {
    try {
      const { data: existingUpvote, error: checkError } = await supabase
        .from('upvotes')
        .select()
        .eq('complaint_id', complaintId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingUpvote) {
        const { error: deleteError } = await supabase
          .from('upvotes')
          .delete()
          .eq('id', existingUpvote.id);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from('upvotes')
          .insert([{
            complaint_id: complaintId,
            user_id: userId
          }]);

        if (insertError) throw insertError;
      }

      return !existingUpvote;
    } catch (error) {
      toast.error('Failed to update upvote');
      handleSupabaseError(error);
    }
  }
};