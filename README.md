# LaunchMasters - College Application Management System

LaunchMasters is a comprehensive web application that helps students manage their college application journey from discovery to decision. Students can search colleges, track deadlines, monitor application progress, and receive smart reminders.

## 🚀 Features

- **College Discovery** - Search and filter 7,000+ US colleges using the College Scorecard API
- **Personal College Lists** - Save colleges in reach/target/safety categories
- **Deadline Tracking** - Track application deadlines with smart reminders
- **Application Progress** - Monitor application status and completion
- **Smart Notifications** - Email and in-app deadline reminders
- **Analytics Dashboard** - Progress visualization and insights
- **User Authentication** - Secure user accounts with Supabase Auth

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **External API**: College Scorecard API for live college data
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **UI Components**: Headless UI + Heroicons
- **Charts**: Chart.js + React Chart.js 2
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd launchmasters
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_COLLEGE_SCORECARD_API_KEY=3wAuDRWXKx4TDcS1QLoKAjEkUo6csct8ZPF4xNZX
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

### Quick Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Get your project URL and anon key from Settings → API

2. **Update Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Apply Database Schema**
   
   **Option A: Using Supabase Dashboard (Recommended)**
   - Go to your Supabase project → SQL Editor
   - Copy and paste the contents of `database/schema.sql`
   - Click "Run" to execute

   **Option B: Using Supabase CLI**
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref your-project-ref
   supabase db push
   ```

   **Option C: Using Setup Script**
   ```bash
   cd database
   ./setup.sh
   ```

4. **Add Sample Data (Optional)**
   - Copy and paste the contents of `database/sample-data.sql` into SQL Editor
   - Click "Run" to add sample colleges

### Database Schema Overview

The complete schema includes:

- **6 Core Tables**: profiles, colleges, user_colleges, deadlines, applications, notifications
- **Row Level Security (RLS)**: All user data is protected
- **Indexes**: Optimized for common queries
- **Views**: Pre-joined data for complex queries
- **Functions**: Dashboard stats and user management
- **Triggers**: Automatic timestamp updates

### Key Features

- **Automatic Profile Creation**: User profiles created on signup
- **Data Validation**: Check constraints on enums and relationships
- **Performance Optimized**: Strategic indexes and views
- **Secure by Default**: RLS policies protect all user data

For detailed setup instructions, see [`database/README.md`](database/README.md).

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/           # Login, SignUp, AuthGuard
│   ├── colleges/       # Search, Cards, Details, Filters
│   ├── dashboard/      # Overview, Stats, Quick Actions
│   ├── lists/          # My Colleges, Categories
│   ├── deadlines/      # Calendar, Forms, Reminders
│   ├── applications/   # Progress, Status Tracking
│   └── ui/             # Reusable components
├── hooks/              # Custom React hooks
├── services/           # API integrations (Supabase, College Scorecard)
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Priorities

1. **Setup** ✅ - Project structure, Supabase config, Tailwind setup
2. **Authentication** - Sign up, login, user profiles with Supabase Auth
3. **College Search** - Integrate College Scorecard API with caching
4. **College Lists** - Personal college management with categories
5. **Deadlines** - Deadline tracking with calendar view
6. **Applications** - Progress tracking and status updates
7. **Dashboard** - Analytics and progress visualization
8. **Notifications** - Reminder system for deadlines

## 📱 Features Roadmap

### Phase 1: Core Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS configuration
- [x] Supabase client setup
- [x] College Scorecard API integration
- [x] Basic routing structure
- [x] TypeScript types and interfaces

### Phase 2: Authentication & User Management
- [ ] User registration and login
- [ ] Profile management
- [ ] Password reset functionality
- [ ] Email verification

### Phase 3: College Discovery
- [ ] College search with filters
- [ ] College details pages
- [ ] College comparison tools
- [ ] Search history and favorites

### Phase 4: College Lists & Categories
- [ ] Add/remove colleges from lists
- [ ] Categorize colleges (reach/target/safety)
- [ ] Notes and personal ratings
- [ ] List sharing and collaboration

### Phase 5: Deadline Management
- [ ] Deadline creation and editing
- [ ] Calendar view
- [ ] Deadline reminders
- [ ] Progress tracking

### Phase 6: Application Tracking
- [ ] Application status management
- [ ] Document uploads
- [ ] Progress visualization
- [ ] Decision tracking

### Phase 7: Dashboard & Analytics
- [ ] Overview dashboard
- [ ] Progress charts and statistics
- [ ] Timeline view
- [ ] Export functionality

### Phase 8: Notifications & Reminders
- [ ] Email notifications
- [ ] In-app notifications
- [ ] Customizable reminder settings
- [ ] Smart notification scheduling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [College Scorecard API](https://collegescorecard.ed.gov/data/documentation/) for comprehensive college data
- [Supabase](https://supabase.com) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [React Query](https://tanstack.com/query) for server state management
