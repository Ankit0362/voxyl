export const isValidEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(String(email).toLowerCase());
};

export const isStrongPassword = (password) => {
  let score = 0;
  if (!password) return { score, label: 'Weak', color: 'bg-red-500' };

  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;

  let label = 'Weak';
  let color = 'bg-red-500';
  if (score === 2) {
    label = 'Medium';
    color = 'bg-amber-500';
  } else if (score === 3) {
    label = 'Strong';
    color = 'bg-green-500';
  }

  return { score, label, color };
};

export const isValidUsername = (username) => {
  if (!username) return false;
  const re = /^[a-zA-Z0-9_]+$/;
  return username.length >= 3 && username.length <= 20 && re.test(username);
};

export const isValidPollTitle = (title) => {
  if (!title) return false;
  const trimmed = title.trim();
  return trimmed.length >= 3 && trimmed.length <= 200;
};

export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString).getTime() > new Date().getTime();
};
