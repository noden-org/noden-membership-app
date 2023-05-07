# Noden Membership and Check-in App

## Non developer 🤔

This is where we build the Noden membership app. If you just want to use it. Go to the link [here 🚀](https://membership.noden.org)

## Hello developer 🧑‍💻

This web app lets members sign up, manage and check their memberships. It also lets workshop leaders check memberships during workshops. It works by reaching out the [Moonclerk API](https://github.com/moonclerk/developer/blob/main/api/README.md) which we use for managing subscriptions, and checks for name and email against the active membership database.

A server side app is needed here, because the Moonclerk API returns all of the users with a lot of sensitive information. The webpage simply queries the server side app with a name/email, and the server only returns whether or not they have an active membership. 

The app is built using [Node.js](https://nodejs.org/en) and includes a static webpage which reaches out the backend portion of the app. That's where the Moonclerk API requests are processed and filtered before displaying to the user.

## Get started

### Prerequisites

- Node.js >= 16

### Install dependencies

```sh
npm install
```

### Starting the development server

The following command starts the frontend at http://localhost:3000 and the backend at http://localhost:3001.

```sh
npm run dev
```

### Building the application locally

To create a production build of the application locally, run the following:

```sh
npm run build-local && npm run start-local
```

### Add the Moonclerk API key

1. Rename `.env.template` to `.env`
1. Update the value of the `MOONCLERK_API_KEY` to the real key. It should look something like this: `56772fc8d647856b7204ebc25346a6a0`.

### Run on http://localhost:3000

```sh
npn run dev
```

### Real deployment

The app is currently deployed on [Railway](https://railway.app). Reach out to [Raj](https://github.com/siliconwitch) or [Julian](https://github.com/sigalor) for access.
