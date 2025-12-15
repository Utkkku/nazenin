# Supabase Kurulum Rehberi

Bu proje Supabase kullanarak farklı cihazlar arasında veri senkronizasyonu sağlar.

## 📋 Adımlar

### 1. Supabase Projesi Oluştur

1. [Supabase](https://supabase.com) sitesine git ve hesap oluştur
2. "New Project" butonuna tıkla
3. Proje bilgilerini gir:
   - **Name:** nazeninyaeverflora
   - **Database Password:** Güçlü bir şifre seç
   - **Region:** En yakın bölgeyi seç
4. "Create new project" butonuna tıkla

### 2. Database Schema Oluştur

1. Supabase Dashboard'da sol menüden **SQL Editor**'a git
2. `supabase/schema.sql` dosyasındaki tüm SQL kodunu kopyala
3. SQL Editor'a yapıştır ve **Run** butonuna tıkla
4. Tablolar ve politikalar oluşturulacak

### 3. Environment Variables Ekle

Supabase Dashboard'da:
1. Sol menüden **Settings** → **API**'ye git
2. Şu bilgileri kopyala:
   - **Project URL** (örn: `https://xxxxx.supabase.co`)
   - **anon public** key

### 4. Netlify Environment Variables

Netlify Dashboard'da:
1. Site Settings → **Environment variables**'a git
2. Şu değişkenleri ekle:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Local Development

Proje kökünde `.env` dosyası oluştur (`.env.example` yoksa):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_USERNAME=nazenin
VITE_ADMIN_PASSWORD=09Nazenin022022
```

**Önemli:** `.env` dosyası Git'e commit edilmez (`.gitignore` içinde).

## 🔄 Real-time Sync

Supabase real-time subscriptions sayesinde:
- Admin panelinden yapılan değişiklikler **anında** tüm cihazlarda görünür
- Yeni siparişler **otomatik** olarak admin paneline gelir
- Ürün ekleme/silme işlemleri **gerçek zamanlı** senkronize olur

## 🔐 Güvenlik

- Row Level Security (RLS) aktif
- Public read/write politikaları var (production'da authentication eklenebilir)
- Admin şifreleri environment variables'da saklanır

## 🚀 Deployment Sonrası

Netlify deploy sonrası:
1. Environment variables'ların doğru eklendiğini kontrol et
2. Supabase Dashboard'da **Realtime** özelliğinin aktif olduğunu kontrol et
3. Test et: Bir cihazdan ürün ekle, diğer cihazdan kontrol et

## 📝 Notlar

- Supabase yapılandırılmazsa, sistem localStorage'a fallback yapar
- İlk yüklemede varsayılan ürünler otomatik eklenir
- Real-time sync için Supabase Realtime özelliği aktif olmalı

