import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useStudioSync() {
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudioData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // High-Fidelity Individual Fetch Pulse
      const [profileRes, briefsRes, videosRes] = await Promise.all([
        api.get('/partner/profile').catch(e => { console.warn('Partner profile fetch pulse failure:', e); return null; }),
        api.get('/partner/briefs').catch(e => { console.warn('Partner briefs fetch pulse failure:', e); return []; }),
        api.get('/videos/user').catch(e => { console.warn('User videos fetch pulse failure:', e); return []; }),
      ]);

      setPartnerProfile(profileRes);
      setBriefs(briefsRes || []);
      setVideos(videosRes || []);
    } catch (err: any) {
      console.error('CRITICAL: Studio sync pulse failed:', err);
      setError('Studio sector unreachable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudioData();
  }, [fetchStudioData]);

  const refresh = () => fetchStudioData();

  return {
    partnerProfile,
    briefs,
    videos,
    loading,
    error,
    refresh
  };
}
