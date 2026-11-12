export function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPlaybookDayNumber() {
  const start = new Date('2026-01-01T00:00:00Z');
  const now = new Date();
  const diffTime = Math.abs(now - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getPlayerRank(avgScore) {
  if (avgScore >= 85) return { title: 'Founder', next: null, min: 85, max: 100, progress: 100 };
  if (avgScore >= 70) return { title: 'Partner', next: 'Founder', min: 70, max: 84, progress: Math.round(((avgScore - 70) / 15) * 100) };
  if (avgScore >= 55) return { title: 'Operator', next: 'Partner', min: 55, max: 69, progress: Math.round(((avgScore - 55) / 15) * 100) };
  if (avgScore >= 40) return { title: 'Analyst', next: 'Operator', min: 40, max: 54, progress: Math.round(((avgScore - 40) / 15) * 100) };
  return { title: 'Intern', next: 'Analyst', min: 0, max: 39, progress: Math.round((Math.max(0, avgScore) / 40) * 100) };
}

export function getLifetimeAverage() {
  let totalScoreSum = 0;
  let count = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('playbook_session_')) {
      try {
        const session = JSON.parse(localStorage.getItem(key));
        if (session && typeof session.avgScore === 'number') {
          totalScoreSum += session.avgScore;
          count++;
        }
      } catch (e) {}
    }
  }

  return count > 0 ? Math.round(totalScoreSum / count) : 84;
}

export function hasCompletedToday() {
  const key = `playbook_session_${getTodayKey()}`;
  return localStorage.getItem(key) !== null;
}

export function getTodayResults() {
  const key = `playbook_session_${getTodayKey()}`;
  const saved = localStorage.getItem(key);
  if (!saved) return null;
  try { return JSON.parse(saved); } catch (e) { return null; }
}

export function saveTodayResults(data) {
  const todayKey = getTodayKey();
  const key = `playbook_session_${todayKey}`;
  localStorage.setItem(key, JSON.stringify({
    ...data,
    completedDate: todayKey,
    timestamp: Date.now()
  }));

  // Streak & Streak Freeze Logic
  const statsKey = 'playbook_player_stats';
  const stats = JSON.parse(localStorage.getItem(statsKey) || '{"streak": 0, "lastPlayed": "", "streakFreezes": 0}');
  
  if (stats.lastPlayed !== todayKey) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayKey = `${yYear}-${yMonth}-${yDay}`;

    if (!stats.lastPlayed) {
      stats.streak = 1;
    } else if (stats.lastPlayed === yesterdayKey) {
      stats.streak += 1;
    } else {
      // Check missed days for streak freeze
      const diffTime = Math.abs(new Date(todayKey) - new Date(stats.lastPlayed));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 2 && (stats.streakFreezes || 0) > 0) {
        stats.streakFreezes -= 1;
        stats.streak += 1; // Saved by freeze!
      } else {
        stats.streak = 1;
      }
    }

    // Earn a streak freeze every 7 consecutive days
    if (stats.streak > 0 && stats.streak % 7 === 0) {
      stats.streakFreezes = (stats.streakFreezes || 0) + 1;
    }

    stats.lastPlayed = todayKey;
    localStorage.setItem(statsKey, JSON.stringify(stats));
  }
}

export function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
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
