import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import QuestionBuilder from '../../components/polls/QuestionBuilder';

const CreatePoll = () => {
  const navigate = useNavigate();

  const getInitialExpiry = () => {
    const d = new Date(Date.now() + 5 * 60000); 

    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    expiresAt: getInitialExpiry(),
    isAnonymous: false,
    requiresAuth: false,
    questions: [
      {
        id: crypto.randomUUID(),
        text: '',
        isRequired: true,
        options: [
          { id: crypto.randomUUID(), text: '' },
          { id: crypto.randomUUID(), text: '' }
        ]
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState({ open: false, shareToken: '', pollId: '' });

  // Conflict handling: Requires Auth + Anonymous logically incompatible in some flows,
  // Or if we decide they are, we auto-toggle it. User requested to disable anonymous if auth required.
  useEffect(() => {
    if (pollData.requiresAuth && pollData.isAnonymous) {
      setPollData(prev => ({ ...prev, isAnonymous: false }));
    }
  }, [pollData.requiresAuth]);

  const validateForm = () => {
    const newErrors = {};
    if (!pollData.title.trim()) newErrors.title = 'Poll title is required';
    else if (pollData.title.length > 200) newErrors.title = 'Max 200 characters';

    if (!pollData.expiresAt) newErrors.expiresAt = 'Expiry date is required';
    else if (new Date(pollData.expiresAt) <= new Date()) newErrors.expiresAt = 'Must be in the future';

    if (pollData.questions.length === 0) newErrors.questions = 'At least 1 question required';

    pollData.questions.forEach((q, qIndex) => {
      const qErrors = {};
      if (!q.text.trim()) qErrors.text = 'Question text is required';

      if (q.options.length < 2) qErrors.options = 'At least 2 options required';

      q.options.forEach(opt => {
        if (!opt.text.trim()) qErrors[`option_${opt.id}`] = 'Option cannot be empty';
      });

      if (Object.keys(qErrors).length > 0) {
        newErrors[`question_${qIndex}`] = qErrors;
      }
    });

    return newErrors;
  };

  const checklist = {
    hasTitle: pollData.title.trim().length > 0,
    hasExpiry: pollData.expiresAt && new Date(pollData.expiresAt) > new Date(),
    hasQuestions: pollData.questions.length > 0,
    hasOptions: pollData.questions.every(q => q.options.length >= 2),
    allTextsFilled: pollData.questions.every(q => 
      q.text.trim() !== '' && q.options.every(o => o.text.trim() !== '')
    )
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please fix the errors before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: pollData.title,
        description: pollData.description,
        expiresAt: new Date(pollData.expiresAt).toISOString(),
        isAnonymous: pollData.isAnonymous,
        requiresAuth: pollData.requiresAuth,
        questions: pollData.questions.map(q => ({
          text: q.text,
          isRequired: q.isRequired,
          options: q.options.map(o => ({ text: o.text }))
        }))
      };

      const { data } = await api.post('/polls/create', payload);
      setSuccessModal({ open: true, shareToken: data.poll.shareToken, pollId: data.poll._id });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create poll';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuestion = (index, newQuestion) => {
    const newQuestions = [...pollData.questions];
    newQuestions[index] = newQuestion;
    setPollData({ ...pollData, questions: newQuestions });
  };

  const deleteQuestion = (index) => {
    if (pollData.questions.length <= 1) return;
    const newQuestions = pollData.questions.filter((_, i) => i !== index);
    setPollData({ ...pollData, questions: newQuestions });
  };

  const moveQuestion = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newQuestions = [...pollData.questions];
      [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
      setPollData({ ...pollData, questions: newQuestions });
    } else if (direction === 'down' && index < pollData.questions.length - 1) {
      const newQuestions = [...pollData.questions];
      [newQuestions[index + 1], newQuestions[index]] = [newQuestions[index], newQuestions[index + 1]];
      setPollData({ ...pollData, questions: newQuestions });
    }
  };

  const addQuestion = () => {
    setPollData({
      ...pollData,
      questions: [
        ...pollData.questions,
        {
          id: crypto.randomUUID(),
          text: '',
          isRequired: true,
          options: [{ id: crypto.randomUUID(), text: '' }, { id: crypto.randomUUID(), text: '' }]
        }
      ]
    });
  };

  const formatExpiryPreview = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d)) return 'Invalid date';
    const options = { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return `Closes on ${d.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col lg:flex-row gap-8">

        {}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
            <p className="text-gray-500 mt-1">Design your questions and publish instantly</p>
          </div>

          {}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h2 className="text-lg font-bold text-gray-800">Poll Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Poll Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={pollData.title}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setPollData({...pollData, title: e.target.value})
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow bg-gray-50 focus:bg-white text-gray-900 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Employee Satisfaction Survey Q4 2024"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-red-500 font-medium">{errors.title}</p>
                  <p className="text-xs font-medium text-gray-400">{pollData.title.length} / 200</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea 
                  value={pollData.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) setPollData({...pollData, description: e.target.value})
                  }}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-y max-h-40 bg-gray-50 focus:bg-white text-gray-900"
                  placeholder="Optional: describe your poll to respondents"
                />
                <div className="flex justify-end mt-1">
                  <p className="text-xs font-medium text-gray-400">{pollData.description.length} / 1000</p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h2 className="text-lg font-bold text-gray-800">Schedule & Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Expiry Date & Time <span className="text-red-500">*</span></label>
                <input 
                  type="datetime-local" 
                  value={pollData.expiresAt}
                  min={getInitialExpiry()}
                  onChange={(e) => setPollData({...pollData, expiresAt: e.target.value})}
                  className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow bg-gray-50 focus:bg-white text-gray-900 ${errors.expiresAt ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="mt-2 flex items-center">
                  <div className="bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-md inline-flex items-center shadow-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {formatExpiryPreview(pollData.expiresAt)}
                  </div>
                </div>
                {errors.expiresAt && <p className="mt-1 text-xs text-red-500 font-medium">{errors.expiresAt}</p>}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Require Login to Respond</h3>
                    <p className="text-sm text-gray-500">Only authenticated users can submit responses</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={pollData.requiresAuth}
                      onChange={(e) => setPollData({...pollData, requiresAuth: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between">
                  <div className={`${pollData.requiresAuth ? 'opacity-50' : ''}`}>
                    <h3 className="text-sm font-bold text-gray-800 flex items-center">
                      Anonymous Responses
                      {pollData.requiresAuth && (
                        <span className="ml-2 inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full w-4 h-4 text-[10px] font-bold cursor-help" title="Conflicting settings">?</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">Response identities will not be tracked</p>
                    {pollData.requiresAuth && (
                      <p className="text-xs text-orange-500 mt-1 font-semibold">Disabled because login is required.</p>
                    )}
                  </div>
                  <label className={`relative inline-flex items-center ${pollData.requiresAuth ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex-shrink-0 mt-1`}>
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={pollData.isAnonymous}
                      disabled={pollData.requiresAuth}
                      onChange={(e) => setPollData({...pollData, isAnonymous: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900">Questions</h2>
                <span className="bg-primary-100 text-primary-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
                  {pollData.questions.length}
                </span>
              </div>
              <button 
                onClick={addQuestion}
                className="bg-white text-primary-700 border shadow-sm border-gray-200 hover:bg-primary-50 hover:border-primary-200 font-bold py-1.5 px-3 rounded-md text-sm transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>Add Question</span>
              </button>
            </div>

            {errors.questions && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-bold flex items-center shadow-sm">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errors.questions}
              </div>
            )}

            <div className="space-y-0">
              {pollData.questions.map((q, index) => (
                <QuestionBuilder
                  key={q.id}
                  index={index}
                  question={q}
                  totalQuestions={pollData.questions.length}
                  errors={errors[`question_${index}`]}
                  onUpdate={(newQ) => updateQuestion(index, newQ)}
                  onDelete={() => deleteQuestion(index)}
                  onMoveUp={() => moveQuestion(index, 'up')}
                  onMoveDown={() => moveQuestion(index, 'down')}
                />
              ))}
            </div>

            <button 
              onClick={addQuestion}
              className="w-full py-4 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-white hover:border-primary-400 rounded-lg text-gray-500 hover:text-primary-600 font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span>Add Another Question</span>
            </button>
          </div>
        </div>

        {}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 space-y-6">

            {}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg z-10 opacity-75">
                Live Preview
              </div>
              <div className="h-1.5 bg-primary-600 w-full"></div>
              <div className="p-6 pointer-events-none opacity-[0.85]">
                <h3 className="text-xl font-bold text-gray-900 break-words line-clamp-2">
                  {pollData.title || 'Untitled Poll'}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {pollData.description || 'No description provided.'}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded mr-2 uppercase">Q1</span>
                    <span className="font-semibold text-gray-900 break-words">
                      {pollData.questions[0]?.text || 'Question text will appear here...'}
                    </span>
                  </div>
                  <div className="space-y-3 pl-1">
                    {(pollData.questions[0]?.options || []).slice(0, 3).map((opt, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                        <span className="text-sm text-gray-700 truncate">{opt.text || `Option ${i+1}`}</span>
                      </div>
                    ))}
                    {(pollData.questions[0]?.options?.length > 3) && (
                      <div className="text-xs text-gray-400 font-medium italic pl-7">
                        + {pollData.questions[0].options.length - 3} more options
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Submission Checklist</h3>
              <ul className="space-y-3.5 mb-6">
                <li className="flex items-center text-sm font-medium">
                  <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${checklist.hasTitle ? 'text-green-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className={checklist.hasTitle ? 'text-gray-800' : 'text-gray-400'}>Poll title added</span>
                </li>
                <li className="flex items-center text-sm font-medium">
                  <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${checklist.hasExpiry ? 'text-green-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className={checklist.hasExpiry ? 'text-gray-800' : 'text-gray-400'}>Expiry date set</span>
                </li>
                <li className="flex items-center text-sm font-medium">
                  <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${checklist.hasQuestions ? 'text-green-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className={checklist.hasQuestions ? 'text-gray-800' : 'text-gray-400'}>At least 1 question</span>
                </li>
                <li className="flex items-center text-sm font-medium">
                  <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${checklist.hasOptions ? 'text-green-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className={checklist.hasOptions ? 'text-gray-800' : 'text-gray-400'}>All questions have 2+ options</span>
                </li>
                <li className="flex items-center text-sm font-medium">
                  <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${checklist.allTextsFilled ? 'text-green-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className={checklist.allTextsFilled ? 'text-gray-800' : 'text-gray-400'}>All text fields populated</span>
                </li>
              </ul>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-lg transition-transform active:scale-[0.98] shadow-md flex justify-center items-center text-lg disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : "Publish Poll"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {}
      {successModal.open && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-[popIn_0.3s_ease-out]">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll Created Successfully! 🎉</h2>
            <p className="text-gray-500 mb-6 font-medium">Your poll is now live and ready to receive responses.</p>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6 shadow-inner">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-left">Public Share Link</p>
              <div className="flex items-center shadow-sm">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/p/${successModal.shareToken}`}
                  className="w-full bg-white border border-gray-300 rounded-l-lg px-3 py-2.5 text-sm font-medium text-gray-700 outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/p/${successModal.shareToken}`);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="bg-primary-100 hover:bg-primary-200 text-primary-700 border border-l-0 border-primary-200 font-bold px-4 py-2.5 rounded-r-lg transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-3 flex justify-center items-center">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Share this link with your respondents
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => navigate(`/polls/${successModal.pollId}/analytics`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
              >
                View Analytics
              </button>
              <button 
                onClick={() => {
                  setPollData({
                    title: '', description: '', expiresAt: getInitialExpiry(),
                    isAnonymous: false, requiresAuth: false,
                    questions: [{ id: crypto.randomUUID(), text: '', isRequired: true, options: [{ id: crypto.randomUUID(), text: '' }, { id: crypto.randomUUID(), text: '' }] }]
                  });
                  setSuccessModal({ open: false, shareToken: '', pollId: '' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold py-3.5 px-4 rounded-xl transition-colors"
              >
                Create Another Poll
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}} />

    </div>
  );
};

export default CreatePoll;
