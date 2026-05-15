import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [sortBy, setSortBy] = useState('newest'); 
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchPolls = async () => {
    try {
      const { data } = await api.get('/polls/my-polls');
      setPolls(data.polls || []);
    } catch (err) {
      toast.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleDelete = async (pollId) => {
    setIsDeleting(true);
    try {
      await api.delete(`/polls/${pollId}`);
      setPolls(prev => prev.filter(p => p._id !== pollId));
      toast.success('Poll deleted successfully');
      setDeleteConfirm(null);
      setDeleteInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete poll');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyLink = (shareToken) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${shareToken}`);
    toast.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const now = new Date();
  const getStatus = (p) => {
    if (p.isPublished) return 'published';
    if (new Date(p.expiresAt) <= now) return 'expired';
    return 'active';
  };

  let filtered = polls.filter(p => {
    if (filter === 'all') return true;
    const status = getStatus(p);
    return status === filter;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'most_responses') return (b.totalResponses || 0) - (a.totalResponses || 0);
    return 0;
  });

  const activeCount = polls.filter(p => getStatus(p) === 'active').length;
  const expiredCount = polls.filter(p => getStatus(p) === 'expired').length;
  const publishedCount = polls.filter(p => getStatus(p) === 'published').length;
  const totalResponsesSum = polls.reduce((sum, p) => sum + (p.totalResponses || 0), 0);

  const getDistanceToNow = (dateStr) => {
    const diff = Math.abs(now - new Date(dateStr));
    const d = Math.floor(diff / (1000*60*60*24));
    if (d > 0) return `${d} day${d>1?'s':''}`;
    const h = Math.floor(diff / (1000*60*60));
    if (h > 0) return `${h} hour${h>1?'s':''}`;
    return 'less than an hour';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">

      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Polls</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track your polls</p>
        </div>
        <Link 
          to="/polls/create"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center whitespace-nowrap"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create New Poll
        </Link>
      </div>

      {}
      {polls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Total Polls</span>
            <span className="text-3xl font-black text-gray-900 mt-1">{polls.length}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Active</span>
            <span className="text-3xl font-black text-green-600 mt-1">{activeCount}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Total Responses</span>
            <span className="text-3xl font-black text-primary-600 mt-1">{totalResponsesSum}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Published</span>
            <span className="text-3xl font-black text-amber-500 mt-1">{publishedCount}</span>
          </div>
        </div>
      )}

      {}
      {polls.length > 0 && (
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All', count: polls.length },
              { id: 'active', label: 'Active', count: activeCount },
              { id: 'expired', label: 'Expired', count: expiredCount },
              { id: 'published', label: 'Published', count: publishedCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center ${filter === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${filter === tab.id ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-2 lg:px-0">
            <span className="text-sm text-gray-500 font-bold">Showing {filtered.length} of {polls.length}</span>
            <div className="h-4 w-px bg-gray-300"></div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-none bg-transparent text-sm font-black text-gray-700 focus:ring-0 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_responses">Most Responses</option>
            </select>
          </div>
        </div>
      )}

      {}
      {polls.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-2xl mx-auto mt-12 animate-[popIn_0.3s_ease-out]">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">No polls yet</h2>
          <p className="text-gray-500 font-semibold mb-8">Create your first poll to start collecting feedback instantly.</p>
          <Link 
            to="/polls/create"
            className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-black py-3.5 px-8 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Create your first poll
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-bold text-lg">No polls match the current filter.</p>
        </div>
      ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(poll => {
            const status = getStatus(poll);
            const statusColor = status === 'active' ? 'bg-green-500' : status === 'published' ? 'bg-amber-500' : 'bg-red-500';
            const statusBadgeColor = status === 'active' ? 'bg-green-100 text-green-700' : status === 'published' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

            return (
              <div key={poll._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group">
                <div className={`h-2 w-full ${statusColor}`}></div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${statusBadgeColor}`}>
                      {status}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                    {poll.title}
                  </h3>

                  {poll.description && (
                    <p className="text-sm text-gray-500 line-clamp-1 mb-5 font-medium">{poll.description}</p>
                  )}

                  <div className="mt-auto space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-700 font-bold">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                        {poll.totalResponses || 0} responses
                      </div>
                      <div className="flex items-center text-gray-700 font-bold">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        {poll.questions?.length || 0} qs
                      </div>
                    </div>

                    <div className="text-xs font-bold text-gray-500 bg-gray-50 p-2.5 rounded-lg text-center">
                      {status === 'active' ? `Closes in ${getDistanceToNow(poll.expiresAt)}` :
                       status === 'published' ? `Published ${getDistanceToNow(poll.publishedAt || poll.updatedAt)} ago` :
                       `Closed ${getDistanceToNow(poll.expiresAt)} ago`}
                    </div>
                  </div>
                </div>

                {}
                <div className="border-t border-gray-100 p-3 bg-gray-50/50 flex items-center justify-between gap-2">
                  <button 
                    onClick={() => navigate(`/analytics/${poll._id}`)}
                    className="flex-1 bg-white border border-primary-200 hover:border-primary-300 hover:bg-primary-50 text-primary-700 font-black py-2.5 px-2 rounded-xl text-xs transition-colors flex items-center justify-center shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Analytics
                  </button>
                  <button 
                    onClick={() => copyLink(poll.shareToken)}
                    className="flex-1 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-2 rounded-xl text-xs transition-colors flex items-center justify-center shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Copy Link
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(poll)}
                    className="p-2.5 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-xl transition-colors shadow-sm"
                    title="Delete Poll"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[popIn_0.2s_ease-out]">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-5">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">Delete Poll?</h3>
            <p className="text-gray-500 text-sm mb-6 font-semibold text-center">
              This will permanently delete the poll <span className="font-bold text-gray-900">"{deleteConfirm.title}"</span> and all <span className="text-red-600 font-black">{deleteConfirm.totalResponses}</span> responses. This cannot be undone.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Type <span className="bg-gray-100 px-1 py-0.5 rounded text-red-600 select-all font-mono">{deleteConfirm.title}</span> to confirm:
              </label>
              <input 
                type="text" 
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-bold shadow-inner"
                placeholder="Type poll title here"
              />
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeleteInput('');
                }}
                className="w-1/2 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={isDeleting || deleteInput !== deleteConfirm.title}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 px-4 rounded-xl transition-transform active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
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

export default Dashboard;
