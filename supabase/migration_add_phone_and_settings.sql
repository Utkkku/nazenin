-- Migration: Add phone field to orders and create settings table
-- Bu scripti mevcut schema üzerinde çalıştırabilirsiniz

-- 1. Add phone column to orders table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'phone'
    ) THEN
        ALTER TABLE orders ADD COLUMN phone TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- 2. Create settings table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Enable Row Level Security for settings (if not already enabled)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies for settings if they exist, then recreate
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON settings;
DROP POLICY IF EXISTS "Settings are editable by everyone" ON settings;

-- 5. Create policies for settings
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

-- ⚠️ SECURITY WARNING: In production, you MUST restrict this policy!
-- Recommended: Use Supabase Auth and restrict to authenticated admin users only
-- Example: USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true')
CREATE POLICY "Settings are editable by everyone"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Insert default settings (if they don't exist)
INSERT INTO settings (key, value) VALUES
  ('iban', 'TR00 0000 0000 0000 0000 0000 00'),
  ('account_holder_name', 'Nazeninyaeverflora')
ON CONFLICT (key) DO NOTHING;

-- 7. Create trigger for settings updated_at (if it doesn't exist)
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
