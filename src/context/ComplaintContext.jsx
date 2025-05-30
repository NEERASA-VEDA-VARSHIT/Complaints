import { createContext, useContext, useState, useEffect } from 'react';
import { complaintsApi } from '../services/api';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export const ComplaintContext = createContext();

export function useComplaintContext() {
  return useContext(ComplaintContext);
}

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
    setupRealtimeSubscription();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintsApi.getAll();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('complaints_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'complaints' 
      }, payload => {
        handleRealtimeUpdate(payload);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleRealtimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        setComplaints(prev => [newRecord, ...prev]);
        break;
      case 'UPDATE':
        setComplaints(prev => 
          prev.map(complaint => 
            complaint.id === oldRecord.id ? newRecord : complaint
          )
        );
        break;
      case 'DELETE':
        setComplaints(prev => 
          prev.filter(complaint => complaint.id !== oldRecord.id)
        );
        break;
    }
  };

  const addComplaint = async (complaintData) => {
    try {
      const newComplaint = await complaintsApi.create(complaintData);
      return newComplaint;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateComplaint = async (id, updates) => {
    try {
      const updatedComplaint = await complaintsApi.update(id, updates);
      return updatedComplaint;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addComment = async (complaintId, comment) => {
    try {
      const newComment = await complaintsApi.addComment(complaintId, comment);
      return newComment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleUpvote = async (complaintId, userId) => {
    try {
      const isUpvoted = await complaintsApi.toggleUpvote(complaintId, userId);
      return isUpvoted;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      loading,
      error,
      addComplaint,
      updateComplaint,
      addComment,
      toggleUpvote
    }}>
      {children}
    </ComplaintContext.Provider>
  );
}