document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 🔐 SUPABASE CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://slelabwkeijziuefyjob.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZWxhYndrZWlqeml1ZWZ5am9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NzIwMDcsImV4cCI6MjA5NzM0ODAwN30.DMSv1vndksl7TM-8JzN1BSljogyVFCF2CUR5ybyMY7o';

  const ADMIN_PASSWORD = 'mellon123';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ============================================
  // 📋 DOM ELEMENTS - Login
  // ============================================
  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const loginErrorMsg = document.getElementById('loginErrorMsg');

  // ============================================
  // 📋 DOM ELEMENTS - Dashboard
  // ============================================
  const dashboard = document.getElementById('adminDashboard');
  const logoutBtn = document.getElementById('logoutBtn');
  const totalCount = document.getElementById('totalCount');
  const lastUpdated = document.getElementById('lastUpdated');

  // ============================================
  // 📋 DOM ELEMENTS - Collaborators Tab
  // ============================================
  const collabTableBody = document.getElementById('collabTableBody');
  const searchInput = document.getElementById('searchInput');
  const filterGender = document.getElementById('filterGender');
  const filterMarital = document.getElementById('filterMarital');
  const collabBadge = document.getElementById('collabBadge');

  // ============================================
  // 📋 DOM ELEMENTS - Feedback Tab
  // ============================================
  const feedbackTableBody = document.getElementById('feedbackTableBody');
  const feedbackSearch = document.getElementById('feedbackSearch');
  const feedbackBadge = document.getElementById('feedbackBadge');

  // ============================================
  // 📋 DOM ELEMENTS - Detail Modals
  // ============================================
  const detailModal = document.getElementById('detailModal');
  const detailBody = document.getElementById('detailBody');
  const detailClose = document.getElementById('detailClose');

  const feedbackDetailModal = document.getElementById('feedbackDetailModal');
  const feedbackDetailBody = document.getElementById('feedbackDetailBody');
  const feedbackDetailClose = document.getElementById('feedbackDetailClose');

  // ============================================
  // 📋 DOM ELEMENTS - Tabs
  // ============================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // ============================================
  // 🔐 LOGIN FUNCTION
  // ============================================
  function handleLogin(e) {
    e.preventDefault();
    const password = loginPassword.value.trim();

    if (password === ADMIN_PASSWORD) {
      loginOverlay.classList.add('hidden');
      dashboard.classList.add('visible');
      loginError.classList.remove('show');
      loginPassword.value = '';
      loadAllData();
      setTimeout(() => searchInput.focus(), 500);
    } else {
      loginErrorMsg.textContent = 'Invalid password. Please try again.';
      loginError.classList.add('show');
      loginPassword.value = '';
      loginPassword.focus();
    }
  }

  // ============================================
  // 🚪 LOGOUT FUNCTION
  // ============================================
  function handleLogout() {
    if (confirm('Are you sure you want to leave the Red Book?')) {
      dashboard.classList.remove('visible');
      loginOverlay.classList.remove('hidden');
      loginPassword.value = '';
      loginError.classList.remove('show');
    }
  }

  // ============================================
  // 📥 LOAD ALL DATA
  // ============================================
  async function loadAllData() {
    await Promise.all([
      loadCollaborators(),
      loadFeedback()
    ]);
  }

  // ============================================
  // 👥 LOAD COLLABORATORS
  // ============================================
  window.loadCollaborators = async function() {
    collabTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="loading-state">
            <i class="fas fa-spinner fa-pulse"></i>
            <p>Loading applications...</p>
          </div>
        </td>
      </tr>
    `;

    try {
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        collabTableBody.innerHTML = `
          <tr>
            <td colspan="8">
              <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No applications yet. The Red Book is waiting for tales...</p>
              </div>
            </td>
          </tr>
        `;
        collabBadge.textContent = '0';
        return;
      }

      window.collabData = data;
      renderCollaborators(data);
      collabBadge.textContent = data.length;
      updateTotalCount('collaborators');

    } catch (error) {
      console.error('❌ Error loading collaborators:', error);
      collabTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state" style="color: #dc3545;">
              <i class="fas fa-exclamation-triangle"></i>
              <p>Error loading applications. Please try again.</p>
              <p style="font-size: 13px; margin-top: 6px;">${error.message}</p>
            </div>
          </td>
        </tr>
      `;
    }
  };

  // ============================================
  // 💬 LOAD FEEDBACK
  // ============================================
  window.loadFeedback = async function() {
    feedbackTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="loading-state">
            <i class="fas fa-spinner fa-pulse"></i>
            <p>Loading feedback...</p>
          </div>
        </td>
      </tr>
    `;

    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        feedbackTableBody.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="empty-state">
                <i class="fas fa-comment-slash"></i>
                <p>No feedback yet. The council awaits word...</p>
              </div>
            </td>
          </tr>
        `;
        feedbackBadge.textContent = '0';
        return;
      }

      window.feedbackData = data;
      renderFeedback(data);
      feedbackBadge.textContent = data.length;
      updateTotalCount('feedback');

    } catch (error) {
      console.error('❌ Error loading feedback:', error);
      feedbackTableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state" style="color: #dc3545;">
              <i class="fas fa-exclamation-triangle"></i>
              <p>Error loading feedback. Please try again.</p>
              <p style="font-size: 13px; margin-top: 6px;">${error.message}</p>
            </div>
          </td>
        </tr>
      `;
    }
  };

  // ============================================
  // 🎨 RENDER COLLABORATORS
  // ============================================
  function renderCollaborators(data) {
    if (!data || data.length === 0) {
      collabTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <i class="fas fa-book-open"></i>
              <p>No matching applications found.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    collabTableBody.innerHTML = data.map(row => {
      const nationalityBadge = getNationalityBadge(row.nationality);
      const submittedDate = new Date(row.created_at).toLocaleDateString();

      return `
        <tr>
          <td>${row.id}</td>
          <td><strong>${row.name}</strong></td>
          <td><span class="email">${row.email}</span></td>
          <td>${row.phone}</td>
          <td><span class="badge ${nationalityBadge.class}">${row.nationality}</span></td>
          <td>${row.gender || '—'}</td>
          <td>${submittedDate}</td>
          <td>
            <div class="action-btns">
              <button class="btn-view" onclick="viewCollabDetails(${row.id})"><i class="fas fa-eye"></i></button>
              <button class="btn-delete" onclick="deleteCollab(${row.id})"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ============================================
  // 🎨 RENDER FEEDBACK
  // ============================================
  function renderFeedback(data) {
    if (!data || data.length === 0) {
      feedbackTableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i class="fas fa-comment-slash"></i>
              <p>No matching feedback found.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    feedbackTableBody.innerHTML = data.map(row => {
      const submittedDate = new Date(row.created_at).toLocaleDateString();
      const message = row.message.length > 60 ? row.message.substring(0, 60) + '...' : row.message;

      return `
        <tr>
          <td>${row.id}</td>
          <td><strong>${row.name}</strong></td>
          <td><span class="email">${row.email}</span></td>
          <td>${message}</td>
          <td>${submittedDate}</td>
          <td>
            <div class="action-btns">
              <button class="btn-view" onclick="viewFeedbackDetails(${row.id})"><i class="fas fa-eye"></i></button>
              <button class="btn-delete" onclick="deleteFeedback(${row.id})"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ============================================
  // 🏷️ NATIONALITY BADGE
  // ============================================
  function getNationalityBadge(nationality) {
    const lower = (nationality || '').toLowerCase();
    if (lower.includes('gondor')) return { class: 'badge-gondor' };
    if (lower.includes('rohan')) return { class: 'badge-rohan' };
    if (lower.includes('elf') || lower.includes('elven')) return { class: 'badge-elf' };
    if (lower.includes('dwarf') || lower.includes('erebor')) return { class: 'badge-dwarf' };
    if (lower.includes('hobbit') || lower.includes('shire')) return { class: 'badge-hobbit' };
    return { class: 'badge-other' };
  }

  // ============================================
  // 🔍 FILTER & SEARCH - Collaborators
  // ============================================
  function filterCollaborators() {
    const search = searchInput.value.toLowerCase();
    const gender = filterGender.value;
    const marital = filterMarital.value;

    if (!window.collabData) return;

    let filtered = window.collabData.filter(row => {
      const matchSearch = !search ||
        row.name.toLowerCase().includes(search) ||
        row.email.toLowerCase().includes(search) ||
        (row.nationality || '').toLowerCase().includes(search);

      const matchGender = !gender || row.gender === gender;
      const matchMarital = !marital || row.marital_status === marital;

      return matchSearch && matchGender && matchMarital;
    });

    renderCollaborators(filtered);
    updateTotalCount('collaborators', filtered.length);
  }

  // ============================================
  // 🔍 SEARCH - Feedback
  // ============================================
  function filterFeedback() {
    const search = feedbackSearch.value.toLowerCase();

    if (!window.feedbackData) return;

    let filtered = window.feedbackData.filter(row => {
      return !search ||
        row.name.toLowerCase().includes(search) ||
        row.email.toLowerCase().includes(search) ||
        row.message.toLowerCase().includes(search);
    });

    renderFeedback(filtered);
    updateTotalCount('feedback', filtered.length);
  }

  // ============================================
  // 👁️ VIEW COLLAB DETAILS
  // ============================================
  window.viewCollabDetails = async function(id) {
    try {
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      detailBody.innerHTML = `
        <div class="field">
          <label><i class="fas fa-user"></i> Full Name</label>
          <div class="value">${data.name}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-envelope"></i> Email</label>
          <div class="value">${data.email}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-phone"></i> Phone</label>
          <div class="value">${data.phone}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-home"></i> Address</label>
          <div class="value">${data.address}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-calendar-alt"></i> Date of Birth</label>
          <div class="value">${data.dob}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-map-pin"></i> Postal Code</label>
          <div class="value">${data.postal_code || '—'}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-venus-mars"></i> Gender</label>
          <div class="value">${data.gender || '—'}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-heart"></i> Marital Status</label>
          <div class="value">${data.marital_status || '—'}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-globe"></i> Nationality</label>
          <div class="value">${data.nationality}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-graduation-cap"></i> Education</label>
          <div class="value">${data.education || '—'}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-language"></i> Languages</label>
          <div class="value">${data.languages || '—'}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-tools"></i> Skills</label>
          <div class="value">${data.skills || '—'}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-music"></i> Hobbies</label>
          <div class="value">${data.hobbies || '—'}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-clock"></i> Submitted</label>
          <div class="value">${new Date(data.created_at).toLocaleString()}</div>
        </div>
      `;

      detailModal.classList.add('active');

    } catch (error) {
      console.error('❌ Error fetching details:', error);
      alert('Error loading application details.');
    }
  };

  // ============================================
  // 👁️ VIEW FEEDBACK DETAILS
  // ============================================
  window.viewFeedbackDetails = async function(id) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      feedbackDetailBody.innerHTML = `
        <div class="field">
          <label><i class="fas fa-user"></i> Name</label>
          <div class="value">${data.name}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-envelope"></i> Email</label>
          <div class="value">${data.email}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-comment"></i> Message</label>
          <div class="value" style="white-space: pre-wrap; line-height: 1.6;">${data.message}</div>
        </div>
        <div class="field">
          <label><i class="fas fa-clock"></i> Submitted</label>
          <div class="value">${new Date(data.created_at).toLocaleString()}</div>
        </div>
      `;

      feedbackDetailModal.classList.add('active');

    } catch (error) {
      console.error('❌ Error fetching feedback details:', error);
      alert('Error loading feedback details.');
    }
  };

  // ============================================
  // 🗑️ DELETE COLLABORATOR
  // ============================================
  window.deleteCollab = async function(id) {
    if (!confirm('Are you sure you want to delete this application? This cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadCollaborators();
      alert('✅ Application deleted successfully.');

    } catch (error) {
      console.error('❌ Error deleting:', error);
      alert('Error deleting application.');
    }
  };

  // ============================================
  // 🗑️ DELETE FEEDBACK
  // ============================================
  window.deleteFeedback = async function(id) {
    if (!confirm('Are you sure you want to delete this feedback? This cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadFeedback();
      alert('✅ Feedback deleted successfully.');

    } catch (error) {
      console.error('❌ Error deleting feedback:', error);
      alert('Error deleting feedback.');
    }
  };

  // ============================================
  // 📊 UPDATE STATS & COUNTS
  // ============================================
  function updateTotalCount(tab, count) {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      const currentTab = activeTab.dataset.tab;
      if (tab === currentTab) {
        totalCount.textContent = count !== undefined ? count : (tab === 'collaborators' ? (window.collabData ? window.collabData.length : 0) : (window.feedbackData ? window.feedbackData.length : 0));
      }
    }
    lastUpdated.textContent = new Date().toLocaleTimeString();
  }

  // ============================================
  // 🎛️ TAB SWITCHING
  // ============================================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      const tabId = this.dataset.tab;
      document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1)).classList.add('active');

      // Update stats
      if (tabId === 'collaborators') {
        totalCount.textContent = window.collabData ? window.collabData.length : 0;
        setTimeout(() => searchInput.focus(), 100);
      } else {
        totalCount.textContent = window.feedbackData ? window.feedbackData.length : 0;
        setTimeout(() => feedbackSearch.focus(), 100);
      }
    });
  });

  // ============================================
  // 🎛️ DETAIL MODAL CONTROLS
  // ============================================
  detailClose.addEventListener('click', () => {
    detailModal.classList.remove('active');
  });

  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove('active');
    }
  });

  feedbackDetailClose.addEventListener('click', () => {
    feedbackDetailModal.classList.remove('active');
  });

  feedbackDetailModal.addEventListener('click', (e) => {
    if (e.target === feedbackDetailModal) {
      feedbackDetailModal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (detailModal.classList.contains('active')) {
        detailModal.classList.remove('active');
      }
      if (feedbackDetailModal.classList.contains('active')) {
        feedbackDetailModal.classList.remove('active');
      }
    }
  });

  // ============================================
  // 🚀 EVENT LISTENERS
  // ============================================
  loginForm.addEventListener('submit', handleLogin);

  loginPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loginForm.dispatchEvent(new Event('submit'));
    }
  });

  logoutBtn.addEventListener('click', handleLogout);

  searchInput.addEventListener('input', filterCollaborators);
  filterGender.addEventListener('change', filterCollaborators);
  filterMarital.addEventListener('change', filterCollaborators);
  feedbackSearch.addEventListener('input', filterFeedback);

  // ============================================
  // 🧹 INIT
  // ============================================
  loginPassword.focus();

  console.log('🧙‍♂️ Admin Dashboard ready with login protection + Feedback tab!');

  // ============================================
  // 🔄 AUTO-REFRESH
  // ============================================
  setInterval(() => {
    if (dashboard.classList.contains('visible')) {
      loadAllData();
    }
  }, 60000);

  // Expose functions globally
  window.loadAllData = loadAllData;
  window.loadCollaborators = loadCollaborators;
  window.loadFeedback = loadFeedback;

});