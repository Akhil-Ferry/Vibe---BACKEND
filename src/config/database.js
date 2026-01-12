const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../polls.db');
const db = new sqlite3.Database(dbPath);

// setup tables
db.serialize(() => {
  // polls table
  db.run(`
    CREATE TABLE IF NOT EXISTS polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // options table
  db.run(`
    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      option_text TEXT NOT NULL,
      FOREIGN KEY (poll_id) REFERENCES polls(id)
    )
  `);

  // votes table
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      option_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (poll_id) REFERENCES polls(id),
      FOREIGN KEY (option_id) REFERENCES options(id),
      UNIQUE(poll_id, user_id)
    )
  `);
});

// create poll
function createPoll(question, options, callback) {
  db.run('INSERT INTO polls (question) VALUES (?)', [question], function (err) {
    if (err) return callback(err);

    const pollId = this.lastID;
    const stmt = db.prepare('INSERT INTO options (poll_id, option_text) VALUES (?, ?)');

    let completed = 0;
    options.forEach(opt => {
      stmt.run([pollId, opt], (err) => {
        if (err) return callback(err);
        completed++;
        if (completed === options.length) {
          stmt.finalize();
          callback(null, pollId);
        }
      });
    });
  });
}

// get poll with vote counts
function getPoll(pollId, callback) {
  db.get('SELECT * FROM polls WHERE id = ?', [pollId], (err, poll) => {
    if (err) return callback(err);
    if (!poll) return callback(null, null);

    db.all(`
      SELECT o.id, o.option_text, COUNT(v.id) as votes
      FROM options o
      LEFT JOIN votes v ON o.id = v.option_id
      WHERE o.poll_id = ?
      GROUP BY o.id
    `, [pollId], (err, options) => {
      if (err) return callback(err);

      callback(null, {
        id: poll.id,
        question: poll.question,
        options: options.map(o => ({
          id: o.id,
          text: o.option_text,
          votes: o.votes
        }))
      });
    });
  });
}

// check if user voted
function hasVoted(pollId, userId, callback) {
  db.get(
    'SELECT id FROM votes WHERE poll_id = ? AND user_id = ?',
    [pollId, userId],
    (err, row) => {
      if (err) return callback(err);
      callback(null, !!row);
    }
  );
}

// add vote
function addVote(pollId, userId, optionId, callback) {
  db.run(
    'INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)',
    [pollId, optionId, userId],
    callback
  );
}

module.exports = {
  createPoll,
  getPoll,
  hasVoted,
  addVote
};
