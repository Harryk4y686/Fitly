-- Disable Email Verification for Development
-- Run this in Supabase SQL Editor to remove email verification requirement

-- 1. Confirm all existing users (so they can login immediately)
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. Create a function to auto-confirm new users on signup
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically confirm email on user creation
  NEW.email_confirmed_at = NOW();
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;

-- 4. Create trigger to auto-confirm new users
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.auto_confirm_user();

-- 5. Verify all users are now confirmed
SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as is_confirmed,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Success message
SELECT 'Email verification disabled! All users can now login immediately after signup.' as status;
