# Backend (NestJS)

REST API for the Game Feedback Platform.

See the root [README](../README.md) for full setup instructions.

## Scripts

```bash
npm run start:dev      # watch mode
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
npm run prisma:studio
```

## Health check

`GET http://localhost:3001/api/health` → `{ "status": "ok" }`
