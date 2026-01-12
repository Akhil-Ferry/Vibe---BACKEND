# API Examples

## Make a poll

POST /polls

```json
{
  "question": "best framework?",
  "options": ["react", "vue", "angular"]
}
```

Response:

```json
{
  "id": 1,
  "question": "best framework?",
  "options": [
    { "id": 1, "text": "react", "votes": 0 },
    { "id": 2, "text": "vue", "votes": 0 },
    { "id": 3, "text": "angular", "votes": 0 }
  ]
}
```

## Vote

POST /polls/1/vote

```json
{
  "user_id": "alice",
  "option_id": 2
}
```

## Get poll

GET /polls/1

Shows question, options, and current vote counts.
