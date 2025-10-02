# Daily Login Streak System

## Overview
The CalorieSnap app now includes a daily login streak system that tracks consecutive days users log into the app. This encourages daily engagement and creates a gamification element.

## Features
- **Daily Streak Tracking**: Counts consecutive days of user logins
- **Best Streak Record**: Stores the user's highest streak achievement
- **Automatic Updates**: Streak updates automatically on login/app open
- **Per-User Tracking**: Each Gmail account has its own independent streak

## Database Schema

### New Fields in `user_profiles` table:
```sql
streak_count INTEGER DEFAULT 0          -- Current consecutive login streak
last_login_date DATE                    -- Last login date (YYYY-MM-DD)
best_streak INTEGER DEFAULT 0           -- Highest streak ever achieved
```

## Streak Logic Rules

### When a user logs in or opens the app:
1. **Get today's date** (YYYY-MM-DD format, no time)
2. **Compare with `last_login_date`**:
   - **If `last_login_date` is yesterday** → increment `streak_count` by 1
   - **If `last_login_date` is today** → do nothing (already counted)
   - **Otherwise (missed a day or first login)** → reset `streak_count` to 1
3. **Always update `last_login_date` to today**
4. **Update `best_streak`** if current streak > best streak

## Implementation Details

### Files Modified:
- `lib/database.ts` - Added streak fields to UserProfile interface and streak logic
- `contexts/AuthContext.tsx` - Calls streak update on login/session restore
- `app/(tabs)/dashboard.tsx` - Displays real streak data from user profile
- `database/add_streak_fields.sql` - SQL migration for new fields

### Key Functions:

#### `updateLoginStreak(userId: string)`
```typescript
// Main function that handles all streak logic
// Called automatically when user logs in or opens app
// Returns: { streakCount: number; bestStreak: number } | null
```

#### Helper Functions:
- `getTodayDateString()` - Returns today's date in YYYY-MM-DD format
- `getYesterdayDateString()` - Returns yesterday's date in YYYY-MM-DD format

## UI Integration

### Dashboard Display:
- **Streak Icon**: 🔥 fire emoji
- **Streak Count**: Shows current `streak_count` from user profile
- **Real-time Updates**: Automatically refreshes when user profile loads

### Example Display:
```
🔥 7    (showing 7-day streak)
```

## Setup Instructions

### 1. Database Migration
Run the SQL migration in your Supabase SQL editor:
```bash
# Execute the contents of database/add_streak_fields.sql
```

### 2. Test the System
1. **Login/Logout Test**: Login → logout → login again (same day)
   - Streak should increment only once per day
2. **Daily Progression Test**: Simulate different login dates
3. **Missed Day Test**: Skip a day, streak should reset to 1
4. **Best Streak Test**: Verify best streak updates correctly

## Logging and Debugging

The system includes comprehensive console logging:
- `=== UPDATING LOGIN STREAK ===` - Start of streak update
- Date comparisons and logic decisions
- Final streak values and database updates
- Error handling for failed operations

## Example Scenarios

### Scenario 1: New User First Login
- `last_login_date`: null
- `streak_count`: 0 → 1
- `best_streak`: 0 → 1

### Scenario 2: Daily Login (Yesterday → Today)
- `last_login_date`: "2024-01-15"
- Today: "2024-01-16"
- `streak_count`: 5 → 6
- `best_streak`: 8 (unchanged)

### Scenario 3: Missed a Day
- `last_login_date`: "2024-01-13"
- Today: "2024-01-15"
- `streak_count`: 5 → 1 (reset)
- `best_streak`: 8 (unchanged)

### Scenario 4: Multiple Logins Same Day
- `last_login_date`: "2024-01-15"
- Today: "2024-01-15"
- `streak_count`: 5 (unchanged)
- `best_streak`: 8 (unchanged)

## Future Enhancements

### Potential Features:
- **Streak Rewards**: Unlock achievements at milestone streaks
- **Weekly/Monthly Streaks**: Additional streak types
- **Streak Recovery**: Allow one "skip day" without breaking streak
- **Social Features**: Compare streaks with friends
- **Push Notifications**: Remind users to maintain their streak

## Technical Notes

- **Timezone Handling**: Uses device local time for date calculations
- **Performance**: Indexed database fields for efficient queries
- **Error Handling**: Graceful fallback if streak update fails
- **Race Conditions**: Safe update mechanism prevents data corruption
- **Memory**: Based on existing auth-helpers pattern for reliability
