# WeTap

## API configuration

The API client defaults to `https://apiwetap.codknox.com`. Set
`VITE_API_BASE_URL` in the deployment environment if the API host differs.
Copy `.env.example` as a reference; do not put credentials or tokens in Vite
environment variables.

The captured API contracts currently wired into the app are organization login,
dashboard totals and charts, organization profile reads, user listing, and
user detail/status updates, subscription assignment/cancellation, and placed-card
order listing/creation. The card/request lists and other unsupported write
operations are not yet connected because the HAR does not contain enough
successful request/response examples for those flows.

## Local API mocks

Mock Service Worker can serve local fixtures for the endpoints listed above.
Create `.env.development.local` with:

```dotenv
VITE_API_BASE_URL=https://apiwetap.codknox.com
VITE_ENABLE_MOCK_API=true
```

Run `npm run dev`. Mocking is enabled only in the Vite development environment;
production builds always use the configured real API. The local login mock
accepts submitted credentials and returns a synthetic account and token. Do not
use mock mode to verify real authentication.

When mock mode is enabled, API routes without a local handler return HTTP 501
instead of being sent to the live API. Set `VITE_ENABLE_MOCK_API=false` (or omit
it) to use the real API.

## Development commands

- `npm run dev` starts the development server.
- `npm run lint` checks the source.
- `npm run build` creates the production build.
