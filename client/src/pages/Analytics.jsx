import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalytics } from '../api/polls';
import { useSocket } from '../hooks/useSocket';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Analytics() {
  const { id } = useParams();
  const { socket, isConnected, joinPollRoom, leavePollRoom, onResponseUpdate } = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!isConnected) return;

    const handleNewResponse = (update) => {
      if (update.pollId === id) {
        setData(update);
        toast.success('New response received!', { icon: '⚡' });
      }
    };

    joinPollRoom(id);
    const cleanup = onResponseUpdate(handleNewResponse);

    return () => {
      cleanup();
      leavePollRoom(id);
    };
  }, [isConnected, id, joinPollRoom, leavePollRoom, onResponseUpdate]);

  const fetchData = async () => {
    try {
      const res = await getAnalytics(id);
      setData(res.data.analytics);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-2xl">Loading real-time data...</div>;
  if (!data || !data.poll) return <div className="text-center py-2xl">No data available</div>;

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex justify-between items-end mb-xl border-b border-outline-variant/20 pb-md">
        <div>
          <span className="text-label-md font-label-md text-primary tracking-widest uppercase mb-xs block">Analytics Feed</span>
          <h1 className="font-display-lg text-headline-xl text-on-surface">{data.poll.title}</h1>
          <p className="text-on-surface-variant text-sm mt-xs">Created {data.poll.createdAt ? formatDistanceToNow(new Date(data.poll.createdAt)) : 'recently'} ago</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-display-lg text-primary">{data.totalResponses}</div>
          <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total Votes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {data.questions.map((q, qIndex) => {

          const chartData = q.options.map(opt => ({
            name: opt.optionText,
            votes: opt.count,
            percentage: data.totalResponses > 0 
              ? Math.round((opt.count / data.totalResponses) * 100) 
              : 0
          }));

          return (
            <div key={q.id} className="glass p-lg rounded-xl voxly-glow border border-outline-variant/30 relative group">
              <h3 className="font-bold text-lg mb-md text-on-surface line-clamp-2">Q{qIndex + 1}: {q.text}</h3>

              <div className="h-[250px] mt-lg w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#cbc4d2', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(207, 188, 255, 0.05)' }}
                      contentStyle={{ backgroundColor: '#1d1b20', borderColor: '#494551', borderRadius: '1rem', color: '#e6e0e9' }}
                    />
                    <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#cfbcff' : index === 1 ? '#e7c365' : '#6750a4'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {}
              <div className="mt-md space-y-sm pt-md border-t border-outline-variant/10">
                {chartData.map((opt, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="truncate pr-4 w-2/3 text-on-surface-variant">{opt.name}</span>
                    <div className="flex items-center gap-sm w-1/3 justify-end">
                      <span className="font-bold text-primary">{opt.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
