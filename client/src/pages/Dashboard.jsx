import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPolls, deletePoll } from '../api/polls';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const { data } = await listPolls();
      setPolls(data.polls || []);
    } catch (err) {
      toast.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;
    try {
      await deletePoll(id);
      setPolls(polls.filter(p => p._id !== id));
      toast.success('Poll deleted');
    } catch (err) {
      toast.error('Failed to delete poll');
    }
  };

  if (loading) return <div className="text-center py-2xl">Loading your insights...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-2xl">
        <div>
          <h1 className="font-display-lg text-headline-xl text-on-surface mb-sm">Your Pulse Feed</h1>
          <p className="text-on-surface-variant">Manage your polls and view real-time data.</p>
        </div>
        <Link to="/create" className="brand-gradient text-on-primary px-lg py-sm rounded-full font-bold shadow-lg flex items-center gap-xs">
          <span className="material-symbols-outlined text-sm">add</span> New Poll
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="glass rounded-xl p-2xl text-center border border-outline-variant/20">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-lg">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">inbox</span>
          </div>
          <h3 className="font-headline-md text-headline-md mb-xs">No polls yet</h3>
          <p className="text-on-surface-variant mb-lg">Create your first poll to start gathering insights.</p>
          <Link to="/create" className="border border-primary text-primary px-lg py-sm rounded-full font-bold hover:bg-primary/10 transition-colors inline-block">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {polls.map(poll => {
            const isClosed = new Date(poll.expiresAt) < new Date();
            const status = isClosed ? 'CLOSED' : (poll.isPublished ? 'PUBLISHED' : 'DRAFT');

            return (
            <div key={poll._id} className="glass rounded-lg p-lg relative overflow-hidden group hover:border-primary/50 transition-colors voxly-glow border border-outline-variant/30 flex flex-col justify-between min-h-[240px]">

              <div className="flex justify-between items-start mb-lg">
                <div className="flex flex-col">
                  {status === 'PUBLISHED' ? (
                    <div className="px-sm py-1 bg-error-container/20 text-error rounded-full text-xs font-bold flex items-center gap-1 w-max mb-sm border border-error/20">
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>fiber_manual_record</span> LIVE
                    </div>
                  ) : status === 'CLOSED' ? (
                    <div className="px-sm py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-bold w-max mb-sm">
                      CLOSED
                    </div>
                  ) : (
                    <div className="px-sm py-1 bg-tertiary-container/20 text-tertiary rounded-full text-xs font-bold w-max mb-sm border border-tertiary/20">
                      DRAFT
                    </div>
                  )}
                  <h3 className="font-bold text-lg line-clamp-2">{poll.title}</h3>
                </div>

                <button onClick={() => handleDelete(poll._id)} className="text-on-surface-variant hover:text-error transition-colors p-1 bg-surface-container-high rounded-full opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between text-xs text-on-surface-variant mb-md">
                  <span>{poll.questions ? poll.questions.length : 1} questions</span>
                  <span>{poll.totalResponses || 0} responses</span>
                </div>

                <div className="flex gap-sm">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/poll/${poll.shareToken}`);
                      toast.success('Link copied to clipboard!');
                    }}
                    className="flex-1 bg-surface-container-high hover:bg-surface-variant border border-outline-variant/30 py-sm rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-sm">link</span> Copy Link
                  </button>
                  <Link 
                    to={`/polls/${poll._id}/analytics`} 
                    className="flex-1 brand-gradient text-on-primary py-sm rounded-lg text-sm font-bold text-center flex items-center justify-center gap-xs hover:scale-[1.02] transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">analytics</span> Analytics
                  </Link>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
