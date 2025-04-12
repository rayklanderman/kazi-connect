# Kazi Connect

A modern job platform connecting talent with opportunities in Kenya and beyond.

## Features

- Modern landing page with call-to-action
- User authentication with email confirmation
- Job listings and company profiles
- Resource library for career development
- Mobile-responsive design
- AI-powered resume analysis
- Smart interview preparation

## Tech Stack

- React + TypeScript
- Vite for build tooling
- Shadcn UI + TailwindCSS
- Supabase for backend
- React Query for data fetching
- Zustand for state management
- xAI API for AI features

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rayklanderman/kazi-connect.git
   cd kazi-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then update the `.env` file with your credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_XAI_API_KEY`: Your xAI API key

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set up environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_XAI_API_KEY`
4. Deploy

### Manual Deployment

The application can be deployed to any static hosting service that supports single-page applications (SPA):

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service

### Supabase Edge Functions

The project uses Supabase Edge Functions for AI features. To deploy them:

1. Install Supabase CLI if not already installed:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Deploy the functions:
   ```bash
   supabase functions deploy ai-analyze --project-ref your-project-ref
   ```

4. Set the Edge Function environment variables:
   ```bash
   supabase secrets set XAI_API_KEY=your-xai-api-key --project-ref your-project-ref
   ```

## License

MIT
