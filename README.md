# Polling API

Simple polling app for the backend internship challenge.

## Setup

```bash
npm install
npm start
```

Server runs on port 3000.

## Endpoints

**Create Poll**

```
POST /polls
{ "question": "your question?", "options": ["opt1", "opt2", "opt3"] }
```

**Get Poll**

```
GET /polls/:id
```

**Vote**

```
POST /polls/:id/vote
{ "user_id": "someuser", "option_id": 1 }
```

## One Vote Per User

Used a unique constraint in the database on (poll_id, user_id). Before inserting a vote, I check if that combo already exists. If it does, return error. If not, insert the vote.

The votes table looks like:

```sql
CREATE TABLE votes (
  id INTEGER PRIMARY KEY,
  poll_id INTEGER,
  option_id INTEGER,
  user_id TEXT,
  UNIQUE(poll_id, user_id)
);
```

So the database itself prevents duplicates. Also added a hasVoted() function that checks before trying to insert.

## Tech

- Node.js + Express
- SQLite

## Testing

```bash
npm test
```

Or test manually with curl.
