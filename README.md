# Argent Bank - OpenClassrooms Project 10

This repository contains the original Argent Bank backend API and a Vite React
frontend for the OpenClassrooms Argent Bank project.

## Project Structure

```text
.
├── server/                  # Existing Express/MongoDB backend
├── frontend/                # Vite React frontend
├── designs/                 # Original static HTML, CSS, images, and wireframes
├── docs/
│   └── swagger-transactions.yaml
├── swagger.yaml             # Existing backend Swagger file
└── package.json             # Backend scripts and root frontend helper scripts
```

## Prerequisites

- Node.js
- MongoDB Community Server running locally on `localhost:27017`

## Install And Run

### Backend

```bash
npm install
npm run dev:server
npm run populate-db
```

The backend runs at:

```text
http://localhost:3001
```

The existing backend API documentation is available at:

```text
http://localhost:3001/api-docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

You can also run the frontend from the repository root:

```bash
npm run frontend:dev
```

## Test Accounts

Tony Stark:

```text
email: tony@stark.com
password: password123
```

Steve Rogers:

```text
email: steve@rogers.com
password: password456
```

## Features

- React frontend built with Vite
- React Router navigation
- Redux Toolkit and React Redux global state
- Axios API integration
- Login and logout
- Protected profile page
- User profile loading from the backend
- Edit user first name and last name
- Static account cards from the provided design
- Reused static CSS and image assets from `/designs`
- Swagger transaction API proposal

## Swagger

The transaction API proposal is located at:

```text
docs/swagger-transactions.yaml
```

It documents proposed endpoints for:

- Viewing current-month transactions grouped by account
- Viewing a single transaction
- Adding transaction metadata
- Editing transaction metadata
- Deleting transaction metadata

This proposal is documentation only. The transaction endpoints are not
implemented in the backend.

## Manual Testing Checklist

Run through this checklist before submission:

- [ ] Can access `/`
- [ ] Can go to `/login` (`/sign-in` is also supported)
- [ ] Login works with a seeded test account
- [ ] Wrong password shows an error
- [ ] Successful login redirects to `/profile`
- [ ] Profile data loads from the backend
- [ ] Edit name works and saves through the API
- [ ] Data persists after refresh
- [ ] Logout works
- [ ] `/profile` and `/user` redirect to `/login` when not logged in

## Notes

The backend requires MongoDB to be running before `npm run dev:server` and
`npm run populate-db` will work. If MongoDB is not running, the backend will
crash while connecting to `mongodb://localhost/argentBankDB`.
