/* =============================================
   DULCE TENTACIÓN — script.js
   ============================================= */

/* ── MODO OSCURO / CLARO ── */
const themeBtn   = document.getElementById('themeBtn');
const themeIcon  = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.textContent  = isDark ? '☾' : '☀';
  themeLabel.textContent = isDark ? 'Modo oscuro' : 'Modo claro';
});

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => revealObserver.observe(r));

/* ── FOTO DEL GRUPO ── */
const bandInput = document.getElementById('bandPhotoInput');
const bandBox   = document.getElementById('bandPhotoBox');
const bandHint  = document.getElementById('bandHint');

bandInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const existing = bandBox.querySelector('img');
  if (existing) existing.remove();
  const img = document.createElement('img');
  img.src = url;
  bandBox.appendChild(img);
  bandHint.style.display = 'none';
});

/* ── SUBIDA DE CANCIONES ── */
let pendingAudio = null;
const audioInput = document.getElementById('audioInput');
const uploadZone = document.getElementById('uploadZone');
const metaForm   = document.getElementById('songMetaForm');

// Drag & Drop
uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag');
});
uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag');
});
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('audio/')) openMetaForm(file);
});

// Selección por clic
audioInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) openMetaForm(file);
  audioInput.value = '';
});

// Abrir formulario de metadatos
function openMetaForm(file) {
  pendingAudio = file;
  document.getElementById('songTitle').value = file.name.replace(/\.[^/.]+$/, '');
  metaForm.classList.add('visible');
  metaForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Cancelar
document.getElementById('cancelSongBtn').addEventListener('click', () => {
  metaForm.classList.remove('visible');
  pendingAudio = null;
});

// Añadir canción
document.getElementById('addSongBtn').addEventListener('click', () => {
  const title  = document.getElementById('songTitle').value.trim()  || 'Sin título';
  const artist = document.getElementById('songArtist').value.trim() || 'Dulce Tentación';
  const genre  = document.getElementById('songGenre').value;
  const year   = document.getElementById('songYear').value;
  const desc   = document.getElementById('songDesc').value.trim()   || 'Sin descripción.';

  if (!pendingAudio) return;

  const url = URL.createObjectURL(pendingAudio);
  addSongCard({ title, artist, genre, year, desc, url });

  // Resetear formulario
  metaForm.classList.remove('visible');
  pendingAudio = null;
  document.getElementById('songTitle').value  = '';
  document.getElementById('songArtist').value = 'Dulce Tentación';
  document.getElementById('songDesc').value   = '';
  document.getElementById('songYear').value   = '';
});

// Crear tarjeta de canción
function addSongCard({ title, artist, genre, year, desc, url }) {
  document.getElementById('noSongs')?.remove();

  const card = document.createElement('div');
  card.className = 'song-card';
  card.innerHTML = `
    <button class="song-delete" title="Eliminar">✕</button>
    <div class="song-header">
      <div class="song-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      </div>
      <div>
        <div class="song-title">${esc(title)}</div>
        <div class="song-artist">${esc(artist)}${year ? ' · ' + esc(year) : ''}</div>
      </div>
    </div>
    <div class="song-badge">${esc(genre)}</div>
    <div class="song-desc">${esc(desc)}</div>
    <div class="audio-player">
      <audio controls src="${url}"></audio>
    </div>
  `;

  // Botón eliminar
  card.querySelector('.song-delete').addEventListener('click', () => {
    card.remove();
    if (!document.querySelectorAll('.song-card').length) {
      const empty = document.createElement('div');
      empty.className = 'no-songs';
      empty.id = 'noSongs';
      empty.innerHTML = `
        <div>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
          <p>Aún no hay canciones. ¡Sube la primera!</p>
        </div>`;
      document.getElementById('songsGrid').appendChild(empty);
    }
  });

  document.getElementById('songsGrid').appendChild(card);
}

// Escapar HTML para evitar XSS
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
