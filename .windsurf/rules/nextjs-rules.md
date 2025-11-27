---
trigger: always_on
---

# General Code Style & Formatting
- Follow the Airbnb Style Guide for code formatting.
- Use PascalCase for React component file names (e.g., UserCard.tsx, not user-card.tsx).
- Prefer named exports for components.

# Project Structure & Architecture
- Follow Next.js patterns and use the App Router.
- Correctly determine when to use server vs. client components in Next.js.

# Styling & UI
- Use Tailwind CSS for styling.
- Use Shadcn UI for components.

# Data Fetching & Forms
- Use TanStack Query (react-query) for frontend data fetching.
- Use React Hook Form for form handling.
- Use Zod for validation.

# State Management & Logic
- Use Zustand for state management.

# Backend & Database
Use Prisma for database access.

# TypeScript & Strictness
- This project uses Next.js with strict TypeScript enabled.
- Do not change the TypeScript configuration to disable `strict` or otherwise weaken type checking.
- Avoid using `any` and other weak typing patterns; always prefer precise, strongly-typed definitions.
- Follow the folder conventions of Next.js 13+ (e.g., `app/` and `src/` directories) already used in this repository.

# Testing
- Follow the existing testing style and tools used in this repository (for example, Jest and React Testing Library, if present).

# CI & Tooling
- Do not modify CI configuration files or pipelines unless explicitly requested by the user.