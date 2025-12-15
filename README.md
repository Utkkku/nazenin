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

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Build'i önizle
npm run preview
```

## 🌐 Deployment

Bu proje Netlify üzerinden deploy edilmek üzere yapılandırılmıştır.

### Netlify Deploy Adımları

1. GitHub repository'yi oluştur ve projeyi push et:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Netlify dashboard'a git ve "New site from Git" seçeneğini kullan
3. GitHub repository'ni bağla
4. Build ayarları:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy butonuna tıkla

## 📁 Proje Yapısı

```
nazeninyaeverflora/
├── public/           # Statik dosyalar (görseller)
├── src/
│   ├── App.tsx      # Ana uygulama bileşeni
│   ├── main.tsx     # React entry point
│   └── index.css    # Global stiller
├── index.html       # HTML template
├── tailwind.config.js
├── package.json
└── README.md
```

## ✨ Özellikler

- 🛍️ Ürün kataloğu ve filtreleme
- 🛒 Sepet yönetimi
- 📦 Sipariş sistemi
- 👤 Admin paneli (şifre korumalı)
- 📱 Responsive tasarım
- 🎨 Lüks ve minimalist UI

## 🔐 Admin Girişi

- **Kullanıcı Adı:** nazenin
- **Şifre:** 09Nazenin022022

## 📝 Notlar

- Ürünler ve siparişler localStorage'da saklanır
- Admin paneli footer'daki "Yönetici Girişi" linkinden erişilebilir

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

