# Poll App API

Simple polling system built with Node.js and SQLite.

## Setup

```bash
npm install
npm start
```

Server runs on port 3000.

## Endpoints

- `POST /polls` - make new poll
- `GET /polls/:id` - get poll info
- `POST /polls/:id/vote` - vote on poll

## Testing

```bash
npm test
```

## Database

Uses SQLite. File: `polls.db` (auto-created)

## Features

- Create polls with multiple options
- Vote tracking
- Users can only vote once per poll
