# LaunchMasters Database Setup Guide

This guide will help you set up the Supabase database for LaunchMasters.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `launchmasters`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Update Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_COLLEGE_SCORECARD_API_KEY=3wAuDRWXKx4TDcS1QLoKAjEkUo6csct8ZPF4xNZX
   ```

### 4. Apply Database Schema

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `database/schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the schema

**Important:** You must be logged in as a user with superuser privileges (like the default `postgres` user) to successfully run the entire script. This is required for the `ALTER FUNCTION` command that sets the correct ownership for the `handle_new_user` trigger, which is critical for user sign-ups to work correctly.

#### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Apply the schema:
   ```bash
   supabase db push
   ```

### 5. Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `profiles`
   - `colleges`
   - `user_colleges`
   - `deadlines`
   - `applications`
   - `notifications`

3. Check **Authentication** → **Policies** to verify RLS is enabled

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User profiles | Extends Supabase auth, stores user metadata |
| `colleges` | College data cache | Stores College Scorecard API data |
| `user_colleges` | Personal college lists | Categories: reach/target/safety |
| `deadlines` | Application deadlines | Tracks due dates and completion status |
| `applications` | Application tracking | Status: not_started → accepted/rejected |
| `notifications` | User notifications | Email and in-app reminders |

### Key Features

- **Row Level Security (RLS)**: All user data is protected
- **Automatic Timestamps**: `created_at` and `updated_at` fields
- **Data Validation**: Check constraints on enums
- **Indexes**: Optimized for common queries
- **Views**: Pre-joined data for complex queries
- **Functions**: Dashboard stats and user management

## 🔐 Security Features

### Row Level Security (RLS)

All tables except `colleges` have RLS enabled:

- Users can only access their own data
- Policies automatically filter by `auth.uid()`
- Secure by default - no data leakage

### Authentication Integration

- Automatic profile creation on signup
- Seamless integration with Supabase Auth
- Email verification and password reset support

## 🛠️ Database Functions

### `get_user_dashboard_stats(user_uuid)`

Returns comprehensive dashboard statistics:
- Total colleges by category
- Upcoming deadlines count
- Application status counts

### `handle_new_user()`

Automatically creates user profile on signup.

## 📈 Performance Optimizations

### Indexes

Strategic indexes for common queries:
- User lookups by ID
- College searches by name/state
- Deadline filtering by date
- Application status queries

### Views

Pre-joined views for complex data:
- `user_colleges_with_details`
- `deadlines_with_details`
- `applications_with_details`

## 🔄 Data Flow

1. **User Registration**: Supabase Auth → `profiles` table
2. **College Search**: College Scorecard API → `colleges` cache
3. **Personal Lists**: User adds colleges → `user_colleges`
4. **Deadlines**: User sets deadlines → `deadlines`
5. **Applications**: Track progress → `applications`
6. **Notifications**: System generates → `notifications`

## 🚨 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check policy syntax in Supabase dashboard

2. **Foreign Key Violations**
   - Verify college exists before adding to user list
   - Check user profile exists before creating related records

3. **Permission Denied**
   - Verify RLS policies are correctly applied
   - Check user authentication status

### Debug Queries

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check user permissions
SELECT * FROM auth.users WHERE id = auth.uid();

-- Test dashboard stats
SELECT * FROM get_user_dashboard_stats(auth.uid());
```

## 📝 Next Steps

After database setup:

1. **Test Authentication**: Verify signup/login works
2. **Test College Search**: Ensure API integration works
3. **Test CRUD Operations**: Verify all table operations work
4. **Monitor Performance**: Check query performance in Supabase dashboard

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [College Scorecard API](https://collegescorecard.ed.gov/data/documentation/)

## 1. Schema (`schema.sql`)

The `schema.sql` file contains the complete database schema, including:
- Tables
- Indexes
- Row Level Security (RLS) Policies
- Functions & Triggers
- Views

### How to Apply the Schema

1. Go to your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Click on **New Query**.
4. Copy the entire content of `schema.sql` and paste it into the editor.
5. Click **Run**.

**Important:** You must be logged in as a user with superuser privileges (like the default `postgres` user) to successfully run the entire script. This is required for the `ALTER FUNCTION` command that sets the correct ownership for the `handle_new_user` trigger, which is critical for user sign-ups to work correctly.

## 2. Sample Data (`sample-data.sql`)

This file contains sample data to populate the database for development and testing purposes. It helps to have a realistic environment to work with.

### How to Use

Run this script in the SQL Editor **after** applying the main schema.

## 3. Setup Script (`setup.sh`)

This is a convenience script to apply the schema and sample data from your local command line using `psql`.

### Prerequisites

- `psql` (PostgreSQL client) installed.
- Your Supabase database password (find it in your project's Database settings).

### How to Run

1. Make the script executable: `chmod +x setup.sh`
2. Run the script with your database connection details:
   ```bash
   ./setup.sh [db_host] [db_password]
   ```

Replace `[db_host]` and `[db_password]` with your actual Supabase database host and password. 