import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../api/axios';

const PollResults = () => {
  const { shareToken } = useParams();
  const [poll, setPoll] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get(`/public/poll/${shareToken}/results`);
        if (data.status !== 'published') {
          setStatus('unpublished');
        } else {
          setPoll(data.poll);
          setAnalytics(data.analytics);
          setStatus('published');
        }
      } catch (err) {
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (status === 'error') {
    return <div className="text-center p-10 text-red-500 font-bold text-xl flex justify-center items-center min-h-[60vh]">Results not found.</div>;
  }

  if (status === 'unpublished') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Results Not Available</h2>
          <p className="text-gray-500 font-semibold mb-8">
            The creator of this poll has not published the results yet. Check back later!
          </p>
          <Link to="/" className="w-full block bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98]">
            Go to PollFlow Home
          </Link>
        </div>
      </div>
    );
  }

  const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#f43f5e', '#8b5cf6', '#14b8a6'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl text-sm z-50">
          <p className="font-bold text-gray-800">{payload[0].name}</p>
          <p className="text-primary-600 font-black mt-1 text-lg">{payload[0].value} votes</p>
          <p className="text-gray-500 font-bold">{payload[0].payload.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; 

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="13" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white pt-20 pb-24 px-4 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iI2ZmZiI+PC9jaXJjbGU+Cjwvc3ZnPg==')]"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-white/20 shadow-sm">
            Final Results
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tight leading-tight">{poll.title}</h1>
          {poll.description && (
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">{poll.description}</p>
          )}

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-bold flex items-center border border-white/10 shadow-inner">
              <span className="mr-2 text-lg">📊</span> {analytics.totalResponses} Responses
            </span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-bold flex items-center border border-white/10 shadow-inner">
              <span className="mr-2 text-lg">📅</span> Closed {new Date(poll.expiresAt).toLocaleDateString()}
            </span>
            <span className="bg-green-500/20 text-green-300 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-bold flex items-center border border-green-500/30 shadow-inner">
              <span className="mr-2 text-lg">✅</span> Published Official
            </span>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-white/5 inline-flex p-2 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-sm font-bold text-indigo-200 ml-3">Share these results:</span>
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out the final results for "${poll.title}"!&url=${window.location.origin}/p/${shareToken}/results`, '_blank')}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-[#1DA1F2] transition-colors flex items-center justify-center group"
            >
              <svg className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
              }}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center group"
            >
              <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 space-y-8">
        {analytics.questions.map((q, index) => {
          const winner = [...q.options].sort((a,b) => b.count - a.count)[0];
          const hasResponses = q.totalAnswered > 0;

          const chartData = q.options.filter(o => o.count > 0).map(o => ({
            name: o.text,
            value: o.count,
            percentage: o.percentage
          }));

          return (
            <div key={q.questionId} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 sm:p-10 border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-start mb-2">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-black px-3.5 py-1.5 rounded-xl mr-5 mt-0.5 shadow-sm">Q{index + 1}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight">{q.questionText}</h2>
                    <div className="flex items-center mt-4 space-x-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-200/60 px-2.5 py-1 rounded-md">
                        {poll.questions.find(pq=>pq._id === q.questionId)?.isRequired ? 'Required' : 'Optional'}
                      </span>
                      <span className="text-sm font-black text-gray-300">•</span>
                      <span className="text-sm font-bold text-gray-500">{q.totalAnswered} responses recorded</span>
                    </div>
                  </div>
                </div>
              </div>

              {hasResponses ? (
                <div className="p-8 sm:p-10">
                  {}
                  {winner && winner.count > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60 rounded-3xl p-6 flex items-center mb-10 shadow-sm">
                      <div className="text-4xl mr-5 bg-white p-4 rounded-2xl shadow-sm border border-amber-100">🏆</div>
                      <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1.5">Most Popular Choice</p>
                        <p className="text-xl font-black text-gray-900 leading-tight">{winner.text}</p>
                        <p className="text-sm font-bold text-amber-700 mt-1">{winner.count} votes ({winner.percentage}%)</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row gap-10 items-center">
                    {}
                    <div className="w-full lg:w-1/2 h-[320px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={120}
                            paddingAngle={3}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            stroke="none"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <p className="text-3xl font-black text-gray-900">{q.totalAnswered}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Votes</p>
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="w-full lg:w-1/2 space-y-5">
                      {q.options.sort((a,b) => b.count - a.count).map((opt, i) => (
                        <div key={opt.optionId} className="group relative">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-gray-800 flex items-center">
                              {i === 0 && <span className="mr-2 text-lg">🥇</span>}
                              {i === 1 && <span className="mr-2 text-lg">🥈</span>}
                              {i === 2 && <span className="mr-2 text-lg">🥉</span>}
                              {i > 2 && <span className="mr-2 text-gray-400 font-black text-xs">#{i+1}</span>}
                              {opt.text}
                            </span>
                            <span className="font-black text-gray-900">{opt.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out relative" 
                              style={{ 
                                width: `${opt.percentage}%`,
                                backgroundColor: COLORS[i % COLORS.length]
                              }}
                            >
                              <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/20 to-transparent"></div>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-gray-400 mt-2 text-right">{opt.count} votes</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="text-4xl mb-4">👻</div>
                  <p className="text-gray-500 font-bold text-lg">No responses for this question yet.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {}
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <div className="inline-block p-10 bg-white rounded-[2rem] shadow-lg border border-gray-100">
          <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Create your own polls for free</h3>
          <p className="text-gray-500 font-semibold mb-8 max-w-sm mx-auto">Gather feedback, vote on ideas, and make data-driven decisions instantly.</p>
          <Link to="/register" className="inline-flex bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-md active:scale-[0.98]">
            Get Started with PollFlow
          </Link>
        </div>
        <p className="mt-10 text-xs font-black text-gray-400 uppercase tracking-widest">Powered by PollFlow © 2026</p>
      </div>
    </div>
  );
};

export default PollResults;
