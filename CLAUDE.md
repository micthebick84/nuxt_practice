# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run lint         # Run ESLint with auto-fix
npm run preview      # Preview production build
```

## Architecture

This is a Nuxt 3 application with Quasar UI framework, Pinia state management, and vue-i18n for internationalization.

### Key Configuration
- **API Proxy**: All `/api` requests proxy to `http://localhost:8080` (backend server)
- **SSR**: Server-side rendering is enabled
- **Auto-imports**: `defineStore`, `acceptHMRUpdate` from Pinia, and `useI18n` from vue-i18n are auto-imported

### Layouts
- `default.vue` - Main layout with Quasar navigation header, language switcher, and logout
- `admin.vue` - Admin section layout
- `custom.vue` - Custom layout variant
- `empty.vue` - Minimal layout

### Authentication
- Auth state managed via Pinia store (`stores/auth.ts`)
- Auth middleware (`middleware/auth.ts`) protects routes
- Public pages: `/login`, `/signup`, `/about`
- Auth state persisted to localStorage on client

### Internationalization
- Plugin at `plugins/i18n.ts` provides English and Korean translations
- Use `const { t, locale } = useI18n()` in components
- Translation keys defined inline in the plugin

### Composables Pattern
- `useCourses()` - Returns list of all courses
- `useCourse(slug)` - Returns course with prev/next navigation

### Types
- Types defined in `types/` directory
- Global types in `types/global.d.ts` and `types/index.d.ts`
- `Maybe<T>` type available globally for nullable values

### Code Style
- ESLint + Prettier configured
- Single quotes, semicolons, 2-space tabs, trailing commas
- Vue single-file components use `<script setup lang="ts">`
