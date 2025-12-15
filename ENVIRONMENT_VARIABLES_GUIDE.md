# Environment Variables (EV) Kurulum Rehberi

Bu rehber, Netlify ve Supabase için gerekli environment variables'ları nasıl ekleyeceğini adım adım açıklar.

## 📋 Gerekli Environment Variables Listesi

Toplam **4 adet** environment variable eklemen gerekiyor:

1. `VITE_SUPABASE_URL` - Supabase proje URL'i
2. `VITE_SUPABASE_ANON_KEY` - Supabase anon (public) key
3. `VITE_ADMIN_USERNAME` - Admin panel kullanıcı adı
4. `VITE_ADMIN_PASSWORD` - Admin panel şifresi

---

## 🔵 ADIM 1: Supabase Bilgilerini Al

### 1.1 Supabase'e Giriş Yap
1. https://supabase.com adresine git
2. Hesabın varsa giriş yap, yoksa "Start your project" ile ücretsiz hesap oluştur

### 1.2 Yeni Proje Oluştur (Eğer henüz oluşturmadıysan)
1. Dashboard'da **"New Project"** butonuna tıkla
2. Formu doldur:
   - **Name:** `nazeninyaeverflora` (veya istediğin isim)
   - **Database Password:** Güçlü bir şifre seç (kaydet, unutma!)
   - **Region:** En yakın bölgeyi seç (örn: `West US`, `Europe West`)
3. **"Create new project"** butonuna tıkla
4. Proje oluşturulmasını bekle (2-3 dakika sürebilir)

### 1.3 API Bilgilerini Bul
1. Sol menüden **Settings** (⚙️ ikonu) → **API**'ye tıkla
2. Şu iki bilgiyi kopyala (not defterine kaydet):

   **a) Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   (Bu URL'i kopyala, örnek: `https://abcdefghijklmnop.supabase.co`)

   **b) anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   (Bu uzun key'i kopyala - "anon" veya "public" yazan kısımdan)

---

## 🟢 ADIM 2: Netlify Dashboard'a Git

### 2.1 Netlify Sitesine Eriş
1. https://app.netlify.com adresine git
2. Giriş yap (GitHub hesabınla giriş yapabilirsin)

### 2.2 Site'ını Bul
1. Dashboard'da **"nazenin"** (veya site adın) projesini bul
2. Site'ına tıkla (site adına veya preview görseline tıkla)

### 2.3 Environment Variables Bölümüne Git
1. Üst menüden **"Site settings"** butonuna tıkla
2. Sol menüden **"Environment variables"** sekmesine tıkla
3. Şu anda muhtemelen sadece `VITE_ADMIN_USERNAME` ve `VITE_ADMIN_PASSWORD` var

---

## 🟡 ADIM 3: Environment Variables Ekle

### 3.1 VITE_SUPABASE_URL Ekle
1. **"Add a variable"** butonuna tıkla
2. **Key** kısmına yaz: `VITE_SUPABASE_URL`
3. **Value** kısmına yapıştır: Supabase'den kopyaladığın Project URL
   - Örnek: `https://abcdefghijklmnop.supabase.co`
4. **"Add variable"** butonuna tıkla

### 3.2 VITE_SUPABASE_ANON_KEY Ekle
1. Tekrar **"Add a variable"** butonuna tıkla
2. **Key** kısmına yaz: `VITE_SUPABASE_ANON_KEY`
3. **Value** kısmına yapıştır: Supabase'den kopyaladığın anon public key
   - Örnek: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (uzun bir string)
4. **"Add variable"** butonuna tıkla

### 3.3 VITE_ADMIN_USERNAME Kontrol Et
1. Zaten ekli olmalı, kontrol et
2. **Key:** `VITE_ADMIN_USERNAME`
3. **Value:** `nazenin` (eğer yoksa ekle)

### 3.4 VITE_ADMIN_PASSWORD Kontrol Et
1. Zaten ekli olmalı, kontrol et
2. **Key:** `VITE_ADMIN_PASSWORD`
3. **Value:** `09Nazenin022022` (eğer yoksa ekle)

---

## ✅ ADIM 4: Kontrol ve Deploy

### 4.1 Tüm Variables'ları Kontrol Et
Şu 4 variable'ın hepsi listede olmalı:

```
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
✅ VITE_ADMIN_USERNAME
✅ VITE_ADMIN_PASSWORD
```

### 4.2 Deploy Context Kontrolü
Her variable'ın yanında **"Deploy context"** görünür. Şunları kontrol et:

- **Production** context'inde değer var mı? (En önemlisi bu!)
- **Deploy Previews** ve **Branch deploys** için de eklemek isteyebilirsin (opsiyonel)

**Önemli:** Eğer sadece Production'da varsa, yeni deploy'da kullanılır. Diğer context'lerde de olmasını istiyorsan, her variable'ın yanındaki **"Options"** → **"Edit"** ile ekleyebilirsin.

### 4.3 Yeni Deploy Başlat
1. Netlify Dashboard'da **"Deploys"** sekmesine git
2. **"Trigger deploy"** → **"Deploy site"** butonuna tıkla
3. Veya GitHub'a yeni bir commit push et (otomatik deploy başlar)

---

## 🔍 ADIM 5: Test Et

### 5.1 Site'i Aç
1. Netlify Dashboard'da site URL'ine tıkla
2. Site açılmalı

### 5.2 Console'u Kontrol Et
1. Tarayıcıda **F12** tuşuna bas (Developer Tools)
2. **Console** sekmesine git
3. Şu mesajları kontrol et:
   - ✅ "Supabase connected" gibi bir mesaj görürsen → Başarılı!
   - ❌ "Supabase URL veya Anon Key bulunamadı" görürsen → Environment variables eksik

### 5.3 Admin Panel Test
1. Footer'dan **"Yönetici Girişi"** butonuna tıkla
2. Kullanıcı adı: `nazenin`
3. Şifre: `09Nazenin022022`
4. Giriş yapabilmelisin

### 5.4 Supabase Test
1. Admin panelinde bir ürün ekle
2. Supabase Dashboard → **Table Editor** → **products** tablosuna git
3. Eklediğin ürünü görebilmelisin

---

## 🚨 Sorun Giderme

### Sorun: "Supabase URL veya Anon Key bulunamadı"
**Çözüm:**
- Netlify Dashboard'da environment variables'ları kontrol et
- Variable isimlerinin tam olarak doğru olduğundan emin ol (büyük/küçük harf duyarlı!)
- Yeni bir deploy başlat (environment variables sadece yeni deploy'larda aktif olur)

### Sorun: "Failed to load products from Supabase"
**Çözüm:**
- Supabase Dashboard → **SQL Editor**'a git
- `supabase/schema.sql` dosyasındaki SQL'i çalıştırdığından emin ol
- **Table Editor**'da `products` tablosunun oluşturulduğunu kontrol et

### Sorun: "Row Level Security policy violation"
**Çözüm:**
- Supabase Dashboard → **Authentication** → **Policies**
- `products` ve `orders` tabloları için politikaların aktif olduğunu kontrol et
- `supabase/schema.sql` dosyasındaki CREATE POLICY komutlarını çalıştırdığından emin ol

---

## 📝 Özet Checklist

- [ ] Supabase projesi oluşturuldu
- [ ] Supabase Project URL kopyalandı
- [ ] Supabase anon public key kopyalandı
- [ ] Netlify Dashboard'a giriş yapıldı
- [ ] Site settings → Environment variables'a gidildi
- [ ] `VITE_SUPABASE_URL` eklendi
- [ ] `VITE_SUPABASE_ANON_KEY` eklendi
- [ ] `VITE_ADMIN_USERNAME` kontrol edildi/eklendi
- [ ] `VITE_ADMIN_PASSWORD` kontrol edildi/eklendi
- [ ] Yeni deploy başlatıldı
- [ ] Site test edildi
- [ ] Console'da hata yok
- [ ] Admin panel çalışıyor
- [ ] Supabase'de veri görünüyor

---

## 💡 İpuçları

1. **Environment variables sadece yeni deploy'larda aktif olur** - Eski deploy'da değişiklik görünmez
2. **Variable isimleri büyük/küçük harf duyarlıdır** - Tam olarak `VITE_SUPABASE_URL` şeklinde yaz
3. **Supabase anon key güvenlidir** - Public olarak kullanılabilir, ama service_role key'ini asla paylaşma
4. **Production context en önemlisi** - Diğer context'ler (preview, branch) opsiyonel

---

## 🆘 Yardım

Eğer hala sorun yaşıyorsan:
1. Netlify Dashboard → Deploys → En son deploy'ın loglarını kontrol et
2. Browser Console'da hata mesajlarını kontrol et
3. Supabase Dashboard → Logs → API logs'u kontrol et

