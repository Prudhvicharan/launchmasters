-- LaunchMasters Database Schema
-- This file contains all the necessary tables, relationships, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Colleges table (cached from College Scorecard API)
CREATE TABLE IF NOT EXISTS colleges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  website TEXT,
  admission_rate DECIMAL,
  tuition_in_state INTEGER,
  tuition_out_state INTEGER,
  enrollment INTEGER,
  sat_avg INTEGER,
  act_avg INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User colleges (personal lists with categories)
CREATE TABLE IF NOT EXISTS user_colleges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  college_id TEXT REFERENCES colleges(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('reach', 'target', 'safety')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

-- Deadlines table
CREATE TABLE IF NOT EXISTS deadlines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  college_id TEXT REFERENCES colleges(id) ON DELETE CASCADE,
  deadline_type TEXT CHECK (deadline_type IN ('early_decision', 'early_action', 'regular_decision', 'rolling')) NOT NULL,
  deadline_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  college_id TEXT REFERENCES colleges(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'submitted', 'accepted', 'rejected', 'waitlisted')) DEFAULT 'not_started',
  submitted_date DATE,
  decision_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('deadline', 'reminder', 'update', 'system')) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Colleges indexes
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
CREATE INDEX IF NOT EXISTS idx_colleges_admission_rate ON colleges(admission_rate);
CREATE INDEX IF NOT EXISTS idx_colleges_tuition_in_state ON colleges(tuition_in_state);

-- User colleges indexes
CREATE INDEX IF NOT EXISTS idx_user_colleges_user_id ON user_colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_colleges_college_id ON user_colleges(college_id);
CREATE INDEX IF NOT EXISTS idx_user_colleges_category ON user_colleges(category);

-- Deadlines indexes
CREATE INDEX IF NOT EXISTS idx_deadlines_user_id ON deadlines(user_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_college_id ON deadlines(college_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_deadline_date ON deadlines(deadline_date);
CREATE INDEX IF NOT EXISTS idx_deadlines_deadline_type ON deadlines(deadline_type);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_college_id ON applications(college_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_colleges_updated_at ON colleges;
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deadlines_updated_at ON deadlines;
CREATE TRIGGER update_deadlines_updated_at BEFORE UPDATE ON deadlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

-- Note: Colleges table doesn't need RLS as it's public data

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile.
-- Note: This is now handled by the SECURITY DEFINER trigger below.
-- This policy is still useful for direct inserts if ever needed, but the trigger is primary.
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User colleges policies
DROP POLICY IF EXISTS "Users can view own college lists" ON user_colleges;
CREATE POLICY "Users can view own college lists" ON user_colleges FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own college lists" ON user_colleges;
CREATE POLICY "Users can insert own college lists" ON user_colleges FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own college lists" ON user_colleges;
CREATE POLICY "Users can update own college lists" ON user_colleges FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own college lists" ON user_colleges;
CREATE POLICY "Users can delete own college lists" ON user_colleges FOR DELETE USING (auth.uid() = user_id);

-- Deadlines policies
DROP POLICY IF EXISTS "Users can view own deadlines" ON deadlines;
CREATE POLICY "Users can view own deadlines" ON deadlines FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own deadlines" ON deadlines;
CREATE POLICY "Users can insert own deadlines" ON deadlines FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own deadlines" ON deadlines;
CREATE POLICY "Users can update own deadlines" ON deadlines FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own deadlines" ON deadlines;
CREATE POLICY "Users can delete own deadlines" ON deadlines FOR DELETE USING (auth.uid() = user_id);

-- Applications policies
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own applications" ON applications;
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own applications" ON applications;
CREATE POLICY "Users can delete own applications" ON applications FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Colleges Policies (allow public read access)
DROP POLICY IF EXISTS "Colleges are publicly viewable" ON colleges;
CREATE POLICY "Colleges are publicly viewable" ON colleges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated users to insert colleges" ON colleges;
CREATE POLICY "Allow authenticated users to insert colleges" ON colleges FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow authenticated users to update colleges" ON colleges;
CREATE POLICY "Allow authenticated users to update colleges" ON colleges FOR UPDATE WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- This function is triggered after a new user signs up in Supabase auth.
-- It creates a corresponding row in the public.profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- We do not copy raw_user_meta_data here due to permissions on new projects.
  -- The user can populate their full_name from the application.
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new user is created in auth.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- These views can simplify querying data by pre-joining tables.

-- View for user colleges with full college details
DROP VIEW IF EXISTS user_colleges_with_details;
CREATE OR REPLACE VIEW user_colleges_with_details AS
SELECT
  uc.id,
  uc.user_id,
  uc.college_id,
  uc.category,
  uc.notes,
  uc.created_at,
  c.name,
  c.city,
  c.state,
  c.website,
  c.admission_rate,
  c.tuition_in_state,
  c.tuition_out_state,
  c.enrollment,
  c.sat_avg,
  c.act_avg
FROM user_colleges uc
JOIN colleges c ON uc.college_id = c.id;

-- View for deadlines with full college details
DROP VIEW IF EXISTS deadlines_with_details;
CREATE OR REPLACE VIEW deadlines_with_details AS
SELECT
  d.id,
  d.user_id,
  d.college_id,
  d.deadline_type,
  d.deadline_date,
  d.is_completed,
  d.notes,
  d.created_at,
  d.updated_at,
  c.name,
  c.city,
  c.state
FROM deadlines d
JOIN colleges c ON d.college_id = c.id;

-- View for applications with full college details
DROP VIEW IF EXISTS applications_with_details;
CREATE OR REPLACE VIEW applications_with_details AS
SELECT
  a.id,
  a.user_id,
  a.college_id,
  a.status,
  a.submitted_date,
  a.decision_date,
  a.notes,
  a.created_at,
  a.updated_at,
  c.name,
  c.city,
  c.state
FROM applications a
JOIN colleges c ON a.college_id = c.id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE colleges IS 'College data cached from College Scorecard API';
COMMENT ON TABLE user_colleges IS 'User personal college lists with categories';
COMMENT ON TABLE deadlines IS 'Application deadlines for colleges';
COMMENT ON TABLE applications IS 'Application status tracking';
COMMENT ON TABLE notifications IS 'User notifications and reminders';

COMMENT ON COLUMN user_colleges.category IS 'College category: reach, target, or safety';
COMMENT ON COLUMN deadlines.deadline_type IS 'Type of deadline: early_decision, early_action, regular_decision, or rolling';
COMMENT ON COLUMN applications.status IS 'Application status: not_started, in_progress, submitted, accepted, rejected, or waitlisted';
COMMENT ON COLUMN notifications.type IS 'Notification type: deadline, reminder, update, or system'; 