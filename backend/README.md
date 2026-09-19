# Restaurant Table Reservation System — Backend

NestJS + TypeORM + MySQL backend for a restaurant table reservation system.
Customers book a table for a date and time; staff manage tables and confirm,
complete, or cancel bookings.

## Tech stack

- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** MySQL (via XAMPP)
- **Auth:** JWT (Passport)
- **Testing:** Postman

## Setup

### 1. Start MySQL via XAMPP
Open the XAMPP Control Panel and start **MySQL**. Then open phpMyAdmin
(`http://localhost/phpmyadmin`) and create a database named
`restaurant_reservation_db` (or whatever you set in `.env`). You don't need
to create any tables — TypeORM creates them automatically on first run.

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` if your MySQL setup differs from XAMPP's defaults (e.g. you set
a root password).

### 3. Install and run
```bash
npm install
npm run start:dev
```
You should see `Backend running on http://localhost:3000` with no errors.
Check phpMyAdmin — you should now see four tables: `users`,
`restaurant_tables`, `reservations`, and TypeORM's internal migrations table
(if applicable).

## Roles

| Role | Can do |
|------|--------|
| `customer` | Register, log in, browse tables, book/view/edit/cancel their own reservations |
| `staff` | Everything a customer can, plus: manage tables, view all reservations, confirm/complete/cancel any reservation |
| `admin` | Everything staff can, plus: manage user accounts, delete tables |

New registrations are always `customer`. To make someone staff or admin,
an existing admin calls `PATCH /users/:id` with `{ "role": "staff" }`. For
your first admin account, register normally, then edit that user's role
directly in phpMyAdmin.

## Endpoints (20 total)

### Auth
| Method | Path | Access |
|--------|------|--------|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| GET | /auth/profile | Logged in |

### Users
| Method | Path | Access |
|--------|------|--------|
| GET | /users | Admin |
| GET | /users/:id | Admin |
| PATCH | /users/:id | Admin |
| DELETE | /users/:id | Admin |

### Tables
| Method | Path | Access |
|--------|------|--------|
| GET | /tables | Public |
| GET | /tables/available?status=available | Public |
| GET | /tables/:id | Public |
| POST | /tables | Staff, Admin |
| PATCH | /tables/:id | Staff, Admin |
| DELETE | /tables/:id | Admin |

### Reservations
| Method | Path | Access |
|--------|------|--------|
| POST | /reservations | Logged in |
| GET | /reservations | Staff, Admin |
| GET | /reservations/mine | Logged in |
| GET | /reservations/:id | Logged in |
| PATCH | /reservations/:id | Owner, Staff, Admin |
| PATCH | /reservations/:id/status | Staff, Admin |
| DELETE | /reservations/:id | Owner, Staff, Admin |

## Data flow example (for your video walkthrough)

`POST /reservations` with a Bearer token:

```
Postman → ReservationsController.create()
        → ReservationsService.create()
            → TablesService.findOne()      (confirms the table exists)
            → assertNoConflict()            (checks no clashing booking)
            → reservationsRepository.save() (writes to MySQL via TypeORM)
        ← returns the saved Reservation
← Postman shows the response
```

## Project structure
```
src/
├── auth/            # register, login, JWT strategy, guards, roles decorator
├── users/           # user entity + admin account management
├── tables/          # table entity + CRUD
├── reservations/    # reservation entity + booking logic (the conflict check lives here)
├── app.module.ts    # wires TypeORM to MySQL and imports every feature module
└── main.ts          # bootstrap, global validation pipe, CORS
```
