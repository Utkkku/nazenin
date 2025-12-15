-- Nazeninyaeverflora Database Schema
-- Supabase SQL Editor'da bu dosyayı çalıştırın

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('white', 'brown', 'green', 'pink')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Policies: Allow public insert/update/delete for products (admin operations)
-- Note: In production, you should add authentication and restrict this
CREATE POLICY "Products are editable by everyone"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policies: Allow public insert for orders (customers can place orders)
CREATE POLICY "Orders are insertable by everyone"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Policies: Allow public read access to orders (admin can view)
CREATE POLICY "Orders are viewable by everyone"
  ON orders FOR SELECT
  USING (true);

-- Policies: Allow public update/delete for orders (admin operations)
CREATE POLICY "Orders are editable by everyone"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default products (optional - can be done via admin panel)
INSERT INTO products (name, category, price, image, description, color) VALUES
  ('Sonsuz İpek Şakayık', 'Silk Masterpiece', 2850, 'https://images.unsplash.com/photo-1563241527-3004b7be025b?q=80&w=800', 'Su istemez, güneş beklemez. Yıllarca ilk günkü zarafetini korur.', 'pink'),
  ('Ebedi Pampas Otu', 'Dried Collection', 1450, 'https://images.unsplash.com/photo-1596627006856-114757595513?q=80&w=800', 'Dökülme yapmayan özel işlem. Bohem ve zamansız bir dokunuş.', 'brown'),
  ('İpek Dokunuşlu Orkide', 'Real-Touch Series', 3200, 'https://images.unsplash.com/photo-1566927467984-6332be7377d0?q=80&w=800', 'Gerçeğinden ayırt edilemeyen doku. Evinizin kalıcı mücevheri.', 'white'),
  ('Miras Pamuk Dalları', 'Natural Dried', 950, 'https://images.unsplash.com/photo-1516205651411-84f31072aa0e?q=80&w=800', 'Doğal kurutulmuş, %100 organik pamuk. Saf ve yalın güzellik.', 'white'),
  ('Silver Dollar Okaliptüs', 'Faux Greenery', 1100, 'https://images.unsplash.com/photo-1598522338166-70e0a5585d82?q=80&w=800', 'Soğuk yeşil tonlarıyla minimalist alanlar için ideal tamamlayıcı.', 'green'),
  ('Kurutulmuş Ortanca', 'Dried Collection', 1650, 'https://images.unsplash.com/photo-1595356269931-d8579979b009?q=80&w=800', 'Vintage görünümü sevenler için, sonbaharın en güzel tonları.', 'pink'),
  ('Zeytin Dalı Demeti', 'Faux Greenery', 1350, 'https://images.unsplash.com/photo-1463936575229-469941621863?q=80&w=800', 'Akdeniz esintisi. Barışın ve doğallığın simgesi yapay zeytin dalları.', 'green'),
  ('Yabani Kuru Başaklar', 'Dried Collection', 850, 'https://images.unsplash.com/photo-1621980649733-1ec9413247c4?q=80&w=800', 'Altın sarısı tonlarıyla evinize sıcaklık ve bereket katar.', 'brown')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

