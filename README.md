# Website Company Profile — MiMaMik Pekanbaru

**Nama :** Natasya Utari
**NIM :** 25110135
**Matkul :** Web Desain 2 (MKK 123)
**UMKM :** MiMaMik Pekanbaru
**Lokasi :** Jl. Paus No. 69, Marpoyan Damai, Pekanbaru, Riau (sebelah Cahaya Car Wash)

**Deskripsi:**
Website company profile untuk MiMaMik Pekanbaru, warung mie berlevel (level pedas 0–4) dengan harga mulai Rp7.000. Website ini dibangun sebagai media promosi digital karena MiMaMik belum memiliki website resmi (hanya Instagram @miemamik).

Website terdiri dari 6 halaman dalam bentuk SPA (Single Page Application) sederhana — semua halaman berada dalam satu file `index.html` dan berpindah tanpa reload melalui navbar:

- **Beranda** — hero section, info strip (jam buka, lokasi, level pedas, harga), carousel info & promo, widget interaktif pilih level pedas, dan alasan kenapa memilih MiMaMik
- **Tentang** — sejarah singkat, visi & misi, daftar fasilitas (musholla, WiFi, smoking area, dll)
- **Menu** — daftar menu dalam 5 kategori (Mie, Paket Special, Ricebowl, Snack, Minuman & Dessert), lengkap dengan modal detail menu dan keranjang pesanan
- **Testimoni** — ulasan pelanggan dalam bentuk card
- **Lokasi** — embed Google Maps, info alamat & jam buka
- **Kontak** — form pesan/pertanyaan dengan validasi, info kontak WhatsApp & Instagram

**Fitur JavaScript yang diimplementasikan:**
- Router SPA (perpindahan halaman tanpa reload) berbasis atribut `data-page`
- Carousel custom untuk slider info & promo (tanpa plugin bootstrap.js)
- Widget interaktif pilih level pedas (0–4) yang mengubah ikon cabai & deskripsi rasa
- Tab menu (kategori Mie, Paket Special, Ricebowl, Snack, Minuman)
- Modal detail menu dengan pilihan level pedas & topping
- Keranjang pesanan yang bisa dikirim langsung ke WhatsApp toko
- Validasi form kontak secara realtime sebelum pesan dikirim ke WhatsApp

**Teknologi:** HTML5, CSS3 + Bootstrap 4, JavaScript (vanilla)
