import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicResults } from '../api/polls';
import { useSocket } from '../hooks/useSocket';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function PollResults() {
  const { shareId } = useParams();
  const { isConnected, joinPollRoom, leavePollRoom, onResponseUpdate } = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [shareId]);

  useEffect(() => {
    if (!isConnected || !data || !data.poll) return;

    const handleNewResponse = (update) => {
      if (update.pollId === data.poll._id) {

        const newResults = { ...data.results };
        update.lastAnswer.forEach(ans => {
          if (!newResults[ans.questionId]) {
            newResults[ans.questionId] = {};
          }
          newResults[ans.questionId][ans.selectedOptionId] = (newResults[ans.questionId][ans.selectedOptionId] || 0) + 1;
        });

        setData(prev => ({
          ...prev,
          results: newResults,
          totalResponses: update.totalResponses
        }));
      }
    };

    joinPollRoom(data.poll._id);
    const cleanup = onResponseUpdate(handleNewResponse);

    return () => {
      cleanup();
      leavePollRoom(data.poll._id);
    };
  }, [isConnected, data?.poll?._id, joinPollRoom, leavePollRoom, onResponseUpdate]);

  const fetchData = async () => {
    try {
      const res = await getPublicResults(shareId);
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-2xl">Loading live results...</div>;
  if (!data || data.status !== 'published') return <div className="text-center py-2xl">Results are not currently public for this poll.</div>;

  return (
    <div className="max-w-[800px] mx-auto py-xl">

      <div className="text-center mb-2xl relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-primary/20 blur-[80px] -z-10 rounded-full"></div>
        <div className="inline-flex items-center gap-sm bg-surface-container-low px-md py-xs rounded-full border border-outline-variant/30 mb-lg">
          <span className="relative flex h-2 w-2">
            <span className="pulse-halo absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
          </span>
          <span className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant">Live insights active</span>
        </div>
        <h1 className="font-display-lg text-headline-xl text-on-surface mb-sm">Thanks for your vote!</h1>
        <p className="text-on-surface-variant">Here is how the rest of the world is voting on "{data.poll.title}"</p>
      </div>

      <div className="space-y-xl">
        {data.poll.questions.map((q, qIndex) => {
          const totalVotesForQ = Object.values(data.results?.[q._id] || {}).reduce((sum, v) => sum + v, 0);

          const chartData = q.options.map(opt => {
            const votes = data.results?.[q._id]?.[opt._id] || 0;
            return {
              name: opt.text,
              votes: votes,
              percentage: totalVotesForQ > 0 ? Math.round((votes / totalVotesForQ) * 100) : 0
            };
          });

          return (
            <div key={q._id} className="glass p-xl rounded-xl voxly-glow border border-primary/20">
              <h3 className="font-bold text-xl mb-lg text-on-surface">{qIndex + 1}. {q.text}</h3>

              <div className="space-y-md">
                {chartData.map((opt, i) => (
                  <div key={i} className="space-y-sm">
                    <div className="flex justify-between text-body-sm font-bold">
                      <span>{opt.name}</span>
                      <span className="text-primary">{opt.percentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'brand-gradient' : 'bg-outline'}`} 
                        style={{ width: `${opt.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-on-surface-variant text-right">{opt.votes} votes</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2xl text-center glass p-lg rounded-xl border border-outline-variant/30">
        <h3 className="font-bold text-lg mb-sm">Want to gather your own real-time insights?</h3>
        <p className="text-on-surface-variant text-sm mb-lg">Create a poll in seconds. No credit card required.</p>
        <Link to="/register" className="brand-gradient text-on-primary px-2xl py-sm rounded-full font-bold inline-block shadow-lg hover:scale-105 transition-transform">
          Create a Free Poll
        </Link>
      </div>

    </div>
  );
}
