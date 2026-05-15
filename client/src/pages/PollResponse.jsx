import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicPoll, submitResponse } from '../api/polls';
import { useSocket } from '../hooks/useSocket';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function PollResponse() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { isConnected, onPollExpired } = useSocket();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({}); 

  useEffect(() => {
    fetchPoll();
  }, [shareId]);

  useEffect(() => {
    if (!isConnected || !poll) return;

    const handlePollExpired = (data) => {
      if (data.pollId === poll._id) {
        toast.error('This poll has just closed!');
        navigate(`/results/${shareId}`);
      }
    };

    const cleanup = onPollExpired(handlePollExpired);
    return () => cleanup();
  }, [isConnected, poll, shareId, navigate, onPollExpired]);

  const fetchPoll = async () => {
    try {
      const { data } = await getPublicPoll(shareId);
      if (data.status === 'expired' || data.status === 'published') {
        toast('This poll is closed or published');
        navigate(`/results/${shareId}`);
        return;
      }
      setPoll(data.poll);
    } catch (err) {
      toast.error('Poll not found or inactive');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optId) => {
    setAnswers({ ...answers, [qId]: optId });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== poll.questions.length) {
      return toast.error('Please answer all questions');
    }

    setSubmitting(true);
    try {
      let anonToken = localStorage.getItem('anonToken');
      if (!anonToken) {
        anonToken = crypto.randomUUID();
        localStorage.setItem('anonToken', anonToken);
      }

      await submitResponse(shareId, {
        anonToken,
        answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({ questionId, selectedOptionId }))
      });

      toast.success('Vote recorded!');
      navigate(`/results/${shareId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit response');
      if (err.response?.status === 403) {
        navigate(`/results/${shareId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-2xl">Loading poll...</div>;
  if (!poll) return null;

  return (
    <div className="max-w-[720px] mx-auto py-2xl">
      <div className="glass rounded-xl p-2xl voxly-glow border border-primary/20 relative overflow-hidden">

        {}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10 animate-pulse"></div>

        <div className="text-center mb-xl">
          <span className="text-label-md font-label-md text-primary tracking-widest uppercase mb-sm block">Live Poll</span>
          <h2 className="font-headline-xl text-headline-xl">{poll.title}</h2>
          <p className="text-sm text-on-surface-variant mt-sm">Select your answers below. Results are updated in real-time globally.</p>
        </div>

        <div className="space-y-xl">
          {poll.questions.map((q, qIndex) => (
            <div key={q._id}>
              <h3 className="font-bold text-lg mb-md text-on-surface">{qIndex + 1}. {q.text}</h3>
              <div className="space-y-sm">
                {q.options.map(opt => {
                  const isSelected = answers[q._id] === opt._id;
                  return (
                    <button 
                      key={opt._id}
                      onClick={() => handleSelectOption(q._id, opt._id)}
                      className={`w-full text-left p-lg rounded-lg border transition-all flex justify-between items-center group
                        ${isSelected 
                          ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(207,188,255,0.2)]' 
                          : 'bg-surface-container-high border-outline-variant/30 hover:border-primary/50'
                        }`}
                    >
                      <span className={`font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{opt.text}</span>
                      <div className="flex items-center gap-md">
                        <span className={`material-symbols-outlined transition-transform ${isSelected ? 'text-primary scale-110' : 'text-outline-variant group-hover:text-primary/50'}`}>
                          {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-xl text-center pt-lg border-t border-outline-variant/20">
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || Object.keys(answers).length !== poll.questions.length}
            className="w-full md:w-auto px-2xl py-md text-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Vote'}
            <span className="material-symbols-outlined text-sm">send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
