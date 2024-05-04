# Assignment

## Technologies Used

### Frontend

- React.js
- React Router Dom for routing
- Tailwind CSS for styling
- Radix UI

### Backend

- Node.js
- Express.js for handling server-side logic
- Sqlite for the database
- Prisma orm for database operations
- Multer for file uploads

## Installation

Follow these steps to set up your environment and run the project locally.

First you have to clone the repo

```bash
git clone https://github.com/DGCP3/nati.git && cd nati
```

### Backend Setup

- Navigate to the backend directory:

```bash
 cd backend
```

- Install the dependencies:

```bash
npm install
```

- Create a `.env.local` file in the backend directory and add the following:

```bash
DATABASE_URL="file:./dev.db"
```

- Push the database schema to the database:

```bash
npm run db:push
```

- Generate the Prisma client:

```bash
npm run db:generate
```

- Start the server:

```bash
npm run start
```

### Frontend Setup

- cd frontend

```bash
  cd frontend
```

- Install the dependencies:

```bash
  npm install
```

- build the project

```bash
  npm run build
```

- Start the development server:

```bash
  npm run preview
```
