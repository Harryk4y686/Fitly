-- Add streak tracking fields to user_profiles table
-- Run this SQL in your Supabase SQL editor

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.streak_count IS 'Current consecutive daily login streak count';
COMMENT ON COLUMN user_profiles.last_login_date IS 'Date of last login (YYYY-MM-DD format, no time)';
COMMENT ON COLUMN user_profiles.best_streak IS 'Highest streak count achieved by the user';

-- Create index for efficient streak queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login_date ON user_profiles(last_login_date);
CREATE INDEX IF NOT EXISTS idx_user_profiles_streak_count ON user_profiles(streak_count);

-- Update RLS policies to include new fields (if needed)
-- The existing RLS policies should already cover these new columns since they're part of user_profiles table
