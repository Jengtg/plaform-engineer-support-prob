// Dashboard Status Container (Soal 1)
// Mengambil data container dari Docker API via proxy nginx (same-origin,
// sehingga bisa pakai path relatif: /containers/json).

const API_BASE = ''; // empty = same-origin (diproxy nginx ke unix socket docker)

const $ = (id) => document.getElementById(id);

// Label yang dipakai untuk menentukan environment
const ENV_LABEL = 'com.project.env';
const UNKNOWN_ENV = 'unknown';

// Status yang dianggap "bermasalah" (untuk tanda visual, bukan penilaian)
const BROKEN_STATES = ['restarting', 'exited', 'dead'];

const statusBadgeClass = (status) => {
  if (status === 'running') return 'st-running';
  if (status === 'restarting') return 'st-restarting';
  if (status === 'created') return 'st-created';
  return 'st-exited';
};

const envBadgeClass = (env) => `env-${env}`;

function setStatus(msg, busy) {
  const el = $('status');
  el.innerHTML = busy ? `<span class="spinner"></span> ${msg}` : msg;
}

function showError(msg) {
  const el = $('error');
  el.style.display = 'block';
  el.textContent = msg;
}

// Kelompokkan container berdasarkan environment (label com.project.env)
function groupByEnv(containers) {
  const groups = {};
  for (const c of containers) {
    const env = (c.Labels?.[ENV_LABEL]) || UNKNOWN_ENV;
    if (!groups[env]) {
      groups[env] = [];
    }
    groups[env].push(c);
  }
  return groups;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

function renderCard(c) {
  const name = (c.Names?.[0]) || c.Id;
  const cleanName = name.replace(/^\//, '');
  const status = (c.State || 'unknown').toLowerCase();
  const detailStatus = c.Status || 'n/a';
  const image = c.Image || 'n/a';
  const shortId = (c.Id || '').slice(0, 12);
  const broken = BROKEN_STATES.some((s) => status.includes(s));

return `
    <div class="card ${broken ? 'broken' : ''}">
      <div class="card-head">
        <span class="name">${escapeHtml(cleanName)}</span>
        <span class="status-badge ${statusBadgeClass(status)}">${escapeHtml(status.toUpperCase())}</span>
      </div>
      <div class="row"><span class="label">Image</span><span class="value">${escapeHtml(image)}</span></div>
      <div class="row"><span class="label">Container ID</span><span class="value">${escapeHtml(shortId)}</span></div>
      <div class="row"><span class="label">Uptime</span><span class="value">${escapeHtml(detailStatus)}</span></div>
      <div class="row"><span class="label">Created</span><span class="value">${escapeHtml(c.Created ? new Date(c.Created * 1000).toLocaleString('id-ID') : 'n/a')}</span></div>
    </div>
  `;
}

function render(containers) {
  const groups = groupByEnv(containers);
  const host = $('groups');
  host.innerHTML = '';

  const envOrder = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  for (const env of envOrder) {
    const list = groups[env];
    const section = document.createElement('section');
    section.className = 'env-group';
    section.innerHTML = `
      <h2>
        <span class="env-badge ${envBadgeClass(env)}">${escapeHtml(env)}</span>
        <span class="count">${list.length}</span>
      </h2>
      <div class="card-grid">${list.map(renderCard).join('')}</div>
    `;
    host.appendChild(section);
  }

  if (envOrder.length === 0) {
    host.innerHTML = '<div class="empty">Tidak ada container ditemukan.</div>';
  }
}

async function fetchContainers() {
  setStatus('Memuat data...', true);
  $('error').style.display = 'none';

  try {
    const res = await fetch(`${API_BASE}/containers/json?all=1`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const containers = await res.json();
    render(containers);
    const total = containers.length;
    const broken = containers.filter((c) =>
      BROKEN_STATES.some((s) => (c.Status || '').toLowerCase().includes(s))
    ).length;
    setStatus(`${total} container · ${broken} bermasalah`, false);
  } catch (err) {
    showError(`Gagal mengambil data dari Docker API: ${err.message}`);
    setStatus('Gagal', false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $('refresh').addEventListener('click', fetchContainers);
  fetchContainers();
  setInterval(fetchContainers, 5000); // auto-refresh ringan
});
