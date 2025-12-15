# Nazeninyaeverflora

Lüks yapay çiçek e-ticaret platformu. Solmayan zarafet, evinizin mücevheri.

## 🚀 Teknolojiler

- **React 19** - Modern UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon seti

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Environment variables'ı ayarla
cp .env.example .env
# .env dosyasını düzenle ve admin bilgilerini girin

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Build'i önizle
npm run preview
```

## 🔐 Güvenlik

Admin panel bilgileri environment variables ile yönetilir. `.env` dosyası Git'e commit edilmez (`.gitignore` içinde).

**Önemli:** Production'da Netlify dashboard'dan environment variables ekleyin:
- `VITE_ADMIN_USERNAME`
- `VITE_ADMIN_PASSWORD`

## 🌐 Deployment

Bu proje Netlify üzerinden deploy edilmek üzere yapılandırılmıştır.

### Netlify Deploy Adımları

1. GitHub repository'yi oluştur ve projeyi push et:
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

2. Netlify dashboard'a git ve "New site from Git" seçeneğini kullan
3. GitHub repository'ni bağla
4. **Environment Variables** ekle (Netlify Dashboard → Site Settings → Environment variables):
   - `VITE_ADMIN_USERNAME` = [kullanıcı adınız]
   - `VITE_ADMIN_PASSWORD` = [şifreniz]
5. Build ayarları otomatik algılanacak (`netlify.toml` sayesinde)
6. Deploy butonuna tıkla

## 📁 Proje Yapısı

```
nazeninyaeverflora/
├── public/           # Statik dosyalar (görseller)
├── src/
│   ├── App.tsx      # Ana uygulama bileşeni
│   ├── main.tsx     # React entry point
│   ├── index.css    # Global stiller
│   └── vite-env.d.ts # Environment variable tipleri
├── index.html       # HTML template
├── tailwind.config.js
├── netlify.toml     # Netlify yapılandırması
├── package.json
└── README.md
```

## ✨ Özellikler

- 🛍️ Ürün kataloğu ve filtreleme
- 🛒 Sepet yönetimi
- 📦 Sipariş sistemi
- 👤 Admin paneli (şifre korumalı, environment variables ile güvenli)
- 📱 Responsive tasarım
- 🎨 Lüks ve minimalist UI

## 🔐 Admin Girişi

Admin bilgileri environment variables üzerinden yönetilir. 

**Güvenlik Notu:** 
- Production'da mutlaka environment variables kullanın
- `.env` dosyasını Git'e commit etmeyin
- Şifreleri kod içinde veya dokümantasyonda saklamayın

## 📝 Notlar

- Ürünler ve siparişler localStorage'da saklanır
- Admin paneli footer'daki "Yönetici Girişi" linkinden erişilebilir
- Hassas bilgiler environment variables ile korunur

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.
