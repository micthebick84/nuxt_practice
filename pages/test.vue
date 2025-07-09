<template>
  <q-page padding class="test-page">
    <div class="row">
      <!-- Left 20%: jqxTreeGrid -->
      <div class="col-12 col-md-3 tree-grid-container">
        <client-only>
          <div ref="treeGridContainer" class="tree-grid-wrapper"></div>
        </client-only>
      </div>
      <!-- Right 80%: existing content -->
      <div class="col">
        <div class="q-my-xl text-center">
          <div class="text-h4">{{ t('test') }}</div>
          <p class="q-mt-sm text-grey-8">
            This is a test page for development purposes.
          </p>
          <div class="q-mt-lg">
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h6">Test Content</div>
                <p class="q-mt-sm">
                  Welcome to the test page! This page is used for testing various features and components.
                </p>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn color="primary" label="Test Button" @click="fetchUsers" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const treeGridContainer = ref<HTMLDivElement | null>(null)

const fetchUsers = async () => {
  try {
    const config = useRuntimeConfig();
    const res = await fetch(`${config.public.apiBaseUrl}/api/users?page=1&size=10`);
    const text = await res.text();
    console.log('응답:', text);
    // JSON 파싱 시도
    try {
      const data = JSON.parse(text);
      console.log('사용자 리스트:', data);
    } catch (e) {
      console.error('JSON 파싱 실패:', e);
    }
  } catch (err) {
    console.error('사용자 조회 실패:', err);
  }
}

onMounted(async () => {
  // Load jqwidgets from CDN
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.head.appendChild(script)
    })
  }

  const loadCSS = (href: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.onload = () => resolve()
      link.onerror = () => reject(new Error(`Failed to load ${href}`))
      document.head.appendChild(link)
    })
  }

  try {
    // Load jqwidgets CSS
    await loadCSS('https://jqwidgets.com/public/jqwidgets/styles/jqx.base.css')
    await loadCSS('https://jqwidgets.com/public/jqwidgets/styles/jqx.material.css')
    
    // Load jqwidgets CDN scripts
    await loadScript('https://jqwidgets.com/public/jqwidgets/jqx-all.js')
    
    // Wait for DOM to be fully ready
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Sample group data
    const source = {
      dataType: 'json',
      dataFields: [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'parentid', type: 'number' }
      ],
      hierarchy: {
        keyDataField: { name: 'id' },
        parentDataField: { name: 'parentid' }
      },
      id: 'id',
      localData: [
        { id: 1, name: 'Headquarters', type: 'Department', parentid: null },
        { id: 2, name: 'Development Team', type: 'Team', parentid: 1 },
        { id: 3, name: 'Design Team', type: 'Team', parentid: 1 },
        { id: 4, name: 'John Doe', type: 'Employee', parentid: 2 },
        { id: 5, name: 'Jane Smith', type: 'Employee', parentid: 2 },
        { id: 6, name: 'Mike Johnson', type: 'Employee', parentid: 3 }
      ]
    }

    // Create jqxTreeGrid
    // @ts-ignore
    const dataAdapter = new window.jqx.dataAdapter(source)
    // @ts-ignore
    window.$(treeGridContainer.value).jqxTreeGrid({
      width: '100%',
      height: 400,
      source: dataAdapter,
      theme: 'material',
      columns: [
        { text: 'Name', dataField: 'name', width: '60%' },
        { text: 'Type', dataField: 'type', width: '40%' }
      ]
    })
  } catch (error) {
    console.error('Failed to load jqwidgets:', error)
  }
})
</script>

<style scoped>
/* Completely remove maxWidth restriction for q-page-container in test page */
:deep(.q-page-container) {
  max-width: none !important;
  margin: 0 !important;
  width: 100% !important;
}

.test-page {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.row {
  min-height: 500px;
  justify-content: flex-start;
  margin: 0;
  width: 100%;
}

.tree-grid-container {
  min-width: 250px;
  max-width: 350px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background: white;
  margin-left: 0;
  margin-right: auto;
  box-sizing: border-box;
}

.tree-grid-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
  box-sizing: border-box;
}

/* jqxTreeGrid style override */
:deep(.jqx-tree-grid) {
  border: 1px solid #ccc !important;
  font-family: Arial, sans-serif !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.jqx-tree-grid-header) {
  background-color: #f5f5f5 !important;
  border-bottom: 1px solid #ddd !important;
}

:deep(.jqx-tree-grid-row) {
  border-bottom: 1px solid #eee !important;
}

:deep(.jqx-tree-grid-cell) {
  padding: 8px !important;
}

/* Overall page container style */
:deep(.q-layout) {
  width: 100% !important;
}

:deep(.q-page) {
  width: 100% !important;
}
</style> 