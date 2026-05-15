import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { useCountdown } from '../../hooks/useCountdown';

const PublicPoll = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [poll, setPoll] = useState(null);
  const [status, setStatus] = useState('loading'); 
  const [answers, setAnswers] = useState({});
  const [submitErrors, setSubmitErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [totalResponses, setTotalResponses] = useState(0);

  const { isConnected, joinPollRoom, leavePollRoom, onResponseUpdate, onPollPublished, onPollExpired } = useSocket();
  const countdown = useCountdown(poll?.expiresAt);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const { data } = await api.get(`/public/poll/${shareToken}`);
        const fetchedPoll = data.poll;

        if (data.status === 'published' || fetchedPoll.isPublished) {
          navigate(`/p/${shareToken}/results`, { replace: true });
          return;
        }

        if (data.status === 'expired') {
          setStatus('expired');
          setPoll(fetchedPoll);
          return;
        }

        if (fetchedPoll.requiresAuth && !user) {
          setStatus('requires_auth');
          return;
        }

        setStatus('active');
        setPoll(fetchedPoll);
        setTotalResponses(fetchedPoll.totalResponses || 0);

      } catch (err) {
        if (err.response?.status === 404) {
          toast.error('Poll not found');
          navigate('/dashboard', { replace: true });
        } else {
          toast.error(err.response?.data?.message || 'Failed to load poll');
          setStatus('error');
        }
      }
    };

    fetchPoll();
  }, [shareToken, navigate, user]);

  useEffect(() => {
    if (status === 'active' && poll && isConnected) {
      joinPollRoom(poll._id);

      const removeResponseUpdate = onResponseUpdate((data) => {
        setTotalResponses(data.totalResponses);
      });

      const removePollPublished = onPollPublished(() => {
        toast.success("Results just published!");
        setTimeout(() => navigate(`/p/${shareToken}/results`), 2000);
      });

      const removePollExpired = onPollExpired(() => {
        toast.error("This poll has just closed");
        setStatus('expired');
      });

      return () => {
        leavePollRoom(poll._id);
        removeResponseUpdate();
        removePollPublished();
        removePollExpired();
      };
    }
  }, [status, poll, isConnected, joinPollRoom, leavePollRoom, onResponseUpdate, onPollPublished, onPollExpired, navigate, shareToken]);

  const selectOption = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setSubmitErrors(prev => prev.filter(id => id !== questionId));
  };

  const clearOption = (questionId) => {
    setAnswers(prev => { 
      const next = {...prev}; 
      delete next[questionId]; 
      return next; 
    });
  };

  const getCompletionProgress = () => {
    if (!poll) return { answered: 0, total: 0 };
    const requiredQs = poll.questions.filter(q => q.isRequired);
    const answered = requiredQs.filter(q => answers[q._id]);
    return { answered: answered.length, total: requiredQs.length };
  };

  const handleSubmit = async () => {
    const unanswered = poll.questions.filter(q => q.isRequired && !answers[q._id]);

    if (unanswered.length > 0) {
      setSubmitErrors(unanswered.map(q => q._id));
      const firstErrorElement = document.getElementById(`question-${unanswered[0]._id}`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast.error(`Please answer ${unanswered.length} required question(s)`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
          questionId, selectedOptionId
        }))
      };
      const { data } = await api.post(`/public/poll/${shareToken}/respond`, payload);
      setSubmitted(true);
      setIsPublished(data.isPublished || false);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('You have already submitted a response to this poll');
      } else if (err.response?.status === 422) {
        const missing = err.response.data.missingQuestions || [];
        setSubmitErrors(missing.map(q => q.questionId));
      } else {
        toast.error(err.response?.data?.message || 'Submission failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-2/3 mb-4"></div>
        <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-12"></div>
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-6"></div>
              <div className="space-y-3">
                <div className="h-14 bg-gray-100 rounded-lg w-full"></div>
                <div className="h-14 bg-gray-100 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'requires_auth') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 font-medium mb-8">This poll requires you to be logged in to securely record your response.</p>
          <button 
            onClick={() => navigate('/login', { state: { from: location } })}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] shadow-sm"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">This Poll Has Closed</h2>
          <p className="text-gray-500 font-medium mb-8">
            This poll expired on {new Date(poll?.expiresAt).toLocaleDateString()} at {new Date(poll?.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>

          <div className="space-y-4 flex flex-col">
            {poll?.isPublished && (
              <button 
                onClick={() => navigate(`/p/${shareToken}/results`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm"
              >
                View Results
              </button>
            )}
            <Link 
              to="/register"
              className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-all"
            >
              Create your own poll
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center animate-[popIn_0.4s_ease-out]">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 animate-[bounce_1s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Thank you! 🎉</h2>
          <p className="text-gray-500 font-medium mb-8">Your response has been securely recorded.</p>

          {isPublished ? (
            <button 
              onClick={() => navigate(`/p/${shareToken}/results`)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] shadow-md"
            >
              View Results
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-100 text-blue-700 p-5 rounded-xl mb-6 text-sm font-semibold">
              The poll creator will publish results once the poll closes.
            </div>
          )}

          <Link to="/" className="inline-block mt-4 text-gray-500 hover:text-gray-900 font-bold transition-colors">
            Back to Home
          </Link>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        `}} />
      </div>
    );
  }

  const progress = getCompletionProgress();
  const progressPercent = progress.total > 0 ? (progress.answered / progress.total) * 100 : 100;
  const isUrgent = countdown.days === 0 && countdown.hours === 0 && countdown.minutes < 60;

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      {}
      <div className="bg-white pt-10 pb-8 px-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">{poll.title}</h1>
          {poll.description && (
            <p className="text-gray-500 text-lg mb-8 whitespace-pre-wrap font-medium">{poll.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
            <div className="flex items-center text-gray-600 bg-gray-100 px-3.5 py-2 rounded-lg border border-gray-200">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
              {totalResponses} responses
            </div>

            <div className={`flex items-center px-3.5 py-2 rounded-lg border ${isUrgent ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {countdown.isExpired ? "Expired" : `Closes in ${countdown.formattedString}`}
            </div>

            {poll.isAnonymous ? (
              <div className="flex items-center text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Anonymous Poll
              </div>
            ) : user ? (
              <div className="flex items-center text-primary-700 bg-primary-50 border border-primary-100 px-3.5 py-2 rounded-lg">
                <div className="w-5 h-5 bg-primary-200 text-primary-800 rounded-full flex items-center justify-center text-xs font-black mr-2">{user.username.charAt(0).toUpperCase()}</div>
                Responding as {user.username}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-3 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-sm font-black text-gray-700 uppercase tracking-wide">
            {progress.answered} of {progress.total} required answered
          </span>
          <div className="w-1/2 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-primary-600 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {poll.questions.map((q, index) => {
          const hasError = submitErrors.includes(q._id);
          const selectedOptionId = answers[q._id];

          return (
            <div 
              key={q._id} 
              id={`question-${q._id}`}
              className={`bg-white rounded-2xl shadow-sm border p-6 sm:p-8 transition-colors ${hasError ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300'}`}
            >
              {}
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="bg-primary-100 text-primary-800 text-sm font-black px-3 py-1.5 rounded-lg shadow-sm">Q{index + 1}</span>
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{q.text}</h3>
                  <div className="mt-2">
                    {q.isRequired ? (
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">Required *</span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                    )}
                  </div>
                </div>
              </div>

              {}
              <div className="space-y-3">
                {q.options.map(opt => {
                  const isSelected = selectedOptionId === opt._id;
                  return (
                    <div 
                      key={opt._id}
                      onClick={() => selectOption(q._id, opt._id)}
                      className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm transform scale-[1.01]' : 'border-gray-100 bg-white hover:border-primary-200 hover:bg-gray-50'}`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                        {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`ml-4 text-base ${isSelected ? 'text-primary-900 font-bold' : 'text-gray-700 font-medium'}`}>
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {}
              <div className="mt-5 flex items-center justify-between min-h-[24px]">
                {hasError ? (
                  <p className="text-sm font-bold text-red-500 flex items-center bg-red-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Please select an option
                  </p>
                ) : <div></div>}

                {selectedOptionId && !q.isRequired && (
                  <button 
                    onClick={() => clearOption(q._id)}
                    className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-4 sm:p-5 z-50 transition-transform duration-300">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-500 font-semibold text-center sm:text-left flex-grow">
            By submitting, you agree your response will be collected per our <a href="#" className="underline hover:text-gray-800">terms</a>.
          </p>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (progress.answered < progress.total)}
            className="w-full sm:w-auto min-w-[240px] bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-8 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex justify-center items-center text-lg tracking-wide"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : progress.answered < progress.total ? (
              "Answer Required Questions"
            ) : (
              "Submit Response"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicPoll;
