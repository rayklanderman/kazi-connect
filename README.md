# Kazi Connect

A modern job platform connecting talent with opportunities in Kenya and beyond.

## Features

- Modern landing page with call-to-action
- User authentication with email confirmation
- Job listings and company profiles
- Resource library for career development
- Mobile-responsive design

## Tech Stack

- React + TypeScript
- Vite for build tooling
- Shadcn UI + TailwindCSS
- Supabase for backend
- React Query for data fetching
- Zustand for state management

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
   Then update the `.env` file with your Supabase credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

The application can be deployed to any static hosting service that supports single-page applications (SPA):

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service

## License

MIT
