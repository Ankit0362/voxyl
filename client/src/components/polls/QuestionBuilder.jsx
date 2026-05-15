import React from 'react';

const QuestionBuilder = ({ 
  question, 
  index, 
  totalQuestions, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  errors = {} 
}) => {

  const handleTextChange = (e) => {
    onUpdate({ ...question, text: e.target.value });
  };

  const handleRequiredToggle = (e) => {
    onUpdate({ ...question, isRequired: e.target.checked });
  };

  const handleOptionChange = (optId, newText) => {
    const newOptions = question.options.map(opt => 
      opt.id === optId ? { ...opt, text: newText } : opt
    );
    onUpdate({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    if (question.options.length >= 8) return;
    onUpdate({ 
      ...question, 
      options: [...question.options, { id: crypto.randomUUID(), text: '' }] 
    });
  };

  const handleDeleteOption = (optId) => {
    if (question.options.length <= 2) return;
    const newOptions = question.options.filter(opt => opt.id !== optId);
    onUpdate({ ...question, options: newOptions });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Header Row */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="bg-primary-100 text-primary-700 font-bold px-2.5 py-0.5 rounded-md text-sm">
            Q{index + 1}
          </span>
          <div className="flex flex-col space-y-0.5">
            <button 
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <button 
              type="button"
              onClick={onMoveDown}
              disabled={index === totalQuestions - 1}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-sm text-gray-600 font-medium">Required</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={question.isRequired}
                onChange={handleRequiredToggle}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${question.isRequired ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${question.isRequired ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
          <div className="w-px h-5 bg-gray-300"></div>
          <button 
            type="button"
            onClick={onDelete}
            disabled={totalQuestions <= 1}
            className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors focus:outline-none"
            title="Delete Question"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="mb-5">
          <textarea
            value={question.text}
            onChange={handleTextChange}
            placeholder="e.g., How satisfied are you with your work environment?"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-none bg-gray-50 focus:bg-white text-gray-900 ${errors.text ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            rows={2}
          />
          {errors.text && <p className="mt-1 text-xs text-red-500 font-medium">{errors.text}</p>}
        </div>

        {/* Options Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Answer Options (select one)</label>
          <div className="space-y-3">
            {question.options.map((opt, optIndex) => (
              <div key={opt.id} className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                <div className="flex-grow">
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                    className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow text-sm bg-gray-50 focus:bg-white ${errors[`option_${opt.id}`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`option_${opt.id}`] && <p className="mt-0.5 text-xs text-red-500">{errors[`option_${opt.id}`]}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteOption(opt.id)}
                  disabled={question.options.length <= 2}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400 p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddOption}
              disabled={question.options.length >= 8}
              className="flex items-center space-x-1 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:hover:text-primary-600 focus:outline-none transition-colors"
            >
              <div className="bg-primary-50 rounded p-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <span>Add Option</span>
            </button>
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">Max 8 options</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilder;
