// Interaksi sesuai HTML tanpa mengubah struktur DOM

;(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel)
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel))

  document.addEventListener("DOMContentLoaded", () => {
    // Tahun footer
    const y = $("#year")
    if (y) y.textContent = new Date().getFullYear()

    // Toggle nav mobile
    const toggle = $(".nav-toggle")
    const nav = $("#menu")
    if (toggle && nav) {
      const setExpanded = (val) => {
        toggle.setAttribute("aria-expanded", String(val))
        nav.classList.toggle("is-open", val)
      }
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true"
        setExpanded(!expanded)
      })
      // Tutup ketika pindah fokus/klik di luar
      document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
          setExpanded(false)
        }
      })
    }

    // Animasi reveal
    const revealEls = $$(".reveal")
    if (revealEls.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-visible")
              io.unobserve(en.target)
            }
          })
        },
        { threshold: 0.15 },
      )
      revealEls.forEach((el) => io.observe(el))
    }

    // Data film (ringkas)
    const films = [
  {
    title: "The Conjuring",
    year: 2013,
    cat: "Utama",
    rating: 8.5,
    img: "/images/posters/conjuring 1.jpeg",
    desc: "Kisah nyata Ed dan Lorraine Warren, pasangan penyelidik paranormal yang membantu keluarga Perron melawan entitas jahat yang menghantui rumah mereka di Rhode Island."
  },
  {
    title: "Annabelle",
    year: 2014,
    cat: "Annabelle",
    rating: 7.1,
    img: "/images/posters/anabelle 1.jpg",
    desc: "Boneka misterius bernama Annabelle menjadi medium kekuatan iblis yang mengancam keselamatan pasangan muda yang baru saja pindah ke rumah baru."
  },
  {
    title: "The Conjuring 2",
    year: 2016,
    cat: "Utama",
    rating: 9.2,
    img: "/images/posters/conjuring 2.jpeg",
    desc: "Ed dan Lorraine Warren pergi ke Enfield, London, untuk membantu seorang ibu tunggal dan anak-anaknya yang diteror oleh roh jahat, dikenal dengan kasus 'Enfield Poltergeist'."
  },
  {
    title: "Annabelle: Creation",
    year: 2017,
    cat: "Annabelle",
    rating: 7.5,
    img: "/images/posters/anabelle 2.jpeg",
    desc: "Beberapa tahun setelah kehilangan putrinya, seorang pembuat boneka dan istrinya membuka rumah mereka untuk anak-anak yatim, namun boneka ciptaannya membawa teror mengerikan."
  },
  {
    title: "The Nun",
    year: 2018,
    cat: "The Nun",
    rating: 9.3,
    img: "/images/posters/the nun1.jpeg",
    desc: "Seorang biarawati muda dan seorang pendeta dikirim Vatikan ke biara terpencil di Rumania untuk menyelidiki kematian misterius seorang suster, dan menghadapi iblis Valak."
  },
  {
    title: "Annabelle Comes Home",
    year: 2019,
    cat: "Annabelle",
    rating: 8.9,
    img: "/images/posters/anabelle 3.jpeg",
    desc: "Ketika pasangan Warren meninggalkan rumah, Annabelle membangkitkan roh-roh jahat yang terperangkap di museum okultisme mereka dan mengancam putri mereka, Judy."
  },
  {
    title: "The Conjuring: The Devil Made Me Do It",
    year: 2021,
    cat: "Utama",
    rating: 8.3,
    img: "/images/posters/conjuring 3.jpeg",
    desc: "Kasus eksorsisme berubah menjadi sidang pengadilan pertama di AS di mana terdakwa mengklaim tidak bersalah karena kerasukan iblis, memaksa Ed dan Lorraine mengungkap kebenaran gelap."
  },
  {
    title: "The Nun II",
    year: 2023,
    cat: "The Nun",
    rating: 8.6,
    img: "/images/posters/thenun 2.jpeg",
    desc: "Empat tahun setelah peristiwa pertama, Suster Irene kembali menghadapi kejahatan Valak yang bangkit kembali di sekolah Katolik Prancis tahun 1956."
  }
]



    // Render grid film
    const grid = $("#film-grid")
    const modal = $("#detail-modal")
    const modalBody = $("#modal-body")

    function renderFilms(list) {
      if (!grid) return
      grid.innerHTML = ""
      list.forEach((f, idx) => {
        const card = document.createElement("article")
        card.className = "film reveal"
        const posterUrl = `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(`poster ${f.title}`)}`
        card.innerHTML = `
          <div class="film__media" aria-hidden="true">
            <img class="film__img" src="${f.img}" alt="Poster ${f.title}" loading="lazy" decoding="async" onerror="this.src='/assets/img/default.jpg'">
            <span class="film__pill">${f.year}</span>
          </div>
          <div class="film__body">
            <h4 class="film__heading">
              <span class="film__kicker">${f.cat}</span>
              <span class="film__title">${f.title}</span>
            </h4>
            <p class="film__excerpt">Pengalaman horor dalam semesta Conjuring. Telusuri kasus-kasus ikonik keluarga Warren.</p>
            <div class="film__footer">
              <div class="film__price">⭐ ${f.rating}</div>
              <button class="btn btn--primary" data-detail="${idx}" type="button">Detail</button>
            </div>
          </div>
        `
        grid.appendChild(card)
      })
      // Apply reveal to newly created
      $$(".film.reveal").forEach((el) => el.classList.add("is-visible"))
      // Beri event agar efek tilt aktif untuk kartu yang baru dibuat
      document.dispatchEvent(new Event("films:rendered"))
    }

    // Filter chips
    const filterBar = $(".filters")
    if (grid) {
      renderFilms(films)
      if (filterBar) {
        filterBar.addEventListener("click", (e) => {
          const btn = e.target.closest(".chip")
          if (!btn) return
          $$(".chip", filterBar).forEach((b) => {
            b.classList.toggle("is-active", b === btn)
            b.setAttribute("aria-pressed", String(b === btn))
          })
          const cat = btn.dataset.filter
          const list = cat === "all" ? films : films.filter((f) => f.cat === cat)
          renderFilms(list)
        })
      }
    }

    // Modal detail
    function openDetail(index) {
      const f = films[index]
      if (!f || !modal || !modalBody) return
      modalBody.innerHTML = `
        <div class="modal-poster">
          <img src="${f.img}" alt="Poster ${f.title}" class="modal-img" loading="lazy" decoding="async" onerror="this.src='/assets/img/default.jpg'">
        </div>
        <div class="modal-info">
          <h3 id="modal-title" style="margin-top:0">${f.title}</h3>
          <p class="muted">${f.year} • Kategori: ${f.cat} • Rating: ⭐ ${f.rating}</p>
          <p>${f.desc}</p>
        </div>



      `
      modal.showModal()
    }
    if (grid && modal) {
      grid.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-detail]")
        if (!btn) return
        openDetail(Number(btn.dataset.detail))
      })
      modal.addEventListener("click", (e) => {
        if (e.target.hasAttribute("data-close") || e.target === modal) modal.close()
      })
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.open) modal.close()
      })
    }

    // Form Kontak -> simpan ke localStorage
    const form = $("#review-form")
    const status = $("#form-status")
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
          form.reportValidity()
          return
        }
        const data = {
          nama: $("#nama")?.value.trim(),
          email: $("#email")?.value.trim(),
          judul: $("#judul")?.value,
          rating: Number($("#rating")?.value),
          pesan: $("#pesan")?.value.trim(),
          time: new Date().toISOString(),
        }
        const key = "userReviews"
        const prev = JSON.parse(localStorage.getItem(key) || "[]")
        prev.unshift(data)
        localStorage.setItem(key, JSON.stringify(prev))
        if (status) {
          status.textContent = "Terima kasih! Review Anda disimpan di perangkat ini."
        }
        form.reset()
      })
    }

    // Tampilkan review pengguna di review.html
    const userReviewsWrap = $("#user-reviews")
    if (userReviewsWrap) {
      const list = JSON.parse(localStorage.getItem("userReviews") || "[]")
      if (!list.length) {
        userReviewsWrap.innerHTML = '<p class="muted">Belum ada review tersimpan.</p>'
      } else {
        userReviewsWrap.innerHTML = ""
        list.forEach((r) => {
          const art = document.createElement("article")
          art.className = "card"
          art.innerHTML = `
            <h4 style="margin:0">${r.judul} — ⭐ ${r.rating}</h4>
            <p class="muted" style="margin:.25rem 0 .5rem">oleh ${r.nama}</p>
            <p style="margin:0">${r.pesan}</p>
          `
          userReviewsWrap.appendChild(art)
        })
      }
    }

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    function enableTilt(els) {
      if (prefersReduced || !els?.length) return
      els.forEach((el) => {
        let rect
        const max = 8 // derajat
        function setTilt(e) {
          rect = rect || el.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width
          const y = (e.clientY - rect.top) / rect.height
          const ry = (0.5 - x) * max
          const rx = (y - 0.5) * max
          el.style.setProperty("--rx", `${rx}deg`)
          el.style.setProperty("--ry", `${ry}deg`)
        }
        function resetTilt() {
          el.style.setProperty("--rx", "0deg")
          el.style.setProperty("--ry", "0deg")
          rect = undefined
        }
        el.addEventListener("mousemove", setTilt)
        el.addEventListener("mouseleave", resetTilt)
        el.addEventListener("blur", resetTilt, true)
      })
    }

    if (!prefersReduced) {
      const move = (e) => {
        document.body.style.setProperty("--mx", `${e.clientX}px`)
        document.body.style.setProperty("--my", `${e.clientY}px`)
      }
      window.addEventListener("pointermove", move, { passive: true })
    }

    function attachTiltToPanels() {
      const panelEls = Array.from(document.querySelectorAll(".card, .form, .hero__card, .modal__content, .film"))
      enableTilt(panelEls)
    }
    attachTiltToPanels()

    const originalRenderFilms = typeof renderFilms === "function" ? renderFilms : null
    // Jika fungsi renderFilms dideklarasikan di bawah, kita 'monkey patch' setelah deklarasinya lewat event khusus.
    document.addEventListener("films:rendered", attachTiltToPanels)

    // Intersep pembuatan kartu film pada fungsi renderFilms yang ada
    // Dengan membungkus ulang referensi global setelah definisi asli diparsing.
    const _defineRender = (fn) => {
      window.__renderFilms = fn
    }
    // Hook sederhana: jika fungsi global __renderFilms dipasang, panggil setelah render selesai
    const observer = new MutationObserver(() => {
      if (window.__renderFilms && !window.__renderFilms.__patched) {
        const base = window.__renderFilms
        const patched = function (...args) {
          const out = base.apply(this, args)
          document.dispatchEvent(new Event("films:rendered"))
          return out
        }
        patched.__patched = true
        window.__renderFilms = patched
      }
    })
    observer.observe(document.documentElement, { subtree: true, childList: true })
  })

  // =======================
// Small UI validation helper
// Adds red error messages under empty/invalid fields on submit
// Non-invasive: doesn't change existing handlers, only enhances UX.
// =======================
;(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // cari form yang kemungkinan adalah kontak: gunakan heuristik (ada field nama/email/pesan)
    const candidateForms = Array.from(document.querySelectorAll("form"));
    const targetForms = candidateForms.filter((fm) =>
      fm.querySelector("#nama, [name='nama'], #email, [name='email'], #pesan, [name='pesan']")
    );

    if (!targetForms.length) return;

    targetForms.forEach((form) => {
      // buat wadah status (jika belum ada) untuk pesan form-level
      let status = form.querySelector(".validation-status");
      if (!status) {
        status = document.createElement("div");
        status.className = "validation-status";
        // tempatkan di atas tombol submit (jika ditemukan) atau di akhir form
        const submit = form.querySelector("[type='submit'], .form__actions");
        if (submit && submit.parentNode) submit.parentNode.insertBefore(status, submit);
        else form.appendChild(status);
      }

      // fungsi bantu untuk tampilkan pesan di bawah field
      const showFieldError = (field) => {
        // jangan duplikat
        let el = field.nextElementSibling;
        if (el && el.classList && el.classList.contains("error-message")) return;
        const msg = field.validationMessage || "Mohon isi kolom ini dengan benar.";
        const warn = document.createElement("div");
        warn.className = "error-message";
        warn.textContent = msg;
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
        // sisipkan setelah field
        if (field.parentNode) field.parentNode.insertBefore(warn, field.nextSibling);
      }

      const clearFieldError = (field) => {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
        const el = field.nextElementSibling;
        if (el && el.classList && el.classList.contains("error-message")) el.remove();
      }

      const clearAllErrors = () => {
        form.querySelectorAll(".error-message").forEach((e) => e.remove());
        form.querySelectorAll(".is-invalid").forEach((f) => {
          f.classList.remove("is-invalid");
          f.removeAttribute("aria-invalid");
        });
        if (status) status.textContent = "";
        status.classList.remove("status-error");
      }

      // saat submit: cek validity, tampilkan pesan merah untuk setiap field invalid
      form.addEventListener("submit", (ev) => {
        // Allow built-in validation to run, but intercept to show nicer messages
        if (!form.checkValidity()) {
          ev.preventDefault();
          ev.stopPropagation();
          clearAllErrors();

          // tampilkan field-level errors
          const fields = Array.from(form.querySelectorAll("input, textarea, select"));
          const firstInvalid = fields.find((f) => !f.checkValidity());
          fields.forEach((f) => {
            if (!f.checkValidity()) showFieldError(f);
          });

          // tampilkan pesan form-level singkat
          if (status) {
            status.textContent = "Terdapat isian yang kosong atau tidak valid. Periksa kolom berwarna merah.";
            status.classList.add("status-error");
          }

          // fokus ke field invalid pertama supaya pengguna tahu harus mulai di mana
          if (firstInvalid) firstInvalid.focus();
        } else {
          // valid — hapus pesan error UI (tetap biarkan handler lain melanjutkan)
          clearAllErrors();
        }
      }, { capture: true });

      // Hilangkan pesan saat user mulai mengetik / mengubah
      form.addEventListener("input", (e) => {
        const f = e.target;
        if (f && (f.matches("input, textarea, select"))) clearFieldError(f);
      });

      // Tangani invalid event (untuk browser yang memicu invalid before submit)
      form.addEventListener("invalid", (e) => {
        // tampilkan pesan di field yang invalid
        e.preventDefault(); // cegah bubble native tooltip
        const f = e.target;
        clearFieldError(f);
        showFieldError(f);
        if (status) {
          status.textContent = "Perbaiki isian yang diberi tanda merah.";
          status.classList.add("status-error");
        }
      }, true);
    });
  });
})();

})()
