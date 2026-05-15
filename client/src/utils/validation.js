export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePoll = (title, questions) => {
  if (!title.trim()) return 'Poll title is required';
  if (questions.length === 0) return 'At least 1 question is required';
  for (const q of questions) {
    if (!q.text.trim()) return 'All questions must have text';
    if (q.options.length < 2) return 'Each question needs at least 2 options';
    if (q.options.some(o => !o.text.trim())) return 'All options must have text';
  }
  return null;
};
