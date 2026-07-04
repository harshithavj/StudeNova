const API_BASE_URL = window.STUDENOVA_ADMIN_API_URL || 'http://localhost:5100/api';
const tokenKey = 'studenova_admin_token';
const userKey = 'studenova_admin_user';

const loginView = document.querySelector('#loginView');
const dashboardView = document.querySelector('#dashboardView');
const loginForm = document.querySelector('#loginForm');
const loginButton = document.querySelector('#loginButton');
const loginMessage = document.querySelector('#loginMessage');
const formTitle = document.querySelector('#formTitle');
const formSubtitle = document.querySelector('#formSubtitle');
const nameField = document.querySelector('#nameField');
const confirmPasswordField = document.querySelector('#confirmPasswordField');
const otpField = document.querySelector('#otpField');
const otpButton = document.querySelector('#otpButton');
const toggleModeButton = document.querySelector('#toggleModeButton');
const adminEmail = document.querySelector('#adminEmail');
const refreshButton = document.querySelector('#refreshButton');
const logoutButton = document.querySelector('#logoutButton');
const notificationForm = document.querySelector('#notificationForm');
const notificationMessage = document.querySelector('#notificationMessage');
let authMode = 'login';
let otpSent = false;
let verificationRequests = [];
let liveActivityTimer = null;

const pageTitles = {
  dashboard: 'Dashboard',
  verification: 'Verification Center',
  monitoring: 'Platform Monitoring',
  users: 'User Management',
  achievements: 'Achievement Verification',
  reports: 'Reports & Notifications',
  analytics: 'Analytics',
  'audit-logs': 'Audit Logs',
  settings: 'Settings'
};

const pageAliases = {
  notifications: 'reports'
};

const pageSections = [
  '#overview',
  '#verificationCenter',
  '#platformMonitoring',
  '.event-monitoring-panel',
  '.lower-grid',
  '#userManagement',
  '#studentsManagementPanel',
  '#collegeManagementPanel',
  '#industryManagementPanel',
  '#collegeVerificationPanel',
  '#industryVerificationPanel',
  '#achievementVerificationPage',
  '#achievementVerification',
  '#reportsModerationPage',
  '#reportsModeration',
  '#analyticsPage',
  '#analytics',
  '#auditLogsPage',
  '#auditLogs',
  '#settingsPage',
  '#settings'
];

const pageSectionMap = {
  dashboard: ['#overview', '.lower-grid'],
  verification: ['#verificationCenter', '#collegeVerificationPanel', '#industryVerificationPanel'],
  monitoring: ['#platformMonitoring', '.event-monitoring-panel', '.lower-grid'],
  users: ['#userManagement', '#studentsManagementPanel', '#collegeManagementPanel', '#industryManagementPanel'],
  achievements: ['#achievementVerificationPage', '#achievementVerification'],
  reports: ['#reportsModerationPage', '#reportsModeration'],
  analytics: ['#analyticsPage', '#analytics'],
  'audit-logs': ['#auditLogsPage', '#auditLogs'],
  settings: ['#settingsPage', '#settings']
};

const numberFormatter = new Intl.NumberFormat('en-IN');
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
});

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(userKey));
  } catch {
    return null;
  }
}

function setMessage(message, isError = true) {
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? '#ff5f6d' : '#0f766e';
}

function formatNumber(value) {
  return numberFormatter.format(value || 0);
}

function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : 'No date';
}

function showToast(message, type = 'error') {
  // Remove existing toasts first to prevent stacking
  document.querySelectorAll('.toast').forEach((t) => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

function showDashboard() {
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  const user = readSavedUser();
  adminEmail.textContent = user?.email || 'Admin';
  showAdminPage(getCurrentPage());
}

function showLogin() {
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
  if (liveActivityTimer) {
    clearInterval(liveActivityTimer);
    liveActivityTimer = null;
  }
}

function updateOtpButtonLabel() {
  if (otpSent) {
    otpButton.textContent = 'Resend OTP';
    return;
  }
  otpButton.textContent = 'Send OTP to Email';
}

function setAuthMode(mode) {
  authMode = mode;
  otpSent = false;
  loginForm.reset();
  setMessage('');
  const isSignup = mode === 'signup';

  formTitle.textContent = isSignup ? 'Admin Signup' : 'Admin Login';
  formSubtitle.textContent = isSignup
    ? 'Verify your email with OTP before creating an admin account.'
    : 'Only admin accounts can enter this console.';
  nameField.classList.toggle('hidden', !isSignup);
  confirmPasswordField.classList.toggle('hidden', !isSignup);
  otpField.classList.toggle('hidden', !isSignup);
  otpButton.classList.toggle('hidden', !isSignup);
  updateOtpButtonLabel();
  loginButton.textContent = isSignup ? 'Create Admin Account' : 'Login to Admin Dashboard';
  toggleModeButton.textContent = isSignup ? 'Already have an admin account? Login' : 'Create admin account';
  document.querySelector('#passwordInput').autocomplete = isSignup ? 'new-password' : 'current-password';
}

function getCurrentPage() {
  const rawPage = window.location.hash.replace('#', '') || 'dashboard';
  const page = pageAliases[rawPage] || rawPage;
  return pageTitles[page] ? page : 'dashboard';
}

function setSectionVisibility(selector, visible) {
  document.querySelectorAll(selector).forEach((element) => {
    element.classList.toggle('admin-page-hidden', !visible);
  });
}

function showAdminPage(page) {
  const normalizedPage = pageTitles[page] ? page : 'dashboard';
  pageSections.forEach((selector) => setSectionVisibility(selector, false));
  (pageSectionMap[normalizedPage] || pageSectionMap.dashboard).forEach((selector) => {
    setSectionVisibility(selector, true);
  });

  if (normalizedPage !== 'verification') {
    document.querySelector('#verificationDetails').classList.add('hidden');
  }

  document.querySelector('.topbar h1').textContent = pageTitles[normalizedPage];
  document.querySelectorAll('[data-page-link]').forEach((link) => {
    link.classList.toggle('active', link.dataset.pageLink === normalizedPage);
  });
}

function renderStats(totals = {}) {
  document.querySelector('#studentsTotal').textContent = formatNumber(totals.students);
  document.querySelector('#verifiedCollegeTotal').textContent = formatNumber(totals.verified_college_organizers);
  document.querySelector('#verifiedIndustryTotal').textContent = formatNumber(totals.verified_industry_organizers);
  document.querySelector('#activeEventsTotal').textContent = formatNumber(totals.active_events);
  document.querySelector('#completedEventsTotal').textContent = formatNumber(totals.completed_events);
  document.querySelector('#pendingVerificationsTotal').textContent = formatNumber(totals.pending_verifications);
  document.querySelector('#pendingReportsTotal').textContent = formatNumber(totals.pending_reports);
  document.querySelector('#pendingAchievementReviewsTotal').textContent = formatNumber(totals.pending_achievement_reviews);
}

function statusLabel(status) {
  return (status || 'pending').replaceAll('_', ' ');
}

function isApprovedVerification(status) {
  return status === 'approved';
}

function renderVerificationReviewButtons(userId, status, options = {}) {
  const approved = isApprovedVerification(status);
  const {
    includeReviewButton = true,
    includeRejectActions = true,
    allowSuspend = false
  } = options;
  const reviewLabel = approved ? 'Review Again' : 'View Details';
  const reviewButton = includeReviewButton
    ? `<button class="small-button" type="button" data-view-verification="${userId}">${reviewLabel}</button>`
    : '';
  const approveButton = approved
    ? '<button class="small-button approve-button" type="button" disabled>Approved</button>'
    : `<button class="small-button approve-button" type="button" data-verification-action="approve" data-user-id="${userId}">Approve</button>`;
  const secondaryActions = includeRejectActions && !approved
    ? `
        <button class="small-button reject-button" type="button" data-verification-action="reject" data-user-id="${userId}">Reject</button>
        <button class="small-button" type="button" data-verification-action="request_more_information" data-user-id="${userId}">Request More Information</button>
      `
    : '';
  const suspendButton = allowSuspend && approved
    ? `<button class="small-button" type="button" data-verification-action="suspend" data-user-id="${userId}">Suspend</button>`
    : '';
  return `${reviewButton}${approveButton}${secondaryActions}${suspendButton}`;
}

function renderVerificationList(containerId, badgeId, requests = [], allowSuspend = false) {
  const container = document.querySelector(containerId);
  const pendingCount = requests.filter((item) => ['pending', 'more_info_requested'].includes(item.status)).length;
  document.querySelector(badgeId).textContent = `${pendingCount} pending`;
  container.innerHTML = requests.length ? requests.map((item) => `
    <article class="verification-card">
      <div>
        <h3>${item.organizer_name}</h3>
        <p>${item.organization_name} - ${item.official_email}</p>
      </div>
      <span class="status-pill">${statusLabel(item.status)}</span>
      <div class="verification-actions">
        ${renderVerificationReviewButtons(item.user_id, item.status, { allowSuspend })}
      </div>
    </article>
  `).join('') : '<p class="empty-state">No verification requests found.</p>';
}

function renderVerificationRequests(items = []) {
  verificationRequests = items;
  renderVerificationList(
    '#collegeVerificationList',
    '#collegePendingBadge',
    items.filter((item) => ['college_admin', 'college_organizer'].includes(item.role))
  );
  renderVerificationList(
    '#industryVerificationList',
    '#industryPendingBadge',
    items.filter((item) => item.role === 'industry_organizer'),
    true
  );
}

function renderVerificationDetails(userId) {
  const requestItem = verificationRequests.find((item) => String(item.user_id) === String(userId));
  if (!requestItem) return;

  if (getCurrentPage() !== 'verification') {
    window.location.hash = '#verification';
  }
  showAdminPage('verification');
  document.querySelector('#verificationDetails').classList.remove('hidden');
  document.querySelector('#verificationDetails').classList.remove('admin-page-hidden');
  document.querySelector('#verificationDetailsSubtitle').textContent = `${requestItem.organizer_name} - ${requestItem.organization_name}`;
  
  const statusPill = document.querySelector('#verificationStatusPill');
  statusPill.textContent = statusLabel(requestItem.status);
  statusPill.className = `status-pill ${requestItem.status}`;

  document.querySelector('#verificationDetailsBody').innerHTML = `
    <div class="details-grid">
      <div class="detail-item"><span>Organizer Name</span><strong>${requestItem.organizer_name}</strong></div>
      <div class="detail-item"><span>College Name</span><strong>${requestItem.college_name || 'Not applicable'}</strong></div>
      <div class="detail-item"><span>Company Name</span><strong>${requestItem.company_name || 'Not applicable'}</strong></div>
      <div class="detail-item"><span>Official Email</span><strong>${requestItem.official_email}</strong></div>
      <div class="detail-item"><span>Department</span><strong>${requestItem.department || 'Not captured'}</strong></div>
      <div class="detail-item"><span>Designation</span><strong>${requestItem.designation || 'Organizer'}</strong></div>
      <div class="detail-item"><span>Submission Date</span><strong>${formatDate(requestItem.submission_date)}</strong></div>
      <div class="detail-item"><span>Current Status</span><strong>${statusLabel(requestItem.status)}</strong></div>
    </div>
    <div>
      <h3>Verification Documents</h3>
      <div class="document-list">
        ${requestItem.documents && requestItem.documents.length ? requestItem.documents.map((documentItem) => `
          <a class="document-link" href="${documentItem.file_url}" target="_blank" rel="noreferrer">
            <span>${documentItem.asset_type.replaceAll('_', ' ')}</span>
            <span>${documentItem.file_name}</span>
          </a>
        `).join('') : '<p class="empty-state">No documents uploaded.</p>'}
      </div>
    </div>
    <div class="verification-details-actions">
      ${renderVerificationReviewButtons(requestItem.user_id, requestItem.status, {
        includeReviewButton: isApprovedVerification(requestItem.status),
        allowSuspend: isApprovedVerification(requestItem.status)
      })}
    </div>
  `;
  document.querySelector('#verificationDetails').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function updateVerification(userId, action) {
  await request(`/admin/verifications/${userId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ action })
  });
  const actionLabels = {
    approve: 'approved',
    reject: 'rejected',
    request_more_information: 'more information requested',
    suspend: 'suspended'
  };
  const actionLabel = actionLabels[action] || action;
  showToast(`Verification status updated: ${actionLabel}!`, 'success');
  await loadDashboard();
  renderVerificationDetails(userId);
}

function renderCategories(items = []) {
  const chart = document.querySelector('#categoryChart');
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  chart.innerHTML = items.length ? items.map((item) => {
    const width = Math.max((item.value / maxValue) * 100, 4);
    return `
      <div class="bar-row">
        <div class="bar-meta">
          <span>${item.name}</span>
          <span>${formatNumber(item.value)}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${width}%"></div>
        </div>
      </div>
    `;
  }).join('') : '<p class="empty-state">No event categories found.</p>';
}

function renderRoles(items = []) {
  const roleList = document.querySelector('#roleList');
  const colors = ['#0f766e', '#ff5f6d', '#2563eb', '#b45309', '#7c3aed'];
  roleList.innerHTML = items.length ? items.map((item, index) => `
    <div class="role-row">
      <span><i class="role-dot" style="background: ${colors[index % colors.length]}"></i>${item.name}</span>
      <strong>${formatNumber(item.value)}</strong>
    </div>
  `).join('') : '<p class="empty-state">No users found.</p>';
}

function renderActivity(items = []) {
  const activityList = document.querySelector('#activityList');
  activityList.innerHTML = items.length ? items.map((item) => `
    <div class="activity-row">
      <span class="activity-type">${item.type}</span>
      <div>
        <p class="activity-title">${item.title}</p>
        <p class="activity-detail">${item.detail} - ${formatDate(item.occurred_at)}</p>
      </div>
    </div>
  `).join('') : '<p class="empty-state">No activity recorded yet.</p>';
}

function renderTopEvents(items = []) {
  const table = document.querySelector('#topEventsTable');
  table.innerHTML = items.length ? items.map((event) => `
    <tr>
      <td>${event.title}</td>
      <td>${event.category || 'Uncategorized'}</td>
      <td><span class="status-pill">${event.status}</span></td>
      <td>${formatNumber(event.registrations_count)}</td>
      <td>${event.popularity_score || 0}</td>
    </tr>
  `).join('') : '<tr><td colspan="5">No events found.</td></tr>';
}

function renderEventMonitoring(groups = {}) {
  const container = document.querySelector('#eventMonitoringGrid');
  const labels = {
    upcoming: 'Upcoming Events',
    ongoing: 'Ongoing Events',
    completed: 'Completed Events',
    cancelled: 'Cancelled Events',
    flagged: 'Flagged Events'
  };
  container.innerHTML = Object.entries(labels).map(([key, label]) => {
    const events = groups[key] || [];
    return `
      <article class="monitoring-card">
        <h3>${label}</h3>
        <div class="mini-table">
          ${events.length ? events.slice(0, 6).map((event) => `
            <div class="mini-row">
              <strong>${event.event_name}</strong>
              <span>${event.organizer} - ${event.category}</span>
              <span>${event.participants} participants - ${event.status} - ${formatDate(event.date)}</span>
              <span class="row-actions">
                <button class="small-button" type="button" data-event-action="publish" data-event-id="${event.id}">Publish</button>
                <button class="small-button" type="button" data-event-action="complete" data-event-id="${event.id}">Complete</button>
                <button class="small-button" type="button" data-event-action="flag" data-event-id="${event.id}">Flag</button>
                <button class="small-button reject-button" type="button" data-event-action="cancel" data-event-id="${event.id}">Cancel</button>
              </span>
            </div>
          `).join('') : '<p class="empty-state">No events in this queue.</p>'}
        </div>
      </article>
    `;
  }).join('');
}

function renderManagementList(selector, items = [], type = 'student') {
  const container = document.querySelector(selector);
  container.innerHTML = items.length ? items.slice(0, 10).map((user) => `
    <article class="management-card">
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <p>Status: ${statusLabel(user.account_status || 'active')}</p>
      <p>${type === 'student' ? `${user.participation_count} participations - ${user.achievements_count} achievements - ${user.reports_against_user} reports`
        : `${statusLabel(user.verification_status)} - ${user.events_created} events - ${user.college || user.company || 'Organization not provided'}`}</p>
      <div class="row-actions">
        ${type !== 'student' ? (isApprovedVerification(user.verification_status)
          ? `<button class="small-button approve-button" type="button" disabled>Approved</button>
            <button class="small-button" type="button" data-view-verification="${user.id}">Review Again</button>`
          : `<button class="small-button approve-button" type="button" data-view-verification="${user.id}">Review Verification</button>`) : ''}
        <button class="small-button" type="button" data-user-action="activate" data-user-id="${user.id}">Activate</button>
        <button class="small-button" type="button" data-user-action="suspend" data-user-id="${user.id}">Suspend</button>
        <button class="small-button reject-button" type="button" data-user-action="ban" data-user-id="${user.id}">Ban</button>
      </div>
    </article>
  `).join('') : '<p class="empty-state">No users found.</p>';
}

function renderAchievementQueue(items = []) {
  const container = document.querySelector('#achievementQueue');
  container.innerHTML = items.length ? items.map((item) => `
    <article class="management-card">
      <div class="details-grid">
        <div class="detail-item"><span>Student Name</span><strong>${item.student_name}</strong></div>
        <div class="detail-item"><span>College</span><strong>${item.college}</strong></div>
        <div class="detail-item"><span>Event Name</span><strong>${item.event_name}</strong></div>
        <div class="detail-item"><span>Achievement Type</span><strong>${item.achievement_type}</strong></div>
        <div class="detail-item"><span>Submission Date</span><strong>${formatDate(item.submission_date)}</strong></div>
      </div>
      <a class="document-link" href="${item.uploaded_certificate}" target="_blank" rel="noreferrer">
        <span>Uploaded Certificate</span>
        <span>Open</span>
      </a>
      <div class="verification-actions">
        <button class="small-button approve-button" type="button" data-achievement-action="verify" data-achievement-id="${item.id}">Verify</button>
        <button class="small-button reject-button" type="button" data-achievement-action="reject" data-achievement-id="${item.id}">Reject</button>
        <button class="small-button" type="button" data-achievement-action="request_additional_proof" data-achievement-id="${item.id}">Request Additional Proof</button>
      </div>
    </article>
  `).join('') : '<p class="empty-state">No uploaded student achievements are waiting for review.</p>';
}

function renderReportsQueue(items = []) {
  document.querySelector('#reportsQueue').innerHTML = items.length ? items.map((item) => `
    <article class="management-card"><h3>${item.title}</h3><p>${item.reason}</p></article>
  `).join('') : '<p class="empty-state">No reports yet. Report categories are ready for fake events, fake certificates, spam, misconduct, and duplicate events.</p>';
}

function renderAnalyticsSummary(summary = {}) {
  const container = document.querySelector('#analyticsSummary');
  const cards = [
    ['User Analytics', summary.user_growth || []],
    ['Event Analytics', summary.most_popular_events || []],
    ['Most Active Colleges', summary.most_active_colleges || []],
    ['Domain Analytics', summary.domain_analytics || []],
  ];
  container.innerHTML = cards.map(([title, items]) => `
    <article class="analytics-card">
      <h3>${title}</h3>
      ${items.length ? items.slice(0, 6).map((item) => `<p>${item.name}: ${formatNumber(item.value)}</p>`).join('') : '<p>No data yet.</p>'}
    </article>
  `).join('') + `
    <article class="analytics-card">
      <h3>Achievement Analytics</h3>
      <p>Uploaded: ${formatNumber(summary.achievement_analytics?.uploaded)}</p>
      <p>Pending Review: ${formatNumber(summary.achievement_analytics?.pending_review)}</p>
    </article>
  `;
}

function renderAuditLogs(items = []) {
  const list = document.querySelector('#auditLogList');
  const isAdminRecord = (item) => {
    const text = `${item.action || ''} ${item.user || ''}`.toLowerCase();
    return text.includes('(admin)') || text.includes('joined as admin');
  };
  const renderAuditBox = (title, records, emptyText) => {
    const rows = records.length ? records.map((item) => `
      <article class="management-card audit-log-card">
        <h3>${item.action}</h3>
        <p>${item.user} - ${item.role} - ${item.status}</p>
        <p>${formatDate(item.timestamp)}</p>
      </article>
    `).join('') : `<p class="empty-state">${emptyText}</p>`;

    return `
      <section class="audit-history-card">
        <h3>${title}</h3>
        <div class="audit-history-list">${rows}</div>
      </section>
    `;
  };
  const adminRecords = items.filter(isAdminRecord);
  const nonAdminRecords = items.filter((item) => !isAdminRecord(item));

  list.innerHTML = `
    ${renderAuditBox('Non-Admin History', nonAdminRecords, 'No non-admin audit records yet.')}
    ${renderAuditBox('Admin History', adminRecords, 'No admin audit records yet.')}
  `;
}

function renderSettings(settings = {}) {
  document.querySelector('#settingsList').innerHTML = Object.entries(settings).map(([key, value]) => `
    <article class="settings-card">
      <h3>${key.replaceAll('_', ' ')}</h3>
      <p>${value}</p>
    </article>
  `).join('');
}

function renderAdminProfile(user) {
  const container = document.querySelector('#settingsList');
  if (!container) return;
  // remove previous profile if present
  const existing = container.querySelector('.admin-profile');
  if (existing) existing.remove();
  if (!user) return;
  const profileHtml = `
    <article class="settings-card admin-profile">
      <h3>Profile Settings</h3>
      <form id="adminProfileForm" class="profile-form">
        <label>
          Name
          <input id="profileName" type="text" value="${user.name || ''}" required />
        </label>
        <label>
          Email
          <input id="profileEmail" type="email" value="${user.email || ''}" required />
        </label>
        <p class="muted">Role: ${user.role || 'admin'}</p>
        <p class="muted">Last login: ${formatDate(user.last_login_at)}</p>
        <div class="row-actions">
          <button class="dark-button" type="submit" id="saveProfileBtn">Save</button>
          <button class="small-button" type="button" id="changePasswordBtn">Change Password</button>
          <button class="small-button reject-button" type="button" id="profileLogoutBtn">Sign Out</button>
        </div>
        <p id="profileMessage" class="form-message"></p>
      </form>
    </article>
  `;

  container.innerHTML = profileHtml; // replace settings with profile form

  const profileForm = document.querySelector('#adminProfileForm');
  const profileMessage = document.querySelector('#profileMessage');

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    profileMessage.textContent = '';
    const name = document.querySelector('#profileName').value.trim();
    const email = document.querySelector('#profileEmail').value.trim();
    try {
      const updated = await request('/auth/me', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ name, email })
      });
      localStorage.setItem(userKey, JSON.stringify(updated.user));
      profileMessage.textContent = 'Profile updated successfully';
    } catch (err) {
      profileMessage.textContent = err.message || 'Unable to update profile';
    }
  });

  const logoutBtn = document.querySelector('#profileLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      showLogin();
    });
  }

  const cpBtn = document.querySelector('#changePasswordBtn');
  if (cpBtn) {
    cpBtn.addEventListener('click', async () => {
      const current = window.prompt('Enter your current password:');
      if (!current) return;
      const nw = window.prompt('Enter your new password (min 8 chars):');
      if (!nw) return;
      try {
        await request('/auth/me/password', {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ current_password: current, new_password: nw })
        });
        profileMessage.textContent = 'Password changed successfully';
      } catch (err) {
        profileMessage.textContent = err.message || 'Unable to change password';
      }
    });
  }
}

async function loadDashboard() {
  refreshButton.disabled = true;
  refreshButton.textContent = 'Loading...';
  try {
    const data = await request('/admin/activity', {
      headers: authHeaders()
    });
    renderStats(data.totals);
    renderCategories(data.category_breakdown);
    renderRoles(data.role_breakdown);
    renderActivity(data.live_activity || data.recent_activity);
    renderTopEvents(data.top_events);
    renderVerificationRequests(data.verification_requests);
    renderEventMonitoring(data.event_monitoring);
    renderManagementList('#studentsList', data.user_management?.students, 'student');
    renderManagementList('#collegeUsersList', data.user_management?.college_organizers, 'college');
    renderManagementList('#industryUsersList', data.user_management?.industry_organizers, 'industry');
    renderAchievementQueue(data.achievement_queue);
    renderReportsQueue(data.reports_queue);
    renderAnalyticsSummary(data.analytics_summary);
    renderAuditLogs(data.audit_logs);
    // render profile settings (fetch current user)
    try {
      const me = await request('/auth/me', { headers: authHeaders() });
      renderAdminProfile(me.user);
    } catch (err) {
      // if fetching user fails, clear session and show login
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      showLogin();
      return;
    }
  } catch (error) {
    if (error.message.includes('permission') || error.message.includes('Missing')) {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      showLogin();
    }
    setMessage(error.message);
    if (!dashboardView.classList.contains('hidden')) {
      showToast(`Failed to load data: ${error.message}`, 'error');
    }
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = 'Refresh';
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');
  loginButton.disabled = true;
  loginButton.textContent = authMode === 'signup' ? 'Creating account...' : 'Checking access...';
  try {
    if (authMode === 'signup') {
      const password = document.querySelector('#passwordInput').value;
      const confirmPassword = document.querySelector('#confirmPasswordInput').value;
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      if (!otpSent) {
        throw new Error('Send OTP to your email before signup.');
      }
      await request('/auth/admin-signup', {
        method: 'POST',
        body: JSON.stringify({
          name: document.querySelector('#nameInput').value,
          email: document.querySelector('#emailInput').value,
          password,
          otp: document.querySelector('#otpInput').value
        })
      });
      setAuthMode('login');
      setMessage('Admin account created. Please login whenever you want to use the portal.', false);
      return;
    }

    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: document.querySelector('#emailInput').value,
        password: document.querySelector('#passwordInput').value
      })
    });
    if (data.user.role !== 'admin') {
      throw new Error('This website is only for admin accounts.');
    }
    localStorage.setItem(tokenKey, data.access_token);
    localStorage.setItem(userKey, JSON.stringify(data.user));
    if (!window.location.hash) {
      window.location.hash = '#dashboard';
    }
    showDashboard();
    await loadDashboard();
    if (!liveActivityTimer) {
      liveActivityTimer = setInterval(loadDashboard, 10000);
    }
  } catch (error) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setMessage(error.message);
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = authMode === 'signup' ? 'Create Admin Account' : 'Login to Admin Dashboard';
  }
});

otpButton.addEventListener('click', async () => {
  setMessage('');
  const email = document.querySelector('#emailInput').value;
  if (!email) {
    setMessage('Enter your email before requesting OTP.');
    return;
  }

  otpButton.disabled = true;
  otpButton.textContent = 'Sending OTP...';
  try {
    await request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    otpSent = true;
    updateOtpButtonLabel();
    setMessage('OTP sent to your email. It may take a few minutes to arrive, and it expires in 15 minutes.', false);
  } catch (error) {
    setMessage(error.message);
  } finally {
    otpButton.disabled = false;
    updateOtpButtonLabel();
  }
});

toggleModeButton.addEventListener('click', () => {
  setAuthMode(authMode === 'signup' ? 'login' : 'signup');
});

refreshButton.addEventListener('click', loadDashboard);

window.addEventListener('hashchange', () => {
  if (!dashboardView.classList.contains('hidden')) {
    showAdminPage(getCurrentPage());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

notificationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  notificationMessage.textContent = '';
  try {
    const data = await request('/admin/notifications', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        recipient_group: document.querySelector('#recipientGroup').value,
        title: document.querySelector('#notificationTitle').value,
        body: document.querySelector('#notificationBody').value
      })
    });
    notificationMessage.style.color = '#0f766e';
    notificationMessage.textContent = `${data.message} to ${formatNumber(data.recipients)} recipients.`;
    notificationForm.reset();
    await loadDashboard();
  } catch (error) {
    notificationMessage.style.color = '#ff5f6d';
    notificationMessage.textContent = error.message;
  }
});

document.addEventListener('click', async (event) => {
  const viewButton = event.target.closest('[data-view-verification]');
  if (viewButton) {
    renderVerificationDetails(viewButton.dataset.viewVerification);
    return;
  }

  const actionButton = event.target.closest('[data-verification-action]');
  if (actionButton) {
    actionButton.disabled = true;
    try {
      await updateVerification(actionButton.dataset.userId, actionButton.dataset.verificationAction);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      actionButton.disabled = false;
    }
    return;
  }

  const achievementButton = event.target.closest('[data-achievement-action]');
  if (achievementButton) {
    achievementButton.disabled = true;
    try {
      await request(`/admin/achievements/${achievementButton.dataset.achievementId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: achievementButton.dataset.achievementAction })
      });
      const actionLabels = {
        verify: 'verified',
        reject: 'rejected',
        request_additional_proof: 'additional proof requested'
      };
      const actionLabel = actionLabels[achievementButton.dataset.achievementAction] || achievementButton.dataset.achievementAction;
      showToast(`Achievement status updated: ${actionLabel}!`, 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      achievementButton.disabled = false;
    }
    return;
  }

  const userButton = event.target.closest('[data-user-action]');
  if (userButton) {
    userButton.disabled = true;
    try {
      await request(`/admin/users/${userButton.dataset.userId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: userButton.dataset.userAction })
      });
      const actionLabels = {
        activate: 'activated',
        suspend: 'suspended',
        ban: 'banned'
      };
      const actionLabel = actionLabels[userButton.dataset.userAction] || userButton.dataset.userAction;
      showToast(`User status updated: ${actionLabel}!`, 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      userButton.disabled = false;
    }
    return;
  }

  const eventButton = event.target.closest('[data-event-action]');
  if (eventButton) {
    eventButton.disabled = true;
    try {
      await request(`/admin/events/${eventButton.dataset.eventId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: eventButton.dataset.eventAction })
      });
      const actionLabels = {
        publish: 'published',
        complete: 'completed',
        flag: 'flagged',
        cancel: 'cancelled'
      };
      const actionLabel = actionLabels[eventButton.dataset.eventAction] || eventButton.dataset.eventAction;
      showToast(`Event status updated: ${actionLabel}!`, 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      eventButton.disabled = false;
    }
    return;
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  showLogin();
});

// Always require login when the admin website opens.
localStorage.removeItem(tokenKey);
localStorage.removeItem(userKey);
setAuthMode('login');
showLogin();

window.addEventListener('beforeunload', () => {
  if (liveActivityTimer) clearInterval(liveActivityTimer);
});
