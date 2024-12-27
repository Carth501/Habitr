# **Habitr** (Habit & Goals Tracker)

A web application to help users create, track, and maintain habits or goals.

---

## Brief Description

**Habitr** allows users to:

- Create and manage a list of habits or goals
- Log progress daily or weekly
- Get visual insights into their progress
- Maintain motivation with streaks and achievement summaries

---

## Core Features

1. **User Authentication & Onboarding**

   - Basic sign-up and login
   - Profile management (name, photo)

2. **Habit Creation & Management**

   - Create, update, and delete habits
   - Set goals or frequencies (e.g., daily, weekly)
   - Optional reminders (mock or integrate a notification service)

3. **Progress Log**

   - Each habit has a daily/weekly check-in
   - Track streaks and total completions

4. **Dashboard & Analytics**

   - Visual progress (e.g., charts or graphs for trends)
   - Summary of achievements and streaks

5. **Responsive UI**

   - Tailwind CSS for quick styling
   - shadcn/ui for polished components (e.g., modals, dialogs, etc.)

6. **Global State Management**
   - zustand for storing user data and habits
   - Simple, clear structure compared to Redux

---

## Tech Stack & How They Fit

- **Vite**: A fast, lightweight tool for bundling and development. It offers a quick dev server and optimized builds for production.
- **React**: The fundamental library for building UI components and managing the overall page structure.
- **TypeScript**: Adds type safety and clarity, making the project more reliable and maintainable.
- **Tailwind CSS**: Utility-first styling for quick and consistent designs.
- **shadcn/ui**: Provides prebuilt, accessible components aligned with Tailwind, reducing custom CSS overhead.
- **zustand**: Lightweight global state management for user data, habit lists, and other shared state.

---

## Feature Breakdown

1. **Authentication Flow**

   - Simple sign-up/log-in forms (react-hook-form, Zod for validation)
   - Storing user data in zustand or local storage

2. **Habit CRUD**

   - A habit list with “Add Habit”
   - Habit creation form:
     - Title (required, trim whitespace)
     - Frequency (daily, weekly, etc.)
     - Optional deadlines or reminders
   - Edit or delete habit functionality

3. **Progress Logging**

   - Check-in system for each habit (daily or weekly)
   - Automated streak counting
   - Summaries over specified periods

4. **Analytics Dashboard**

   - Graphs or charts showing progress trends
   - Highlight streaks, completion counts, and achievements

5. **Responsive & Polished UI**
   - Tailwind + shadcn/ui for a modern, cohesive look
   - Clear navigation and concise layout
