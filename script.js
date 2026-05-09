document.addEventListener("DOMContentLoaded", function () {

    const guestElements = document.querySelectorAll('[data-guest-name]');
    const params = new URLSearchParams(window.location.search);
    let guestName = params.get('guest') || '';
    const pathTail = window.location.pathname.split('/').pop() || '';
    if (!guestName && pathTail && !pathTail.includes('.html')) {
        guestName = decodeURIComponent(pathTail.replace(/[-_]/g, ' '));
    }
    const hashName = window.location.hash ? decodeURIComponent(window.location.hash.replace(/^#/, '')) : '';
    if (!guestName && hashName) {
        guestName = hashName;
    }
    if (!guestName) {
        guestName = 'Guest Name Here';
    }
    guestElements.forEach(el => el.textContent = guestName);

    const eventDate = new Date('2026-06-28T09:00:00');
    function updateCountdown() {
        const now = new Date();
        let diff = eventDate - now;
        if (diff < 0) diff = 0;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        document.getElementById('count-days').textContent = String(days).padStart(2, '0');
        document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('count-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('count-seconds').textContent = String(seconds).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.animate-once').forEach(el => observer.observe(el));

    // Open invitation
    const openBtn = document.getElementById('open-invitation-btn');
    const audio = document.getElementById('backsound');

    openBtn.addEventListener('click', () => {
        // Show all locked sections at once
        document.querySelectorAll('.locked-section').forEach(section => {
            section.style.display = 'block';
            section.classList.add('fade-in');
        });

        // Scroll to quote
        setTimeout(() => {
            document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
        }, 200);

        // AUDIO FIX with fade in
        audio.volume = 0;
        audio.muted = false;
        audio.load();

        let playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // fade in volume
                let vol = 0;
                let fade = setInterval(() => {
                    if (vol < 1) {
                        vol += 0.05;
                        audio.volume = vol;
                    } else {
                        clearInterval(fade);
                    }
                }, 150);
            }).catch(() => {
                // fallback klik kedua
                document.body.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            });
        }
    });

    // Music control
    const muteBtn = document.getElementById('mute-btn');
    let isMuted = false;

    muteBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        }

        audio.muted = !audio.muted;
        isMuted = audio.muted;
        muteBtn.innerText = isMuted ? "🔇" : "🔊";
    });

    // AUTO RESUME (kalau pindah tab)
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && audio.paused) {
            audio.play().catch(() => { });
        }
    });

    // RSVP Form Submission
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData);
            const timestamp = new Date().toLocaleString('id-ID');

            try {
                // Replace dengan Google Apps Script URL Anda
                const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwO3m-5qsRxT0oas4vco6A7A2WULL3uJazjx_OeVMWkDXi_wovXC8IR9sEm3f5eCDBK/exec';

                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ ...data, timestamp })
                });

                if (response.ok) {
                    alert('✅ Terima kasih! Konfirmasi Anda telah diterima.');
                    rsvpForm.reset();
                } else {
                    throw new Error('Gagal mengirim');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Terjadi kesalahan. Silakan coba lagi atau hubungi pengantin.');
            }
        });
    }

});

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backsound');
    const openBtn = document.getElementById('open-invitation-btn');
    const muteBtn = document.getElementById('mute-btn');
    let isPlaying = false;

    // 1. Fungsi untuk Memutar Musik saat tombol "Lihat Undangan" diklik
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            audio.play().then(() => {
                isPlaying = true;
                muteBtn.innerHTML = '🔊'; // Icon speaker menyala
            }).catch(error => {
                console.log("Autoplay dicegah oleh browser:", error);
            });
        });
    }

    // 2. Fungsi Tombol Mute/Unmute (Tombol di pojok kanan bawah)
    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            if (isPlaying) {
                audio.pause();
                muteBtn.innerHTML = '🔇';
            } else {
                audio.play();
                muteBtn.innerHTML = '🔊';
            }
            isPlaying = !isPlaying;
        });
    }
});

