function aman(namaKomponen, fn) {
    try {
        fn();
    } catch (err) {
        console.error('Gagal inisialisasi ' + namaKomponen + ':', err);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------
       1. ROUTER HALAMAN + TOGGLE NAVBAR MOBILE
    --------------------------------------------------- */
    aman('Router Halaman', function () {
        function pindahHalaman(namaHalaman) {
            document.querySelectorAll('.page-view').forEach(function (el) {
                el.classList.remove('active');
            });

            var target = document.getElementById('page-' + namaHalaman);
            if (target) target.classList.add('active');

            document.querySelectorAll('.nav-link-page').forEach(function (link) {
                var isActive = link.getAttribute('data-page') === namaHalaman;
                link.classList.toggle('active', isActive);
                link.classList.toggle('text-white', isActive);
                link.classList.toggle('text-white-50',!isActive);
            });

            window.scrollTo({ top: 0, behavior: 'instant' });

            // Tutup navbar mobile setelah pilih menu
            var navbarLinks = document.getElementById('navbarLinks');
            if (navbarLinks) navbarLinks.classList.remove('show');
        }

        document.querySelectorAll('[data-page]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                pindahHalaman(this.getAttribute('data-page'));
            });
        });

        // Toggle hamburger menu di mobile — dibuat manual (tanpa bootstrap.js)
        var toggleBtn = document.getElementById('navbarToggleBtn');
        var navbarLinks = document.getElementById('navbarLinks');
        if (toggleBtn && navbarLinks) {
            toggleBtn.addEventListener('click', function () {
                navbarLinks.classList.toggle('show');
            });
        }
    });

    /* ---------------------------------------------------
       2. CAROUSEL CUSTOM (dipakai untuk carousel promo)
       UDAH DIBENERIN: hapus duplikat next/prev
    --------------------------------------------------- */
    function initCarousel(carouselEl) {
        var inner = carouselEl.querySelector('.carousel-inner');
        if (!inner) return;
        var items = Array.from(inner.children);
        if (items.length === 0) return;
        var indicators = Array.from(carouselEl.querySelectorAll('.carousel-indicators li'));
        var currentIndex = items.findIndex(function (el) { return el.classList.contains('active'); });
        if (currentIndex < 0) currentIndex = 0;

        function updateIndicators(index) {
            indicators.forEach(function (li, i) {
                li.classList.toggle('active', i === index);
            });
        }

        function slideTo(newIndex) {
            if (newIndex === currentIndex) return;

            items[currentIndex].classList.remove('active');
            items[newIndex].classList.add('active');
            updateIndicators(newIndex);
            currentIndex = newIndex;
        }

        function next() {
            slideTo((currentIndex + 1) % items.length);
        }
        function prev() {
            slideTo((currentIndex - 1 + items.length) % items.length);
        }

        var prevBtn = carouselEl.querySelector('[data-slide="prev"]');
        var nextBtn = carouselEl.querySelector('[data-slide="next"]');
        if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); prev(); resetAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); next(); resetAutoplay(); });

        indicators.forEach(function (li, i) {
            li.addEventListener('click', function () {
                slideTo(i); // UDAH DIBENERIN: hapus parameter 'next'/'prev'
                resetAutoplay();
            });
        });

        var intervalMs = parseInt(carouselEl.getAttribute('data-interval'), 10) || 5000;
        var timer = null;

        function startAutoplay() {
            if (carouselEl.getAttribute('data-ride')!== 'carousel') return;
            timer = setInterval(next, intervalMs);
        }
        function stopAutoplay() { clearInterval(timer); }
        function resetAutoplay() { stopAutoplay(); startAutoplay(); }

        carouselEl.addEventListener('mouseenter', stopAutoplay);
        carouselEl.addEventListener('mouseleave', startAutoplay);

        startAutoplay();
    }

    aman('Carousel', function () {
        document.querySelectorAll('.carousel').forEach(initCarousel);
    });

    /* ---------------------------------------------------
       3. WIDGET COBA SENSASINYA
    --------------------------------------------------- */
    aman('Widget Level Pedas', function () {
        var deskripsiLevel = [
            'Rasa gurih manis, nyaris tanpa pedas. Cocok buat yang baru coba MiMaMik.',
            'Pedas ringan mulai terasa di lidah, masih aman menemani obrolan santai.',
            'Pedas mulai nendang, keringat mulai muncul dikit-dikit.',
            'Favorit pecinta pedas — cabai setan mulai unjuk gigi.',
            'Level tertinggi. Lidah bergetar, dijamin nagih buat yang doyan pedas maksimal.'
        ];

        var picker = document.getElementById('levelPicker');
        var flameRow = document.getElementById('flameRow');
        var levelDesc = document.getElementById('levelDesc');
        if (!picker ||!flameRow ||!levelDesc) return;

        var flames = flameRow.querySelectorAll('.flame');

        function setLevel(level) {
            picker.querySelectorAll('.level-btn').forEach(function (btn) {
                btn.classList.toggle('active', parseInt(btn.getAttribute('data-level'), 10) === level);
            });
            flames.forEach(function (flame, i) {
                flame.classList.toggle('lit', i < level);
            });
            levelDesc.textContent = deskripsiLevel[level];
        }

        picker.querySelectorAll('.level-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLevel(parseInt(this.getAttribute('data-level'), 10));
            });
        });
    });

    /* ---------------------------------------------------
       4. TAB MENU (Mie & Nasi / Snack / Minuman)
    --------------------------------------------------- */
    aman('Tab Menu', function () {
        var tabWrap = document.getElementById('menuTabs');
        if (!tabWrap) return;

        tabWrap.querySelectorAll('.tab-pill').forEach(function (pill) {
            pill.addEventListener('click', function () {
                var target = this.getAttribute('data-target');

                tabWrap.querySelectorAll('.tab-pill').forEach(function (p) {
                    p.classList.remove('active');
                });
                this.classList.add('active');

                document.querySelectorAll('.menu-pane').forEach(function (pane) {
                    pane.classList.remove('active');
                });
                var pane = document.getElementById('pane-' + target);
                if (pane) pane.classList.add('active');
            });
        });
    });

    /* ---------------------------------------------------
       5. MODAL DETAIL MENU + KERANJANG PESANAN
    --------------------------------------------------- */
    aman('Modal Detail Menu & Keranjang', function () {
        var NOMOR_WA = '6285185710772'; // 085185710772
        var KERANJANG_KEY = 'mimamikKeranjang';

        var daftarTopping = [
            { nama: 'Telur', harga: 5000 },
            { nama: 'Sosis', harga: 5000 },
            { nama: 'Bakso', harga: 5000 },
            { nama: 'Nugget', harga: 5000 }
        ];

        var detailMenu = {
            'mie-mamik': { nama: 'Mie Mamik', hargaAngka: 12000, desc: 'Mie keriting chewy, bumbu cabai setan & lada hitam. Level pedas bisa dipilih sesuai selera.', toppingBisa: true, levelBisa: true },
            'mie-bontot': { nama: 'Mie Bontot', hargaAngka: 12000, desc: 'Mie kenyal tabur bontot crispy & bawang goreng. Gurih, tidak pedas, cocok buat semua.', toppingBisa: true },
            'mie-ayam': { nama: 'Mie Ayam', hargaAngka: 15000, desc: 'Mie kenyal dengan ayam cincang gurih, sayur segar & taburan bontot. Rasanya gurih, tidak pedas.', toppingBisa: false },
            'paket a': { nama: 'Paket A', hargaAngka: 18000, desc: 'Nasi putih + Ayam Goreng + Sambal Ijo + Lalapan + Kerupuk + Es Teh.', toppingBisa: false },
            'paket b': { nama: 'Paket B', hargaAngka: 18000, desc: 'Nasi + Ayam Bakar + Saus Bakar + Lalapan + Kerupuk + Es Teh.', toppingBisa: false },
            'paket c': { nama: 'Paket C', hargaAngka: 18000, desc: 'Nasi + Ayam Bakar + Sambal BBQ + Lalapan + Kerupuk + Es Teh.', toppingBisa: false },
            'paket d': { nama: 'Paket D', hargaAngka: 18000, desc: 'Nasi + Ayam Goreng + Sambal Bawang + Lalapan + Kerupuk + Es Teh.', toppingBisa: false },
            'rb a': { nama: 'RB A', hargaAngka: 15000, desc: 'Nasi + Ayam Crispy + Sambal Cabe Ijo + Telur ceplok + Lalapan.', toppingBisa: false },
            'rb b': { nama: 'RB B', hargaAngka: 15000, desc: 'Nasi + Ayam Crispy + Sambal Cabe Ijo + Telur ceplok + Lalapan.', toppingBisa: false },
            'pangsit-ayam': { nama: 'Pangsit Ayam', hargaAngka: 10000, desc: 'Renyah di luar, gurih isian ayam di dalam.', toppingBisa: false },
            'pangsit-keju': { nama: 'Pangsit Keju', hargaAngka: 10000, desc: 'Pangsit renyah dengan lelehan keju di dalamnya.', toppingBisa: false },
            'kentang goreng': { nama: 'Kentang Goreng', hargaAngka: 10000, desc: 'Kentang goreng crispy dengan saus sambal.', toppingBisa: false },
            'nugget goreng': { nama: 'Nugget Goreng', hargaAngka: 15000, desc: 'Nugget crispy porsi pas untuk camilan.', toppingBisa: false },
            'sosis goreng': { nama: 'Sosis Goreng', hargaAngka: 10000, desc: 'Sosis premium goreng kecoklatan.', toppingBisa: false },
            'bakso goreng': { nama: 'Bakso Goreng', hargaAngka: 10000, desc: 'Bakso goreng tusuk, luarnya garing dalamnya kenyal.', toppingBisa: false },
            'kopi susu aren': { nama: 'Es Kopi Susu Aren', hargaAngka: 12000, desc: 'Perpaduan kopi, susu, dan gula aren yang pas manisnya.', toppingBisa: false },
            'cendol jadul': { nama: 'Cendol Jadul', hargaAngka: 12000, desc: 'Cendol khas MiMamik dengan santan gurih, gula merah cair & es batu.', toppingBisa: false },
            'milkshake coklat': { nama: 'Milkshake Coklat', hargaAngka: 12000, desc: 'Manis legit rasa cokelat, dingin menyegarkan.', toppingBisa: false },
            'milkshake strawberry': { nama: 'Milkshake Strawberry', hargaAngka: 12000, desc: 'Segarnya strawberry asli + susu creamy.', toppingBisa: false },
            'milkshake vanila': { nama: 'Milkshake Vanila', hargaAngka: 12000, desc: 'Rasa vanila lembut, manis pas.', toppingBisa: false },
            'es teh': { nama: 'Es Teh', hargaAngka: 5000, desc: 'Manisnya pas, pelepas dahaga paling pas bareng nasi & mie.', toppingBisa: false },
            'es kosong': { nama: 'Es Kosong', hargaAngka: 3000, desc: 'Es batu + air dingin. Simple tapi penting.', toppingBisa: false },
            'es blackcurrant': { nama: 'Es Blackcurrant', hargaAngka: 7000, desc: 'Rasanya asam manis, bikin seger seharian.', toppingBisa: false },
            'es leci': { nama: 'Es Leci', hargaAngka: 7000, desc: 'Wangi dan seger, cocok buat pencinta rasa buah.', toppingBisa: false }
        };

        function formatRupiah(angka) {
            return 'Rp' + angka.toLocaleString('id-ID');
        }

        /* --- state keranjang, disimpan di localStorage biar gak hilang saat pindah halaman/refresh --- */
        var keranjang = [];
        function muatKeranjang() {
            try {
                keranjang = JSON.parse(localStorage.getItem(KERANJANG_KEY)) || [];
            } catch (e) {
                keranjang = [];
            }
        }
        function simpanKeranjang() {
            try {
                localStorage.setItem(KERANJANG_KEY, JSON.stringify(keranjang));
            } catch (e) { /* diamkan kalau localStorage tidak tersedia */ }
        }
        muatKeranjang();

        var overlay = document.getElementById('menuModalOverlay');
        var content = document.getElementById('menuModalContent');
        var closeBtn = document.getElementById('menuModalClose');
        if (!overlay ||!content ||!closeBtn) return;

        var cartBtn = document.getElementById('btnKeranjangFloat');
        var cartBadge = document.getElementById('cartBadge');
        var cartOverlay = document.getElementById('keranjangModalOverlay');
        var cartCloseBtn = document.getElementById('keranjangModalClose');
        var cartList = document.getElementById('keranjangList');
        var cartTotalRow = document.getElementById('keranjangTotalRow');
        var cartTotalEl = document.getElementById('keranjangTotalHarga');
        var btnPesanSemua = document.getElementById('btnPesanSemuaWA');

        function ambilToppingTerpilih() {
            var arr = [];
            content.querySelectorAll('.topping-check:checked').forEach(function (chk) {
                arr.push(chk.getAttribute('data-nama'));
            });
            return arr;
        }

        function hitungHargaSatuan(item) {
            var total = item.hargaAngka;
            content.querySelectorAll('.topping-check:checked').forEach(function (chk) {
                total += parseInt(chk.getAttribute('data-harga'), 10);
            });
            return total;
        }

        function updateTotalTampilan(item) {
            var totalEl = document.getElementById('modalTotalHarga');
            if (totalEl) totalEl.textContent = formatRupiah(hitungHargaSatuan(item));
        }

        function updateBadge() {
            if (!cartBadge) return;
            var jumlahTotal = keranjang.reduce(function (a, b) { return a + b.qty; }, 0);
            if (jumlahTotal > 0) {
                cartBadge.textContent = jumlahTotal;
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }

        function tambahKeKeranjang(key, item, toppingTerpilih, hargaSatuan, level) {
            var toppingKey = toppingTerpilih.slice().sort().join(',');
            var levelKey = (level === null || level === undefined) ? '' : ('lv' + level);
            var existing = keranjang.filter(function (row) {
                return row.key === key && row.toppingKey === toppingKey && row.levelKey === levelKey;
            })[0];

            if (existing) {
                existing.qty += 1;
            } else {
                keranjang.push({
                    key: key,
                    nama: item.nama,
                    hargaSatuan: hargaSatuan,
                    topping: toppingTerpilih,
                    toppingKey: toppingKey,
                    level: (level === null || level === undefined) ? null : level,
                    levelKey: levelKey,
                    qty: 1
                });
            }
            simpanKeranjang();
            updateBadge();
        }

        function bukaModal(key) {
            var item = detailMenu[key];
            if (!item) return;

            var levelTerpilih = 0;

            var htmlLevel = '';
            if (item.levelBisa) {
                htmlLevel += '<div class="mb-3">';
                htmlLevel += '<p class="font-weight-bold small mb-2">Pilih Level Pedas:</p>';
                htmlLevel += '<div class="level-picker-modal" id="levelPickerModal">';
                for (var lv = 0; lv <= 4; lv++) {
                    htmlLevel += '<button type="button" class="level-pill' + (lv === 0 ? ' active' : '') + '" data-level="' + lv + '">' + lv + '</button>';
                }
                htmlLevel += '</div></div>';
            }

            var htmlTopping = '';
            if (item.toppingBisa) {
                htmlTopping += '<div class="mb-3">';
                htmlTopping += '<p class="font-weight-bold small mb-2">Tambahan Topping (opsional):</p>';
                daftarTopping.forEach(function (t) {
                    htmlTopping +=
                        '<label class="topping-option d-flex align-items-center justify-content-between">' +
                            '<span><input type="checkbox" class="topping-check mr-2" data-nama="' + t.nama + '" data-harga="' + t.harga + '">' + t.nama + '</span>' +
                            '<span class="text-muted small">+' + formatRupiah(t.harga) + '</span>' +
                        '</label>';
                });
                htmlTopping += '</div>';
            }

            content.innerHTML =
                '<h3 class="h5 font-weight-bold mb-2">' + item.nama + '</h3>' +
                '<p class="menu-price mb-3">' + formatRupiah(item.hargaAngka) + '</p>' +
                '<p class="mb-3 text-muted">' + item.desc + '</p>' +
                htmlLevel +
                htmlTopping +
                '<div class="d-flex align-items-center justify-content-between modal-total-row mb-3">' +
                    '<span class="font-weight-bold">Total</span>' +
                    '<span class="font-weight-bold text-chili" id="modalTotalHarga">' + formatRupiah(item.hargaAngka) + '</span>' +
                '</div>' +
                '<div class="d-flex" style="gap:.6rem;">' +
                    '<button type="button" class="btn btn-outline-chili flex-fill" id="btnTambahKeranjang"><i class="fas fa-cart-plus mr-2"></i>Keranjang</button>' +
                    '<button type="button" class="btn btn-whatsapp flex-fill" id="btnPesanWA"><i class="fab fa-whatsapp mr-2"></i>Pesan Langsung</button>' +
                '</div>';

            var levelPickerEl = document.getElementById('levelPickerModal');
            if (levelPickerEl) {
                levelPickerEl.querySelectorAll('.level-pill').forEach(function (pill) {
                    pill.addEventListener('click', function () {
                        levelPickerEl.querySelectorAll('.level-pill').forEach(function (p) {
                            p.classList.remove('active');
                        });
                        this.classList.add('active');
                        levelTerpilih = parseInt(this.getAttribute('data-level'), 10);
                    });
                });
            }

            content.querySelectorAll('.topping-check').forEach(function (chk) {
                chk.addEventListener('change', function () { updateTotalTampilan(item); });
            });

            var btnTambah = document.getElementById('btnTambahKeranjang');
            if (btnTambah) {
                btnTambah.addEventListener('click', function () {
                    var toppingTerpilih = ambilToppingTerpilih();
                    var hargaSatuan = hitungHargaSatuan(item);
                    tambahKeKeranjang(key, item, toppingTerpilih, hargaSatuan, item.levelBisa ? levelTerpilih : null);

                    btnTambah.innerHTML = '<i class="fas fa-check mr-2"></i>Ditambahkan!';
                    if (cartBtn) {
                        cartBtn.classList.add('bump');
                        setTimeout(function () { cartBtn.classList.remove('bump'); }, 400);
                    }
                    setTimeout(tutupModal, 650);
                });
            }

            var btnWA = document.getElementById('btnPesanWA');
            if (btnWA) {
                btnWA.addEventListener('click', function () {
                    var toppingTerpilih = ambilToppingTerpilih();
                    var total = hitungHargaSatuan(item);

                    var pesan = 'Halo MiMaMik Pekanbaru, saya mau pesan:\n\n';
                    pesan += '- ' + item.nama + ' (' + formatRupiah(item.hargaAngka) + ')\n';
                    if (item.levelBisa) {
                        pesan += '- Level pedas: ' + levelTerpilih + '\n';
                    }
                    if (toppingTerpilih.length > 0) {
                        pesan += '- Tambahan topping: ' + toppingTerpilih.join(', ') + '\n';
                    }
                    pesan += '\nTotal: ' + formatRupiah(total) + '\n\nMohon info selanjutnya, terima kasih!';

                    var url = 'https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(pesan);
                    window.open(url, '_blank');
                });
            }

            overlay.classList.add('show');
        }

        function tutupModal() {
            overlay.classList.remove('show');
        }

        document.querySelectorAll('[data-menu-detail]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                bukaModal(this.getAttribute('data-menu-detail'));
            });
        });

        closeBtn.addEventListener('click', tutupModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) tutupModal();
        });

        /* --- render & aksi keranjang --- */
        function renderKeranjang() {
            if (!cartList) return;

            if (keranjang.length === 0) {
                cartList.innerHTML = '<p class="text-muted text-center py-3 mb-0">Keranjang masih kosong. Yuk pilih menu dulu!</p>';
                if (cartTotalRow) cartTotalRow.style.display = 'none';
                if (btnPesanSemua) btnPesanSemua.style.display = 'none';
                return;
            }

            var html = '';
            var totalSemua = 0;

            keranjang.forEach(function (row, idx) {
                var subtotal = row.hargaSatuan * row.qty;
                totalSemua += subtotal;
                html +=
                    '<div class="keranjang-item mb-3">' +
                        '<div class="d-flex justify-content-between align-items-start">' +
                            '<div>' +
                                '<div class="font-weight-bold">' + row.nama + '</div>' +
                                (row.level !== null && row.level !== undefined ? '<div class="small text-muted">Level pedas: ' + row.level + '</div>' : '') +
                                (row.topping.length > 0 ? '<div class="small text-muted">+ ' + row.topping.join(', ') + '</div>' : '') +
                                '<div class="small text-chili font-weight-bold mt-1">' + formatRupiah(subtotal) + '</div>' +
                            '</div>' +
                            '<button type="button" class="keranjang-hapus" data-idx="' + idx + '" aria-label="Hapus item"><i class="fas fa-trash"></i></button>' +
                        '</div>' +
                        '<div class="keranjang-qty mt-2">' +
                            '<button type="button" class="qty-btn" data-idx="' + idx + '" data-aksi="kurang">−</button>' +
                            '<span class="qty-angka">' + row.qty + '</span>' +
                            '<button type="button" class="qty-btn" data-idx="' + idx + '" data-aksi="tambah">+</button>' +
                        '</div>' +
                    '</div>';
            });

            cartList.innerHTML = html;
            if (cartTotalRow) cartTotalRow.style.display = 'flex';
            if (cartTotalEl) cartTotalEl.textContent = formatRupiah(totalSemua);
            if (btnPesanSemua) btnPesanSemua.style.display = 'block';

            cartList.querySelectorAll('.qty-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var idx = parseInt(this.getAttribute('data-idx'), 10);
                    var aksi = this.getAttribute('data-aksi');
                    if (aksi === 'tambah') keranjang[idx].qty += 1;
                    if (aksi === 'kurang') {
                        keranjang[idx].qty -= 1;
                        if (keranjang[idx].qty <= 0) keranjang.splice(idx, 1);
                    }
                    simpanKeranjang();
                    updateBadge();
                    renderKeranjang();
                });
            });

            cartList.querySelectorAll('.keranjang-hapus').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var idx = parseInt(this.getAttribute('data-idx'), 10);
                    keranjang.splice(idx, 1);
                    simpanKeranjang();
                    updateBadge();
                    renderKeranjang();
                });
            });
        }

        function bukaKeranjang() {
            renderKeranjang();
            if (cartOverlay) cartOverlay.classList.add('show');
        }
        function tutupKeranjang() {
            if (cartOverlay) cartOverlay.classList.remove('show');
        }

        if (cartBtn) cartBtn.addEventListener('click', bukaKeranjang);
        if (cartCloseBtn) cartCloseBtn.addEventListener('click', tutupKeranjang);
        if (cartOverlay) {
            cartOverlay.addEventListener('click', function (e) {
                if (e.target === cartOverlay) tutupKeranjang();
            });
        }

        if (btnPesanSemua) {
            btnPesanSemua.addEventListener('click', function () {
                if (keranjang.length === 0) return;

                var pesan = 'Halo MiMaMik Pekanbaru, saya mau pesan:\n\n';
                var totalSemua = 0;

                keranjang.forEach(function (row, i) {
                    var subtotal = row.hargaSatuan * row.qty;
                    totalSemua += subtotal;
                    pesan += (i + 1) + '. ' + row.nama + ' x' + row.qty;
                    var keterangan = [];
                    if (row.level !== null && row.level !== undefined) keterangan.push('Level ' + row.level);
                    if (row.topping.length > 0) keterangan.push('+ ' + row.topping.join(', '));
                    if (keterangan.length > 0) pesan += ' (' + keterangan.join(', ') + ')';
                    pesan += ' - ' + formatRupiah(subtotal) + '\n';
                });

                pesan += '\nTotal Semua: ' + formatRupiah(totalSemua) + '\n\nMohon info selanjutnya, terima kasih!';

                var url = 'https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(pesan);
                window.open(url, '_blank');
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                tutupModal();
                tutupKeranjang();
            }
        });

        updateBadge();
    });

    /* ---------------------------------------------------
       6. VALIDASI FORM KONTAK
    --------------------------------------------------- */
    aman('Validasi Form Kontak', function () {
        var form = document.getElementById('formKontak');
        if (!form) return;

        var inputNama = document.getElementById('inputNama');
        var inputHp = document.getElementById('inputHp');
        var inputPesan = document.getElementById('inputPesan');
        var formSuccess = document.getElementById('formSuccess');

        function tampilkanError(input, errorEl, tampil) {
            input.classList.toggle('is-invalid', tampil);
            errorEl.classList.toggle('show', tampil);
        }

        function validasi() {
            var valid = true;

            var namaOk = inputNama.value.trim().length >= 3;
            tampilkanError(inputNama, document.getElementById('errorNama'),!namaOk);
            if (!namaOk) valid = false;

            var hpBersih = inputHp.value.replace(/[\s-]/g, '');
            var hpOk = /^[0-9]{10,13}$/.test(hpBersih);
            tampilkanError(inputHp, document.getElementById('errorHp'),!hpOk);
            if (!hpOk) valid = false;

            var pesanOk = inputPesan.value.trim().length >= 10;
            tampilkanError(inputPesan, document.getElementById('errorPesan'),!pesanOk);
            if (!pesanOk) valid = false;

            return valid;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            formSuccess.classList.remove('show');

            
            if (validasi()) {
                var pesan = 'Halo MiMaMik Pekanbaru, saya mau tanya/pesan:\n\n';
                pesan += 'Nama: ' + inputNama.value.trim() + '\n';
                pesan += 'No. HP: ' + inputHp.value.trim() + '\n';
                pesan += 'Pesan: ' + inputPesan.value.trim();

                var url = 'https://wa.me/6285185710772?text=' + encodeURIComponent(pesan);
                window.open(url, '_blank');

                formSuccess.classList.add('show');
                form.reset();
                setTimeout(function () {
                    formSuccess.classList.remove('show');
                }, 4000);
            }
        });

        // Validasi realtime saat user mengetik ulang
        [inputNama, inputHp, inputPesan].forEach(function (input) {
            input.addEventListener('input', function () {
                if (input.classList.contains('is-invalid')) validasi();
            });
        });
    });

    /* ---------------------------------------------------
       7. FOOTER - UPDATE TAHUN OTOMATIS
    --------------------------------------------------- */
    aman('Footer Tahun', function () {
        var el = document.getElementById('tahunFooter');
        if (el) el.textContent = new Date().getFullYear();
    });

});
