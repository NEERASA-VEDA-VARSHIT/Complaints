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
      // Transform anonymous to is_anonymous to match the database schema
      const { anonymous, ...rest } = complaintData;
      const { data, error } = await supabase
        .from('complaints')
        .insert([{
          ...rest,
          is_anonymous: anonymous, // Use the correct column name
          status: 'open', // Match the enum value in the schema
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
      // Transform anonymous to is_anonymous if it exists in updates
      const { anonymous, ...rest } = updates;
      const updateData = anonymous !== undefined
        ? { ...rest, is_anonymous: anonymous }
        : rest;

      const { data, error } = await supabase
        .from('complaints')
        .update(updateData)
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
          user_id: comment.author, // Match the schema's user_id field
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