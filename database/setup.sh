#!/bin/bash

# LaunchMasters Database Setup Script
# This script helps you set up the Supabase database

echo "🚀 LaunchMasters Database Setup"
echo "================================"

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your Supabase credentials:"
    echo ""
    echo "VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=your_anon_key_here"
    echo "VITE_COLLEGE_SCORECARD_API_KEY=3wAuDRWXKx4TDcS1QLoKAjEkUo6csct8ZPF4xNZX"
    echo ""
    echo "You can copy from .env.example:"
    echo "cp ../.env.example ../.env"
    exit 1
fi

echo "✅ .env file found"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found"
    echo "You can install it with: npm install -g supabase"
    echo ""
    echo "Alternatively, you can use the Supabase Dashboard:"
    echo "1. Go to your Supabase project"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy and paste the contents of schema.sql"
    echo "4. Click Run"
    echo ""
    read -p "Continue with manual setup? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Supabase CLI found"
    
    # Check if user is logged in
    if ! supabase status &> /dev/null; then
        echo "⚠️  Not logged into Supabase"
        echo "Please run: supabase login"
        exit 1
    fi
    
    echo "✅ Logged into Supabase"
    
    # Check if project is linked
    if ! supabase status &> /dev/null; then
        echo "⚠️  Project not linked"
        echo "Please run: supabase link --project-ref your-project-ref"
        exit 1
    fi
    
    echo "✅ Project linked"
    
    # Apply schema
    echo "📊 Applying database schema..."
    supabase db push
    
    if [ $? -eq 0 ]; then
        echo "✅ Schema applied successfully!"
    else
        echo "❌ Failed to apply schema"
        exit 1
    fi
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Create a user account through the app"
echo "3. Test the authentication flow"
echo "4. Start building features!"
echo ""
echo "📚 Documentation:"
echo "- Database schema: database/schema.sql"
echo "- Setup guide: database/README.md"
echo "- Sample data: database/sample-data.sql"
echo ""
echo "🔗 Useful links:"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo "- College Scorecard API: https://collegescorecard.ed.gov/data/documentation/" 