CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate INTEGER,
  service_area VARCHAR(255),
  profile_photo_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id)
);
