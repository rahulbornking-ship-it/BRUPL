// Activity service for recording user activities
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Record an activity (video watched, quiz taken, etc.)
 * This also updates the user's streak
 * @param {string} token - Auth token
 * @param {string} type - Activity type: 'video_watched', 'quiz_taken', 'problem_solved', 'lesson_completed'
 * @param {object} metadata - Additional data like courseId, lessonId, etc.
 */
export const recordActivity = async (token, type, metadata = {}) => {
    try {
        const res = await fetch(`${API_URL}/profile/activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type, metadata })
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to record activity:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get activity calendar data
 * @param {string} token - Auth token
 */
export const getActivityCalendar = async (token) => {
    try {
        const res = await fetch(`${API_URL}/profile/activity/calendar`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch activity calendar:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get streak information
 * @param {string} token - Auth token
 */
export const getStreak = async (token) => {
    try {
        const res = await fetch(`${API_URL}/profile/streak`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch streak:', error);
        return { success: false, error: error.message };
    }
};

export default {
    recordActivity,
    getActivityCalendar,
    getStreak
};
