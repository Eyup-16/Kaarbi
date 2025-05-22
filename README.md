# Kaarbi

A modern web application built with Next.js 15, React 19, and TypeScript, featuring a robust authentication system and beautiful UI components.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15 and React 19
- **Type Safety**: Full TypeScript support
- **Authentication**: Secure authentication system using better-auth
- **UI Components**: Beautiful and accessible components using Radix UI
- **Form Handling**: Advanced form management with React Hook Form and Zod validation
- **Styling**: Modern styling with Tailwind CSS
- **Animations**: Smooth animations powered by Framer Motion
- **Database**: Prisma ORM for type-safe database operations
- **Email Support**: Email functionality with Nodemailer
- **Theme Support**: Dark/Light mode with next-themes 

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Eyup-16/kaarbi.git
cd kaarbi
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory and add your environment variables.

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

## 🛠️ Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🧪 Testing

Run the linter:

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # Reusable UI components
├── context/      # React context providers
├── db/          # Database related code
├── generated/   # Generated files
├── hooks/       # Custom React hooks
├── lib/         # Utility functions and configurations
├── server/      # Server-side code
├── stores/      # State management
└── types/       # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma + PostgreSQL
- **Form Handling**: React Hook Form + Zod
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion + Gsap
- **Email**: Nodemailer (for local development)
- **Authentication**: better-auth

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👥 Authors

- Eyup - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for the hosting platform
- All contributors who have helped shape this project
