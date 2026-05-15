import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../api/polls';
import { validatePoll } from '../utils/validation';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: [{ text: '' }, { text: '' }] }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: [{ text: '' }, { text: '' }] }]);
  };

  const updateQuestion = (qIndex, text) => {
    const newQ = [...questions];
    newQ[qIndex].text = text;
    setQuestions(newQ);
  };

  const removeQuestion = (qIndex) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const addOption = (qIndex) => {
    const newQ = [...questions];
    newQ[qIndex].options.push({ text: '' });
    setQuestions(newQ);
  };

  const updateOption = (qIndex, oIndex, text) => {
    const newQ = [...questions];
    newQ[qIndex].options[oIndex].text = text;
    setQuestions(newQ);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQ = [...questions];
    if (newQ[qIndex].options.length <= 2) return;
    newQ[qIndex].options = newQ[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(newQ);
  };

  const [expiresInHours, setExpiresInHours] = useState(168);
  const [requiresAuth, setRequiresAuth] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePoll(title, questions);
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
      await createPoll({ 
        title, 
        questions, 
        expiresAt, 
        requiresAuth,
        isAnonymous: !requiresAuth 
      });
      toast.success('Poll created successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="text-center mb-2xl">
        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center mx-auto mb-lg">
          <span className="material-symbols-outlined text-3xl">edit_note</span>
        </div>
        <h1 className="font-display-lg text-headline-xl text-on-surface mb-sm">Design & Deploy</h1>
        <p className="text-on-surface-variant">Craft your poll and gather real-time intelligence.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-xl">
        <div className="glass p-lg rounded-xl voxly-glow border border-primary/20">
          <label className="block text-sm font-bold mb-xs text-on-surface-variant uppercase tracking-widest">Poll Title</label>
          <Input 
            className="text-lg font-bold bg-transparent border-b border-outline-variant/50 rounded-none px-0 focus:ring-0 focus:border-primary placeholder:text-outline-variant"
            placeholder="e.g. Q3 Product Roadmap Priorities"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-lg">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="glass p-lg rounded-lg border border-outline-variant/30 relative group">
              <div className="flex justify-between items-start mb-md">
                <div className="flex-1 mr-md">
                  <label className="block text-xs font-bold mb-xs text-primary uppercase tracking-widest">Question {qIndex + 1}</label>
                  <Input 
                    placeholder="What is your main priority?"
                    value={q.text}
                    onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  />
                </div>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="mt-6 text-on-surface-variant hover:text-error transition-colors p-1 bg-surface-container-high rounded-full">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              <div className="space-y-sm pl-md border-l-2 border-surface-container-highest ml-sm">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">radio_button_unchecked</span>
                    <Input 
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt.text}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      className="py-1 text-sm bg-surface-container"
                    />
                    {q.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-sm">remove_circle_outline</span>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addOption(qIndex)} className="text-sm text-primary font-bold hover:underline flex items-center gap-xs mt-sm">
                  <span className="material-symbols-outlined text-sm">add</span> Add Option
                </button>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="glass p-lg rounded-xl voxly-glow border border-primary/20 grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div>
            <label className="block text-sm font-bold mb-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">timer</span> Timer / Duration
            </label>
            <select 
              value={expiresInHours}
              onChange={(e) => setExpiresInHours(Number(e.target.value))}
              className="w-full bg-surface-container border border-outline-variant/30 text-on-surface rounded-lg px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value={1}>1 Hour</option>
              <option value={24}>24 Hours</option>
              <option value={72}>3 Days</option>
              <option value={168}>1 Week</option>
              <option value={720}>30 Days</option>
            </select>
            <p className="text-xs text-on-surface-variant mt-1">Poll automatically closes after this time.</p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">lock</span> Access Control
            </label>
            <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/30">
              <button 
                type="button"
                onClick={() => setRequiresAuth(false)}
                className={`flex-1 text-sm py-1 rounded-md transition-colors ${!requiresAuth ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:bg-surface-variant'}`}
              >
                Public (Anonymous)
              </button>
              <button 
                type="button"
                onClick={() => setRequiresAuth(true)}
                className={`flex-1 text-sm py-1 rounded-md transition-colors ${requiresAuth ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:bg-surface-variant'}`}
              >
                Private (Login Req.)
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">Determine who can participate.</p>
          </div>
        </div>

        <div className="flex gap-md justify-center">
          <Button type="button" variant="secondary" onClick={addQuestion}>
            <span className="material-symbols-outlined text-sm">add_circle</span> Add Question
          </Button>
          <Button type="submit" disabled={loading} className="px-2xl">
            {loading ? 'Deploying...' : 'Deploy Poll'}
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
