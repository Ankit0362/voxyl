import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useSocket } from '../../hooks/useSocket';
import { useCountdown } from '../../hooks/useCountdown';
import BarChartQuestion from '../../components/charts/BarChartQuestion';
import TrendLineChart from '../../components/charts/TrendLineChart';

const PollAnalytics = () => {
  const { pollId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [liveUpdateFlash, setLiveUpdateFlash] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { isConnected, joinPollRoom, leavePollRoom, onResponseUpdate } = useSocket();
  const countdown = useCountdown(poll?.expiresAt);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get(`/analytics/${pollId}/summary`);
      setPoll(data.poll);
      setAnalytics(data.analytics);
      setLastUpdated(new Date());
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [pollId]);

  useEffect(() => {
    if (!loading && pollId && isConnected) {
      joinPollRoom(pollId);

      const removeResponseUpdate = onResponseUpdate((update) => {
        setLiveUpdateFlash(true);
        setTimeout(() => setLiveUpdateFlash(false), 2000);
        setLastUpdated(new Date());

        setAnalytics(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            totalResponses: update.totalResponses,
            questions: prev.questions.map(q => {
              const qUpdate = update.questionUpdates?.find(u => u.questionId === q.questionId);
              if (!qUpdate) return q;
              return {
                ...q,
                totalAnswered: q.totalAnswered + 1, 
                options: q.options.map(o =>
                  o.optionId === qUpdate.optionId
                    ? { ...o, count: qUpdate.newCount, percentage: qUpdate.newPercentage }
                    : { ...o, percentage: o.count > 0 ? ((o.count / update.totalResponses) * 100).toFixed(1) : 0 }
                ).sort((a,b) => b.count - a.count)
              };
            })
          };
        });
      });

      return () => {
        leavePollRoom(pollId);
        removeResponseUpdate();
      };
    }
  }, [loading, pollId, isConnected, joinPollRoom, leavePollRoom, onResponseUpdate]);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await api.post(`/polls/${pollId}/publish`);
      toast.success('Results published! Anyone with the link can now view them.');
      setPoll(prev => ({ ...prev, isPublished: true }));
      setShowPublishConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish');
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!poll || !analytics) {
    return <div className="p-8 text-center text-red-500 font-bold">Analytics not found or access denied</div>;
  }

  const isExpired = new Date(poll.expiresAt) <= new Date();
  const getMinutesAgo = (date) => Math.floor((new Date() - new Date(date)) / 60000);
  const minutesAgoStr = getMinutesAgo(lastUpdated) === 0 ? 'Just now' : `${getMinutesAgo(lastUpdated)}m`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {}
      <div className="mb-8">
        <Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-primary-600 flex items-center mb-4 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to My Polls
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{poll.title}</h1>
            <div className="flex items-center space-x-3 mt-3">
              {poll.isPublished ? (
                <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">Published</span>
              ) : isExpired ? (
                <span className="bg-red-100 text-red-800 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">Expired</span>
              ) : (
                <span className="bg-green-100 text-green-800 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">Active</span>
              )}
              <span className="text-sm text-gray-500 font-semibold">Created {new Date(poll.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/p/${poll.shareToken}`);
                toast.success('Link copied!');
              }}
              className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-xl flex items-center transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              Copy Link
            </button>
            <button 
              onClick={fetchAnalytics}
              className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 text-gray-700 font-bold p-2.5 rounded-xl transition-colors"
              title="Refresh Analytics"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>

            {!poll.isPublished && analytics.totalResponses > 0 && (
              <button 
                onClick={() => setShowPublishConfirm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 px-5 rounded-xl shadow-md transition-transform active:scale-[0.98] text-sm"
              >
                Publish Results
              </button>
            )}
          </div>
        </div>
      </div>

      {}
      <div className={`bg-gray-900 text-white rounded-xl shadow-lg px-6 py-3.5 mb-8 flex items-center justify-between transition-colors duration-500 ${liveUpdateFlash ? 'bg-indigo-900 ring-4 ring-indigo-500/30' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="relative flex h-3 w-3">
            {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          </div>
          <span className="text-sm font-black tracking-widest">{isConnected ? 'LIVE UPDATES' : 'OFFLINE'}</span>
        </div>
        <div className="text-sm text-gray-300 font-semibold hidden sm:block">
          Last updated: {minutesAgoStr}
        </div>
        <div className="flex items-center text-sm font-bold text-gray-300">
          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
          Listening...
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Total Responses</span>
          <div className="flex items-end space-x-2 mt-auto">
            <span className="text-5xl font-black text-gray-900 tracking-tighter">{analytics.totalResponses}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Completion Rate</span>
          <div className="flex flex-col mt-auto">
            <span className="text-5xl font-black text-gray-900 tracking-tighter">{analytics.completionRate}%</span>
            <span className="text-xs font-bold text-gray-400 mt-1">Answered all questions</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Poll Status</span>
          <div className="flex flex-col mt-auto">
            <span className={`text-2xl font-black tracking-tight ${isExpired ? 'text-red-600' : 'text-primary-600'}`}>
              {isExpired ? 'Closed' : countdown.formattedString || 'Active'}
            </span>
            <span className="text-xs font-bold text-gray-400 mt-1">{isExpired ? 'No longer accepting responses' : 'Remaining to vote'}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Questions</span>
          <div className="flex flex-col mt-auto">
            <span className="text-5xl font-black text-gray-900 tracking-tighter">{poll.questions.length}</span>
            <span className="text-xs font-bold text-gray-400 mt-1">
              {poll.questions.filter(q=>q.isRequired).length} required, {poll.questions.filter(q=>!q.isRequired).length} optional
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center tracking-tight">
          <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          Response Trend
        </h2>
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <TrendLineChart participationByDate={analytics.participationByDate} />
        </div>
      </div>

      {}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center tracking-tight">
          <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Question Breakdown
        </h2>
        <div className="space-y-8">
          {analytics.questions.map((q, i) => (
            <div key={q.questionId} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-tight">
                    <span className="text-primary-600 mr-2 font-black">Q{i+1}:</span> 
                    {q.questionText}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${poll.questions.find(pq=>pq._id === q.questionId)?.isRequired ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                      {poll.questions.find(pq=>pq._id === q.questionId)?.isRequired ? 'Required' : 'Optional'}
                    </span>
                    <span className="text-gray-500 font-bold">{q.totalAnswered} answered</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <BarChartQuestion question={q} />

                <div className="mt-8">
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 bg-gray-50 uppercase font-black tracking-wider">
                        <tr>
                          <th className="px-5 py-4">Rank</th>
                          <th className="px-5 py-4">Option</th>
                          <th className="px-5 py-4 text-right">Votes</th>
                          <th className="px-5 py-4 text-right">Share</th>
                          <th className="px-5 py-4 w-1/3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {q.options.sort((a,b) => b.count - a.count).map((opt, rankIndex) => {
                          const medals = ['🥇', '🥈', '🥉'];
                          const rankDisplay = rankIndex < 3 ? medals[rankIndex] : `#${rankIndex + 1}`;
                          return (
                            <tr key={opt.optionId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-3.5 font-bold text-gray-900 text-base">{rankDisplay}</td>
                              <td className="px-5 py-3.5 font-bold text-gray-800">{opt.text}</td>
                              <td className="px-5 py-3.5 text-right font-black text-gray-900 text-base">{opt.count}</td>
                              <td className="px-5 py-3.5 text-right font-black text-primary-600 text-base">{opt.percentage}%</td>
                              <td className="px-5 py-3.5">
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${opt.percentage}%` }}></div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-[popIn_0.2s_ease-out]">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-50 mb-5">
              <svg className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Publish Results?</h3>
            <p className="text-gray-500 text-sm mb-6 font-semibold">
              Once published, anyone with the poll link can view the final results. This action cannot be undone.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
              <p className="text-sm font-black text-gray-700">Total Responses Captured: <span className="text-amber-600 text-lg ml-1">{analytics.totalResponses}</span></p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowPublishConfirm(false)}
                className="w-1/2 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-colors"
                disabled={isPublishing}
              >
                Cancel
              </button>
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 px-4 rounded-xl transition-transform active:scale-[0.98] shadow-md disabled:opacity-50 flex justify-center items-center"
              >
                {isPublishing ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : "Publish Now"}
              </button>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
          `}} />
        </div>
      )}

    </div>
  );
};

export default PollAnalytics;
