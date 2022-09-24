-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contents VARCHAR(510) NOT NULL,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE
);
