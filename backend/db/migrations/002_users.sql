CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (
    role IN (
      'customer',
      'home_cook',
      'tutor',
      'beautician',
      'cleaning',
      'admin'
    )
  ),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
