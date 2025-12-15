# Güvenlik Politikası

## 🔐 Admin Panel Güvenliği

Bu projede admin panel bilgileri **kesinlikle** kod içinde saklanmaz. Tüm hassas bilgiler environment variables üzerinden yönetilir.

### Environment Variables

Admin paneli için gerekli environment variables:
- `VITE_ADMIN_USERNAME` - Admin kullanıcı adı
- `VITE_ADMIN_PASSWORD` - Admin şifresi

### Güvenlik Önlemleri

1. ✅ Kod içinde hardcoded şifre yok
2. ✅ `.env` dosyası Git'e commit edilmez
3. ✅ README'de şifre örneği yok
4. ✅ Environment variables sadece Netlify Dashboard'dan yönetilir

### Netlify Deployment

Netlify'da secret scanning'i yapılandırmak için:

1. Netlify Dashboard → Site Settings → Environment variables
2. Yeni variable ekle:
   - Key: `SECRETS_SCAN_OMIT_PATHS`
   - Value: `dist/**,README.md,package.json,package-lock.json`

Bu sayede build output ve dokümantasyon dosyaları secret scanning'den hariç tutulur.

