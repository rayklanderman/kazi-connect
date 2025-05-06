<p align="center">
  <img src="./public/icon-512.png" alt="Kazi Connect Logo" width="128"/>
</p>

# Kazi Connect

Discover your next opportunity with Kazi Connect – a smarter way to match your skills and experience with the best jobs available.


## Why Kazi Connect?

- **Personalized Job Matches:** Our smart matching logic analyzes your profile and resume to recommend roles that truly fit your strengths and ambitions.
- **Seamless Experience:** Manage your profile, upload your CV, and save jobs all in one convenient place.
- **Stay Organized:** Bookmark opportunities and track your applications effortlessly.
- **Accessible Anywhere:** Enjoy a beautiful, mobile-friendly interface and install the app on your device for instant access.

## Try It Now

**Live Site:** [https://kazi-connect.vercel.app/](https://kazi-connect.vercel.app/)

**Note:** This project uses Supabase only. Any references to Firebase in earlier versions are obsolete.

### Security & Secrets
- All secrets (API keys, Supabase credentials) must be stored in `.env`, which is already included in `.gitignore`.
- **Never** commit your `.env` or any secret keys to the repository.
- The `.env.example` file provides a template but does not contain real credentials.

### .gitignore
This project includes a comprehensive `.gitignore` to avoid committing sensitive files, node_modules, build output, and environment variables.

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
