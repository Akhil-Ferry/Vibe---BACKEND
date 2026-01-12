const express = require('express');
const db = require('./config/database');

const app = express();
app.use(express.json());

// make new poll
app.post('/polls', (req, res) => {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: 'need question and at least 2 options' });
    }

    db.createPoll(question, options, (err, pollId) => {
        if (err) {
            return res.status(500).json({ error: 'failed to create poll' });
        }

        db.getPoll(pollId, (err, poll) => {
            if (err) {
                return res.status(500).json({ error: 'created but cant fetch' });
            }
            res.status(201).json(poll);
        });
    });
});

// get poll by id
app.get('/polls/:id', (req, res) => {
    const pollId = req.params.id;

    db.getPoll(pollId, (err, poll) => {
        if (err) {
            return res.status(500).json({ error: 'database error' });
        }
        if (!poll) {
            return res.status(404).json({ error: 'poll not found' });
        }
        res.json(poll);
    });
});

// vote on poll
app.post('/polls/:id/vote', (req, res) => {
    const pollId = req.params.id;
    const { user_id, option_id } = req.body;

    if (!user_id || !option_id) {
        return res.status(400).json({ error: 'need user_id and option_id' });
    }

    // check if already voted
    db.hasVoted(pollId, user_id, (err, voted) => {
        if (err) {
            return res.status(500).json({ error: 'check failed' });
        }
        if (voted) {
            return res.status(400).json({ error: 'already voted' });
        }

        // add vote
        db.addVote(pollId, user_id, option_id, (err) => {
            if (err) {
                return res.status(500).json({ error: 'vote failed' });
            }

            db.getPoll(pollId, (err, poll) => {
                if (err) {
                    return res.status(500).json({ error: 'voted but cant fetch' });
                }
                res.json(poll);
            });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
