# Peniel Beach Hotel

The hotel website includes a React guest experience and a persistent Express admin backend.

## Run locally

1. Copy `.env.example` to `.env` and change the admin password and JWT secret.
2. Run `npm install`.
3. Run `npm start` to start the website on port 3000 and API on port 5000. Use `API_PORT` if the backend port needs to change; `PORT` is reserved by Create React App.
4. Open `http://localhost:3000/admin` to manage the hotel.

The temporary development login is `admin` / `peniel2026` when no `.env` file is present. Never use those defaults in production.

The dashboard manages rooms, prices, capacity, facilities, photos, gallery content, and booking statuses. Hotel data is stored in MySQL; `server-data/store.json` is used only to seed a new empty database. Production media is stored in Cloudflare R2.

Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`. The API creates the database tables automatically. Set `REACT_APP_API_URL` to the deployed API address when the frontend and API use separate origins.

## PesaPal payments

Configure `PESAPAL_CONSUMER_KEY`, `PESAPAL_CONSUMER_SECRET`, and `PESAPAL_IPN_ID` on the server. Set `PESAPAL_ENV=live` for production or `PESAPAL_ENV=sandbox` for the PesaPal demo environment. Never place either credential in a `REACT_APP_*` variable.

Register the public HTTPS endpoint `https://your-domain/api/payments/ipn` as a GET IPN URL in PesaPal and place its generated ID in `PESAPAL_IPN_ID`. `API_PUBLIC_URL` is used for the customer callback, and `CLIENT_URL` is used for the final payment-result redirect. Both the callback and IPN query PesaPal before changing a booking's payment status.
