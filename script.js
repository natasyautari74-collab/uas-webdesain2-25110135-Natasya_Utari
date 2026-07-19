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
       5. MODAL DETAIL MENU
    --------------------------------------------------- */
    aman('Modal Detail Menu', function () {
        var detailMenu = {
            'mie-mamik': { nama: 'Mie Mamik', harga: 'Rp12.000 (topping tambah Rp5.000)', desc: 'Mie keriting chewy dengan bumbu cabai setan dan lada hitam khas MiMaMik. Level pedas bisa dipilih dari 0 sampai 4. Disajikan dengan taburan kerupuk pangsit.' },
            'mie-bontot': { nama: 'Mie Bontot', harga: 'Rp12.000', desc: 'Mie kenyal dengan taburan bontot khas, gurih dan mengenyangkan — pilihan pas buat yang tidak ingin terlalu pedas.' },
            'nasi-goreng': { nama: 'Nasi Goreng Mamik', harga: 'Rp16.000 (+telur Rp5.000)', desc: 'Nasi goreng dengan bumbu senada dengan mie andalan MiMaMik. Bisa tambah telur ceplok/dadar dengan biaya tambahan.' },
            'pangsit-ayam': { nama: 'Pangsit Ayam', harga: 'Rp10.000', desc: 'Pangsit goreng renyah dengan isian ayam yang gurih, cocok jadi camilan pendamping mie.' },
            'pangsit-keju': { nama: 'Pangsit Keju', harga: 'Rp10.000', desc: 'Pangsit renyah dengan lelehan keju di dalamnya, favorit anak muda.' },
            'tahu-bakso': { nama: 'Tahu Bakso', harga: 'Rp10.000', desc: 'Tahu isi bakso yang gurih, cocok dimakan hangat-hangat bersama mie level pedas.' },
            'nugget': { nama: 'Nugget', harga: 'Rp15.000', desc: 'Nugget ayam crispy dengan porsi pas untuk camilan bersama.' },
            'kopi-aren': { nama: 'Es Kopi Susu Aren', harga: 'Rp12.000', desc: 'Perpaduan kopi, susu, dan gula aren yang pas manisnya, cocok menetralkan pedas.' },
            'milkshake-strawberry': { nama: 'Milkshake Strawberry', harga: 'Rp12.000', desc: 'Minuman creamy rasa strawberry yang segar, favorit anak muda.' },
            'milkshake-chocolate': { nama: 'Milkshake Chocolate', harga: 'Rp12.000', desc: 'Minuman creamy rasa cokelat yang manis legit dan dingin menyegarkan.' },
            'blackcurrant': { nama: 'Es Blackcurrant', harga: 'Rp7.000', desc: 'Minuman segar rasa blackcurrant, pas untuk menemani mie pedas.' },
            'orange': { nama: 'Es Orange', harga: 'Rp7.000', desc: 'Minuman segar rasa jeruk asam manis, enak diminum dingin.' },
            'es-durian': { nama: 'Es Krim Durian', harga: 'Rp12.000', desc: 'Es krim durian dengan topping kacang dan keju parut di atasnya.' }
        };

        var overlay = document.getElementById('menuModalOverlay');
        var content = document.getElementById('menuModalContent');
        var closeBtn = document.getElementById('menuModalClose');
        if (!overlay ||!content ||!closeBtn) return;

        function bukaModal(key) {
            var item = detailMenu[key];
            if (!item) return;
            content.innerHTML =
                '<h3 class="h5 font-weight-bold mb-2">' + item.nama + '</h3>' +
                '<p class="menu-price mb-3">' + item.harga + '</p>' +
                '<p class="mb-0 text-muted">' + item.desc + '</p>';
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
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') tutupModal();
        });
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