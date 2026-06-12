CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage site settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO site_settings (key, value) VALUES ('home_photo', '');
