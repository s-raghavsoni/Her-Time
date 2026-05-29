CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY,

  customer_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  provider_user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  message TEXT,

  service_date TIMESTAMP NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending',
      'accepted',
      'rejected',
      'completed'
    )),

  created_at TIMESTAMP DEFAULT NOW()
);