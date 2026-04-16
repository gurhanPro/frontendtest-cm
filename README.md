# Dog Breed Explorer

Deployed at https://cloudsmiths-frontend.pages.dev

## Setup

```bash
npm install
npm run dev
```

### Test Credentials

Username: `emilys` | Password: `emilyspass`

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm test` - unit tests
- `npm run test:e2e` - e2e tests
- `npm run lint` - eslint
- `npm run audit` - check vulnerable packages

## Features

- Browse and search dog breeds with debounced filtering
- View 3 random images per breed with in-memory caching
- Authentication with JWT access/refresh tokens
- Protected routes
- Favourite/unfavourite images (NestJS backend)
- Sentry error tracking and performance monitoring
- Unit tests (Vitest) and e2e tests (Playwright)
- CI/CD with GitHub Actions (lint, test, audit, deploy to Cloudflare Pages)
- SCSS Modules with responsive design
