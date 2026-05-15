import { useState, useEffect } from 'react';

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, formattedString: ''
  });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formattedString: 'EXPIRED'
        });
        return true; 
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let formattedString = '';
      if (days > 0) formattedString += `${days}d `;
      if (hours > 0 || days > 0) formattedString += `${hours}h `;
      formattedString += `${minutes}m`;
      if (days === 0 && hours === 0) formattedString += ` ${seconds}s`; 

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false, formattedString: formattedString.trim() });
      return false;
    };

    if (calculateTime()) return;

    const interval = setInterval(() => {
      if (calculateTime()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}
