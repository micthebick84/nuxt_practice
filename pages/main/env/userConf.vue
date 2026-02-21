<template>
  <div class="user-page">
    <!-- Header -->
    <div class="content-header">
      <div class="header-left">
        <h1 class="page-title">사용자 관리</h1>
        <div class="breadcrumb">
          <NuxtLink to="/dashboard" class="bc-item bc-link">Settings</NuxtLink>
          <ChevronRight :size="14" color="#D1D5DB" />
          <span class="bc-item">Users</span>
          <ChevronRight :size="14" color="#D1D5DB" />
          <span class="bc-item active">사용자 관리</span>
        </div>
      </div>
    </div>
    <div class="header-divider"></div>

    <!-- Action Bar -->
    <div class="action-bar">
      <button class="action-btn btn-search" @click="fetchUsers">조회</button>
      <button class="action-btn btn-save" @click="saveUsers">저장</button>
      <button class="action-btn btn-add" @click="openAddDialog">추가</button>
      <button class="action-btn btn-delete" @click="deleteUsers">삭제</button>
      <button class="action-btn btn-pw" @click="openPasswordDialog">비밀번호변경</button>
    </div>

    <!-- Grid -->
    <ClientOnly>
      <div class="grid-wrapper">
        <div ref="gridRef" id="userGrid"></div>
        <div v-if="isLoading" class="grid-loading-overlay">
          <div class="grid-spinner"></div>
          <span class="grid-loading-text">데이터를 불러오는 중...</span>
        </div>
      </div>
      <template #fallback>
        <div class="loading-state">Loading...</div>
      </template>
    </ClientOnly>

    <!-- Password Change Popup -->
    <Teleport to="body">
      <div v-if="pwDialogVisible" class="popup-overlay" @click.self="pwDialogVisible = false">
        <div class="popup-container">
          <div class="popup-header">
            <span class="popup-title">비밀번호 변경</span>
            <button class="popup-close" @click="pwDialogVisible = false">
              <X :size="16" />
            </button>
          </div>
          <div class="popup-body">
            <div class="form-field">
              <label class="field-label">사용자 ID</label>
              <input type="text" class="field-input" :value="pwTargetUserId" disabled />
            </div>
            <div class="form-field">
              <label class="field-label">새 비밀번호</label>
              <input type="password" class="field-input" v-model="newPassword" placeholder="새 비밀번호를 입력하세요" />
            </div>
            <div class="form-field">
              <label class="field-label">비밀번호 확인</label>
              <input type="password" class="field-input" v-model="confirmPassword" placeholder="비밀번호를 다시 입력하세요" />
            </div>
          </div>
          <div class="popup-footer">
            <button class="btn btn-outline" @click="pwDialogVisible = false">취소</button>
            <button class="btn btn-success" @click="changePassword">변경</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add User Popup -->
    <Teleport to="body">
      <div v-if="addDialogVisible" class="popup-overlay" @click.self="addDialogVisible = false">
        <div class="popup-container">
          <div class="popup-header">
            <span class="popup-title">사용자 추가</span>
            <button class="popup-close" @click="addDialogVisible = false">
              <X :size="16" />
            </button>
          </div>
          <div class="popup-body">
            <div class="form-row">
              <div class="form-field">
                <label class="field-label">아이디 <span class="required">*</span></label>
                <input type="text" class="field-input" v-model="newUser.userId" placeholder="아이디" />
              </div>
              <div class="form-field">
                <label class="field-label">비밀번호 <span class="required">*</span></label>
                <input type="password" class="field-input" v-model="newUser.password" placeholder="비밀번호" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label class="field-label">이름 <span class="required">*</span></label>
                <input type="text" class="field-input" v-model="newUser.userName" placeholder="이름" />
              </div>
              <div class="form-field">
                <label class="field-label">소속</label>
                <input type="text" class="field-input" v-model="newUser.deptName" placeholder="소속" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label class="field-label">휴대폰</label>
                <input type="text" class="field-input" v-model="newUser.cellTel" placeholder="010-0000-0000" />
              </div>
              <div class="form-field">
                <label class="field-label">E-Mail</label>
                <input type="text" class="field-input" v-model="newUser.email" placeholder="email@example.com" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label class="field-label">접속IP</label>
                <input type="text" class="field-input" v-model="newUser.userPcIp" placeholder="접속IP" />
              </div>
              <div class="form-field">
                <label class="field-label">계정상태</label>
                <select class="field-select" v-model="newUser.useFlag">
                  <option :value="1">승인</option>
                  <option :value="2">대기</option>
                  <option :value="0">차단</option>
                </select>
              </div>
            </div>
            <div class="form-field">
              <label class="field-label">사용자등급</label>
              <select class="field-select" v-model="newUser.auth">
                <option value="System">시스템관리자</option>
                <option value="Admin">관리자</option>
                <option value="User">사용자</option>
              </select>
            </div>
          </div>
          <div class="popup-footer">
            <button class="btn btn-outline" @click="addDialogVisible = false">취소</button>
            <button class="btn btn-success" @click="addUser">추가</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ChevronRight, X } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ layout: 'dashboard' });

const authStore = useAuthStore();
function authHeaders() {
  const token = authStore.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// State
const gridRef = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const pwDialogVisible = ref(false);
const addDialogVisible = ref(false);
const pwTargetUserId = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
let $: any = null;
let gridInitialized = false;

const newUser = ref({
  userId: '',
  password: '',
  userName: '',
  deptName: '',
  cellTel: '',
  email: '',
  userPcIp: '',
  useFlag: 2,
  auth: 'User',
});

function resetNewUser() {
  newUser.value = {
    userId: '',
    password: '',
    userName: '',
    deptName: '',
    cellTel: '',
    email: '',
    userPcIp: '',
    useFlag: 2,
    auth: 'User',
  };
}

// Fetch users from API
async function fetchUsers() {
  isLoading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>('/api/proxy/api/userconf/list', {
      headers: authHeaders(),
    });
    if (res.success && res.data && $ && gridInitialized) {
      const source = {
        datatype: 'json',
        datafields: [
          { name: 'userId', type: 'string' },
          { name: 'userName', type: 'string' },
          { name: 'deptName', type: 'string' },
          { name: 'cellTel', type: 'string' },
          { name: 'email', type: 'string' },
          { name: 'userPcIp', type: 'string' },
          { name: 'useFlag', type: 'number' },
          { name: 'passDate', type: 'string' },
          { name: 'auth', type: 'string' },
          { name: 'isRecvSms', type: 'number' },
          { name: 'isRecvEmail', type: 'number' },
        ],
        localdata: res.data,
      };
      const dataAdapter = new $.jqx.dataAdapter(source);
      $('#userGrid').jqxGrid({ source: dataAdapter });
    }
  } catch (e) {
    console.error('Failed to fetch users:', e);
    alert('사용자 목록 조회에 실패했습니다.');
  } finally {
    isLoading.value = false;
  }
}

// Save edited users
async function saveUsers() {
  if (!$ || !gridInitialized) return;
  try {
    const rows = $('#userGrid').jqxGrid('getrows');
    const res = await $fetch<{ success: boolean }>('/api/proxy/api/userconf/save', {
      method: 'POST',
      body: rows,
      headers: authHeaders(),
    });
    if (res.success) {
      alert('저장되었습니다.');
      await fetchUsers();
    } else {
      alert('저장에 실패했습니다.');
    }
  } catch (e) {
    console.error('Save error:', e);
    alert('저장 중 오류가 발생했습니다.');
  }
}

// Open add user dialog
function openAddDialog() {
  resetNewUser();
  addDialogVisible.value = true;
}

// Add new user
async function addUser() {
  if (!newUser.value.userId || !newUser.value.password || !newUser.value.userName) {
    alert('아이디, 비밀번호, 이름은 필수 항목입니다.');
    return;
  }
  try {
    const res = await $fetch<{ success: boolean }>('/api/proxy/api/userconf/add', {
      method: 'POST',
      body: newUser.value,
      headers: authHeaders(),
    });
    if (res.success) {
      alert('사용자가 추가되었습니다.');
      addDialogVisible.value = false;
      await fetchUsers();
    } else {
      alert('사용자 추가에 실패했습니다.');
    }
  } catch (e) {
    console.error('Add user error:', e);
    alert('사용자 추가 중 오류가 발생했습니다.');
  }
}

// Delete selected users
async function deleteUsers() {
  if (!$ || !gridInitialized) return;
  const selectedIndexes = $('#userGrid').jqxGrid('getselectedrowindexes');
  if (!selectedIndexes || selectedIndexes.length === 0) {
    alert('삭제할 사용자를 선택하세요.');
    return;
  }
  if (!confirm(`${selectedIndexes.length}명의 사용자를 삭제하시겠습니까?`)) return;

  let successCount = 0;
  for (const idx of selectedIndexes) {
    const rowData = $('#userGrid').jqxGrid('getrowdata', idx);
    if (rowData && rowData.userId) {
      try {
        const res = await $fetch<{ success: boolean }>(
          `/api/proxy/api/userconf/delete?userId=${encodeURIComponent(rowData.userId)}`,
          { method: 'DELETE', headers: authHeaders() },
        );
        if (res.success) successCount++;
      } catch (e) {
        console.error('Delete error:', e);
      }
    }
  }
  alert(`${successCount}명의 사용자가 삭제되었습니다.`);
  await fetchUsers();
}

// Password change
function openPasswordDialog() {
  if (!$ || !gridInitialized) return;
  const selectedIndexes = $('#userGrid').jqxGrid('getselectedrowindexes');
  if (!selectedIndexes || selectedIndexes.length !== 1) {
    alert('비밀번호를 변경할 사용자를 1명만 선택하세요.');
    return;
  }
  const rowData = $('#userGrid').jqxGrid('getrowdata', selectedIndexes[0]);
  if (rowData) {
    pwTargetUserId.value = rowData.userId;
    newPassword.value = '';
    confirmPassword.value = '';
    pwDialogVisible.value = true;
  }
}

async function changePassword() {
  if (!newPassword.value) {
    alert('새 비밀번호를 입력하세요.');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  try {
    const res = await $fetch<{ success: boolean }>('/api/proxy/api/userconf/change-password', {
      method: 'POST',
      body: { userId: pwTargetUserId.value, newPassword: newPassword.value },
      headers: authHeaders(),
    });
    if (res.success) {
      alert('비밀번호가 변경되었습니다.');
      pwDialogVisible.value = false;
    } else {
      alert('비밀번호 변경에 실패했습니다.');
    }
  } catch (e) {
    console.error('Change password error:', e);
    alert('비밀번호 변경 중 오류가 발생했습니다.');
  }
}

// Initialize jqxGrid
// 그리드 컨테이너 실제 너비 기반으로 컬럼 너비 비례 계산
function computeColWidths(): Record<string, number> {
  const gridWidth = (gridRef.value?.offsetWidth ?? 1000) - 4; // 보더 제외
  const cbW = 34; // 체크박스 컬럼 고정 너비
  const avail = Math.max(400, gridWidth - cbW);
  // 각 컬럼의 상대 비중 (합계: 1105)
  const weights: Record<string, number> = {
    userId: 90, userName: 78, deptName: 112, cellTel: 122,
    email: 165, userPcIp: 107, useFlag: 78, passDate: 148,
    auth: 95, isRecvSms: 55, isRecvEmail: 55,
  };
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  return Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, Math.max(40, Math.floor(avail * v / total))]),
  );
}

function initGrid(data: any[]) {
  if (!$) return;

  const w = computeColWidths();

  const source = {
    datatype: 'json',
    datafields: [
      { name: 'userId', type: 'string' },
      { name: 'userName', type: 'string' },
      { name: 'deptName', type: 'string' },
      { name: 'cellTel', type: 'string' },
      { name: 'email', type: 'string' },
      { name: 'userPcIp', type: 'string' },
      { name: 'useFlag', type: 'number' },
      { name: 'passDate', type: 'string' },
      { name: 'auth', type: 'string' },
      { name: 'isRecvSms', type: 'number' },
      { name: 'isRecvEmail', type: 'number' },
    ],
    localdata: data,
  };

  const dataAdapter = new $.jqx.dataAdapter(source);

  $('#userGrid').jqxGrid({
    source: dataAdapter,
    width: '100%',
    height: getGridHeight(),
    columnsresize: true,
    columnsautoresize: true,
    editable: true,
    selectionmode: 'checkbox',
    sortable: true,
    altrows: true,
    enablebrowserselection: true,
    columngroups: [
      { text: '수신설정', align: 'center', name: 'recvGroup' },
    ],
    columns: [
      { text: '아이디', datafield: 'userId', width: w.userId, editable: false, align: 'center', cellsalign: 'center' },
      { text: '이름', datafield: 'userName', width: w.userName, editable: true, align: 'center', cellsalign: 'center' },
      { text: '소속', datafield: 'deptName', width: w.deptName, editable: true, align: 'center', cellsalign: 'center' },
      { text: '휴대폰', datafield: 'cellTel', width: w.cellTel, editable: true, align: 'center', cellsalign: 'center' },
      { text: 'E-Mail', datafield: 'email', width: w.email, editable: true, align: 'center', cellsalign: 'left' },
      { text: '접속IP', datafield: 'userPcIp', width: w.userPcIp, editable: true, align: 'center', cellsalign: 'center' },
      {
        text: '계정상태', datafield: 'useFlag', width: w.useFlag, editable: false, align: 'center',
        cellsrenderer: (_row: any, _col: any, value: any) => {
          let color = '#D9534F'; let text = '차단';
          if (value === 1) { color = '#5CB85C'; text = '승인'; }
          else if (value === 2) { color = '#F0AD4E'; text = '대기'; }
          return `<div style="text-align:center;padding:6px 4px;"><span style="background:${color};color:#fff;padding:2px 10px;border-radius:3px;font-size:10px;font-weight:600;">${text}</span></div>`;
        },
      },
      { text: '최근접속이력', datafield: 'passDate', width: w.passDate, editable: false, align: 'center', cellsalign: 'center', cellsformat: 'yyyy-MM-dd HH:mm:ss' },
      {
        text: '사용자등급', datafield: 'auth', width: w.auth, editable: false, align: 'center',
        cellsrenderer: (_row: any, _col: any, value: any) => {
          let color = '#5BC0DE'; let text = '사용자';
          if (value === 'System') { color = '#D9534F'; text = '시스템관리자'; }
          else if (value === 'Admin') { color = '#F0AD4E'; text = '관리자'; }
          return `<div style="text-align:center;padding:6px 4px;"><span style="background:${color};color:#fff;padding:2px 10px;border-radius:3px;font-size:10px;font-weight:600;">${text}</span></div>`;
        },
      },
      { text: 'SMS', datafield: 'isRecvSms', width: w.isRecvSms, editable: true, align: 'center', columntype: 'checkbox', columngroup: 'recvGroup' },
      { text: 'Mail', datafield: 'isRecvEmail', width: w.isRecvEmail, editable: true, align: 'center', columntype: 'checkbox', columngroup: 'recvGroup' },
    ],
  });

  gridInitialized = true;
}

onMounted(async () => {
  // Load jQuery
  const jQueryModule = await import('jquery');
  $ = jQueryModule.default;
  (window as any).$ = $;
  (window as any).jQuery = $;

  // Polyfill for jQuery 3.x/4.x compatibility (removed utils needed by jqWidgets)
  if (!$.isFunction) {
    $.isFunction = function (obj: any) {
      return typeof obj === 'function';
    };
  }
  if (!$.isArray) {
    $.isArray = Array.isArray;
  }
  if (!$.isWindow) {
    $.isWindow = function (obj: any) {
      return obj != null && obj === obj.window;
    };
  }
  if (!$.camelCase) {
    $.camelCase = function (str: string) {
      return str.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
    };
  }

  // API 호출과 모듈 로딩을 병렬로 시작
  const dataPromise = $fetch<{ success: boolean; data: any[] }>('/api/proxy/api/userconf/list', {
    headers: authHeaders(),
  }).catch((e) => {
    console.error('Initial fetch error:', e);
    return { success: false, data: [] as any[] };
  });

  // jqxcore 먼저 로드 (다른 모듈의 의존성)
  await import('jqwidgets-scripts/jqwidgets/jqxcore');

  // jqxcore 의존 모듈들 병렬 로드
  await Promise.all([
    import('jqwidgets-scripts/jqwidgets/jqxdata'),
    import('jqwidgets-scripts/jqwidgets/jqxbuttons'),
    import('jqwidgets-scripts/jqwidgets/jqxscrollbar'),
    import('jqwidgets-scripts/jqwidgets/jqxmenu'),
    import('jqwidgets-scripts/jqwidgets/jqxcheckbox'),
    import('jqwidgets-scripts/jqwidgets/jqxlistbox'),
    import('jqwidgets-scripts/jqwidgets/jqxdropdownlist'),
    import('jqwidgets-scripts/jqwidgets/styles/jqx.base.css'),
  ]);

  // jqxgrid 로드 (위 모듈들 필요)
  await import('jqwidgets-scripts/jqwidgets/jqxgrid');

  // jqxgrid 플러그인들 병렬 로드
  await Promise.all([
    import('jqwidgets-scripts/jqwidgets/jqxgrid.edit'),
    import('jqwidgets-scripts/jqwidgets/jqxgrid.selection'),
    import('jqwidgets-scripts/jqwidgets/jqxgrid.columnsresize'),
    import('jqwidgets-scripts/jqwidgets/jqxgrid.sort'),
  ]);

  // 데이터 결과 수신 (이미 완료됐을 수 있음)
  const res = await dataPromise;
  const data = res.success && res.data ? res.data : [];
  initGrid(data);

  // 윈도우 리사이즈 시 그리드 높이 재조정
  window.addEventListener('resize', handleResize);
});

function getGridHeight(): number {
  if (gridRef.value) {
    const top = gridRef.value.getBoundingClientRect().top;
    return Math.max(300, window.innerHeight - top - 24);
  }
  return window.innerHeight - 220;
}

function handleResize() {
  if ($ && gridInitialized) {
    const w = computeColWidths();
    $('#userGrid').jqxGrid({ height: getGridHeight() });
    Object.entries(w).forEach(([field, width]) => {
      $('#userGrid').jqxGrid('setcolumnproperty', field, 'width', width);
    });
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if ($ && gridInitialized) {
    try {
      $('#userGrid').jqxGrid('destroy');
    } catch {
      // ignore
    }
    gridInitialized = false;
  }
});
</script>

<style scoped>
.user-page {
  padding: 24px 32px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  overflow: hidden;
  background: #F8F9FA;
}

/* Header */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  flex-shrink: 0;
}
.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.5px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bc-item {
  font-size: 13px;
  color: #9CA3AF;
}
.bc-link {
  text-decoration: none;
  transition: color 0.15s;
}
.bc-link:hover {
  color: #4CAF50;
}
.bc-item.active {
  color: #4CAF50;
  font-weight: 500;
}
.header-divider {
  height: 1px;
  background: #F0F1F3;
  flex-shrink: 0;
}

/* Action Bar */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 14px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.15s;
}
.action-btn:hover {
  opacity: 0.85;
}
.btn-search {
  background: #4A7DBA;
}
.btn-save {
  background: #5A9E5A;
}
.btn-add {
  background: #5A9E5A;
}
.btn-delete {
  background: #D9534F;
}
.btn-pw {
  background: #5BC0DE;
}

/* Loading */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: #9CA3AF;
  font-size: 14px;
}

/* Grid loading overlay */
.grid-wrapper {
  position: relative;
  flex: 1;
  min-height: 0;
}
.grid-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(248, 249, 250, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 10;
  border-radius: 4px;
}
.grid-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #E5E7EB;
  border-top-color: #4A7DBA;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.grid-loading-text {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

/* Popup */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.popup-container {
  background: #fff;
  border-radius: 12px;
  width: 540px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
}
.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}
.popup-close {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.popup-close:hover {
  background: #E5E7EB;
}
.popup-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.popup-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 24px;
  height: 64px;
  border-top: 1px solid #F3F4F6;
  flex-shrink: 0;
}

/* Form Fields */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.form-row {
  display: flex;
  gap: 16px;
}
.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}
.required {
  color: #D9534F;
}
.field-input,
.field-select {
  height: 40px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 13px;
  color: #374151;
  outline: none;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
}
.field-input:focus,
.field-select:focus {
  border-color: #4A7DBA;
}
.field-input:disabled {
  background: #F3F4F6;
  color: #9CA3AF;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.btn-outline {
  background: #fff;
  color: #374151;
  border: 1px solid #D1D5DB;
}
.btn-outline:hover {
  background: #F9FAFB;
}
.btn-success {
  background: #5A9E5A;
  color: #fff;
}
.btn-success:hover {
  background: #4E8E4E;
}
</style>

<style>
/* jqxGrid global overrides (unscoped so they apply to jqwidgets DOM) */
.jqx-grid {
  border: 1px solid #E5E7EB !important;
  border-radius: 4px !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  font-size: 12px !important;
}
.jqx-grid-header {
  background: #F8F9FA !important;
  border-bottom: 1px solid #E5E7EB !important;
}
.jqx-grid-column-header {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #374151 !important;
  border-color: transparent !important;
}
.jqx-grid-cell {
  border-color: #F3F4F6 !important;
  font-size: 12px !important;
  color: #374151 !important;
}
.jqx-grid-cell-alt {
  background: #FAFBFC !important;
}
.jqx-grid-cell-selected {
  background: #E8F0FE !important;
  color: #374151 !important;
}
.jqx-fill-state-pressed {
  background: #E8F0FE !important;
}
</style>
