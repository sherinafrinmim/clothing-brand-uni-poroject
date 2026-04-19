# Ecommerce API (Express + MySQL)

## Setup

1. Install dependencies:
   - `npm install`
2. Set up MySQL database:
   - Create a MySQL database (default: `ecommerce_db`)
3. Create env file:
   - `cp .env.example .env`
4. Update `.env` values if needed.
5. Start dev server:
   - `npm run dev`

## Environment Variables

- `DB_HOST`: MySQL host (default: localhost)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: MySQL database name (default: ecommerce_db)
- `JWT_SECRET`: JWT secret key
- `PORT`: Server port (default: 5000)

## Main Endpoints

- Users: `/api/users`
  - `POST /register`
  - `POST /login`
  - `GET /profile` (auth)
  - `GET /` (admin)
- Categories: `/api/categories`
  - `GET /`
  - `POST /` (admin)
  - `PUT /:id` (admin)
  - `DELETE /:id` (admin)
- Products: `/api/products`
  - `GET /`
  - `GET /:id`
  - `POST /` (admin)
  - `PUT /:id` (admin)
  - `DELETE /:id` (admin)
- Orders: `/api/orders`
  - `POST /` (auth)
  - `GET /my` (auth)
  - `GET /` (admin)
  - `PUT /:id/status` (admin)

## Notes

- Auth uses JWT in `Authorization: Bearer <token>`.
- Order creation decreases product stock.
