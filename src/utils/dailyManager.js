// Daily Session Manager & Midnight Countdown Engine
export function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hasCompletedToday() {
  const key = `playbook_session_${getTodayKey()}`;
  return localStorage.getItem(key) !== null;
}

export function getTodayResults() {
  const key = `playbook_session_${getTodayKey()}`;
  const saved = localStorage.getItem(key);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

export function saveTodayResults(data) {
  const todayKey = getTodayKey();
  const key = `playbook_session_${todayKey}`;
  localStorage.setItem(key, JSON.stringify({
    ...data,
    completedDate: todayKey,
    timestamp: Date.now()
  }));

  // Update streak
  const statsKey = 'playbook_player_stats';
  const currentStats = JSON.parse(localStorage.getItem(statsKey) || '{"streak": 0, "lastPlayed": ""}');
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yYear = yesterday.getFullYear();
  const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayKey = `${yYear}-${yMonth}-${yDay}`;

  let newStreak = 1;
  if (currentStats.lastPlayed === yesterdayKey) {
    newStreak = (currentStats.streak || 0) + 1;
  } else if (currentStats.lastPlayed === todayKey) {
    newStreak = currentStats.streak;
  }

  localStorage.setItem(statsKey, JSON.stringify({
    streak: newStreak,
    lastPlayed: todayKey
  }));
}

export function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Next midnight
  const diff = Math.max(0, midnight.getTime() - now.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
}
