# Peniel Beach Hotel

The hotel website includes a React guest experience and a persistent Express admin backend.

## Run locally

1. Copy `.env.example` to `.env` and change the admin password and JWT secret.
2. Run `npm install`.
3. Run `npm start` to start the website on port 3000 and API on port 5000. Use `API_PORT` if the backend port needs to change; `PORT` is reserved by Create React App.
4. Open `http://localhost:3000/admin` to manage the hotel.

The temporary development login is `admin` / `peniel2026` when no `.env` file is present. Never use those defaults in production.

The dashboard manages rooms, prices, capacity, facilities, photos, gallery content, and booking statuses. Hotel data is stored in MySQL; `server-data/store.json` is used only to seed a new empty database. Runtime images are stored in `uploads` and served by the API at `/uploads`.

Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`. The API creates the database tables automatically. For a multi-instance production deployment, move local uploads to object storage. Set `REACT_APP_API_URL` to the deployed API address when building the frontend.

## Flutterwave card payments

Live payments require a live `FLWSECK-...` secret key, `NODE_ENV=production`, and public HTTPS values for `API_PUBLIC_URL` and `CLIENT_URL`. The API rejects Flutterwave test keys in production.

Set `FLW_SECRET_KEY`, `FLW_SECRET_HASH`, and the public backend URL in `API_PUBLIC_URL`. In Flutterwave, configure the webhook URL as `https://your-api-domain/api/payments/webhook`, use the same secret hash, enable webhook retries, and turn off “Disable preferred payment methods” so the API's card-only payment option is respected. Never place a Flutterwave secret key in a `REACT_APP_*` variable.
