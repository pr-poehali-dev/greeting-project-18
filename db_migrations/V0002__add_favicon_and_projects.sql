ALTER TABLE sites ADD COLUMN favicon_url TEXT;

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    html_code TEXT NOT NULL,
    css_code TEXT NOT NULL,
    js_code TEXT NOT NULL,
    favicon_url TEXT,
    user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
