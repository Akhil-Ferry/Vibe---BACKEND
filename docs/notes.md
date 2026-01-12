# Project Notes

## What it does

Basic polling app. Users create polls, other users vote.

## Tech

- Node.js + Express
- SQLite database
- No auth (just user_id strings)

## How voting works

Uses a votes table that stores poll_id + user_id combos. Database constraint prevents duplicate votes.
