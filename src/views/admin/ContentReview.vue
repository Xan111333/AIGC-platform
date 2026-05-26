<template>
  <AppLayout pageTitle="内容审核" pageSubtitle="管理后台 - 审核用户生成的AI内容">
    <div class="content-review-content">
      <!-- 统计卡片 -->
      <div class="stats-row">
        <div class="stat-card glass-card" :class="{ 'stat-active': activeFilter === '' }" @click="setFilter('')">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">全部内容</div>
        </div>
        <div class="stat-card glass-card pending" :class="{ 'stat-active': activeFilter === 'pending' }" @click="setFilter('pending')">
          <div class="stat-number">{{ stats.pending }}</div>
          <div class="stat-label">待审核</div>
        </div>
        <div class="stat-card glass-card approved" :class="{ 'stat-active': activeFilter === 'approved' }" @click="setFilter('approved')">
          <div class="stat-number">{{ stats.approved }}</div>
          <div class="stat-label">已通过</div>
        </div>
        <div class="stat-card glass-card rejected" :class="{ 'stat-active': activeFilter === 'rejected' }" @click="setFilter('rejected')">
          <div class="stat-number">{{ stats.rejected }}</div>
          <div class="stat-label">已拒绝</div>
        </div>
      </div>

      <div class="table-container glass-card">
        <el-table :data="contents" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80">
            <template #default="{ row }">
              {{ String(row.id).slice(-6) }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTypeTag(row.type)" size="small" effect="dark">
                {{ getTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户" width="120" />
          <el-table-column label="内容预览" min-width="300">
            <template #default="{ row }">
              <div v-if="row.type === 'image' && row.content" class="content-preview">
                <el-image
                  :src="row.content"
                  :preview-src-list="[row.content]"
                  fit="cover"
                  style="width: 120px; height: 80px; border-radius: 8px;"
                  :alt="row.prompt"
                >
                  <template #error>
                    <div class="img-placeholder">图片</div>
                  </template>
                </el-image>
                <div class="prompt-text">{{ row.prompt || '-' }}</div>
              </div>
              <div v-else class="content-preview">
                <div class="prompt-text">{{ row.prompt || '-' }}</div>
                <div class="content-text">{{ row.content ? row.content.substring(0, 150) : '-' }}{{ row.content && row.content.length > 150 ? '...' : '' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="生成时间" width="170">
            <template #default="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template #default="{ row }">
              <template v-if="row.status === 'pending'">
                <el-button size="small" type="success" @click="handleApprove(row)">通过</el-button>
                <el-button size="small" type="danger" @click="handleReject(row)">拒绝</el-button>
              </template>
              <template v-else>
                <el-button size="small" type="info" @click="handleViewDetail(row)">详情</el-button>
                <el-button size="small" @click="handleRevert(row)">撤回</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="contents.length === 0 && !loading" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p>{{ activeFilter === 'pending' ? '暂无待审核内容' : '暂无内容记录' }}</p>
          <span class="empty-hint">用户使用AI生成工具创作的内容会自动提交到此审核</span>
        </div>
      </div>

      <!-- 审核对话框 -->
      <el-dialog :title="dialogTitle" v-model="showReviewDialog" width="600px">
        <div v-if="selectedContent" class="review-content">
          <div class="review-meta">
            <el-tag :type="getTypeTag(selectedContent.type)" size="small" effect="dark">{{ getTypeLabel(selectedContent.type) }}</el-tag>
            <span>用户：{{ selectedContent.username }}</span>
            <span>时间：{{ formatDate(selectedContent.created_at) }}</span>
          </div>

          <div class="content-detail">
            <h4>Prompt 提示词</h4>
            <p>{{ selectedContent.prompt || '-' }}</p>
          </div>

          <div class="content-detail" v-if="selectedContent.type === 'image' && selectedContent.content">
            <h4>生成图片</h4>
            <el-image
              :src="selectedContent.content"
              :preview-src-list="[selectedContent.content]"
              fit="contain"
              style="width: 100%; max-height: 300px; border-radius: 8px;"
            />
          </div>

          <div class="content-detail" v-if="selectedContent.content && selectedContent.type !== 'image'">
            <h4>生成内容</h4>
            <p>{{ selectedContent.content }}</p>
          </div>

          <el-form v-if="showForm" :model="reviewForm" label-width="80px" style="margin-top: 16px;">
            <el-form-item label="审核结果">
              <el-radio-group v-model="reviewForm.approved">
                <el-radio :label="true">
                  <span style="color: #67c23a;">通过</span>
                </el-radio>
                <el-radio :label="false">
                  <span style="color: #f56c6c;">拒绝</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核理由">
              <el-input v-model="reviewForm.reason" type="textarea" :rows="3" placeholder="请输入审核理由（选填）" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button @click="showReviewDialog = false">{{ showForm ? '取消' : '关闭' }}</el-button>
          <el-button v-if="showForm" type="primary" @click="handleSubmitReview">提交审核</el-button>
        </template>
      </el-dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import API from '../../api'
import AppLayout from '../../components/AppLayout.vue'

const contents = ref([])
const loading = ref(false)
const activeFilter = ref('')
const showReviewDialog = ref(false)
const showForm = ref(false)
const selectedContent = ref(null)

const stats = reactive({ total: 0, pending: 0, approved: 0, rejected: 0 })

const reviewForm = reactive({
  approved: true,
  reason: ''
})

const dialogTitle = computed(() => {
  if (!selectedContent.value) return '内容详情'
  if (showForm.value) return selectedContent.value.status === 'pending' ? '审核内容' : '重新审核'
  return '内容详情'
})

const getTypeTag = (type) => {
  const tags = { text: '', image: 'success', audio: 'warning', video: 'danger' }
  return tags[type] || 'info'
}

const getTypeLabel = (type) => {
  const labels = { text: '文本', image: '图像', audio: '音频', video: '视频' }
  return labels[type] || type
}

const getStatusType = (status) => {
  const types = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return labels[status] || status
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const setFilter = (status) => {
  activeFilter.value = status
  loadContents()
}

const loadStats = async () => {
  try {
    const data = await API.request('/api/admin/contents/stats')
    stats.total = data.total
    stats.pending = data.pending
    stats.approved = data.approved
    stats.rejected = data.rejected
  } catch (e) {
    console.error('Load stats error:', e)
  }
}

const loadContents = async () => {
  loading.value = true
  try {
    const url = activeFilter.value
      ? `/api/admin/contents/pending?status=${activeFilter.value}`
      : '/api/admin/contents/pending'
    const data = await API.request(url)
    contents.value = data
    loadStats()
  } catch (error) {
    console.error('Load contents error:', error)
    contents.value = []
  } finally {
    loading.value = false
  }
}

const handleApprove = (content) => {
  selectedContent.value = content
  reviewForm.approved = true
  reviewForm.reason = ''
  showForm.value = true
  showReviewDialog.value = true
}

const handleReject = (content) => {
  selectedContent.value = content
  reviewForm.approved = false
  reviewForm.reason = ''
  showForm.value = true
  showReviewDialog.value = true
}

const handleViewDetail = (content) => {
  selectedContent.value = content
  showForm.value = false
  showReviewDialog.value = true
}

const handleRevert = async (content) => {
  try {
    await ElMessageBox.confirm('确定要将此内容撤回为待审核状态吗？', '撤回审核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await API.request(`/api/admin/contents/${content.id}/review`, {
      method: 'POST',
      body: JSON.stringify({ approved: true, reason: '管理员撤回审核' })
    })
    ElMessage.success('已撤回为待审核')
    loadContents()
  } catch (e) {
    if (e !== 'cancel') {
      console.error('Revert error:', e)
      ElMessage.error('操作失败')
    }
  }
}

const handleSubmitReview = async () => {
  try {
    await API.request(`/api/admin/contents/${selectedContent.value.id}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewForm)
    })
    ElMessage.success(reviewForm.approved ? '内容已通过审核' : '内容已拒绝')
    showReviewDialog.value = false
    loadContents()
  } catch (error) {
    console.error('Submit review error:', error)
    ElMessage.error('审核提交失败')
  }
}

onMounted(() => {
  loadContents()
})
</script>

<style scoped>
.content-review-content {
  padding: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.stat-active {
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

.stat-card.pending.stat-active {
  border-color: #e6a23c;
  box-shadow: 0 0 20px rgba(230, 162, 60, 0.2);
}

.stat-card.approved.stat-active {
  border-color: #67c23a;
  box-shadow: 0 0 20px rgba(103, 194, 58, 0.2);
}

.stat-card.rejected.stat-active {
  border-color: #f56c6c;
  box-shadow: 0 0 20px rgba(245, 108, 108, 0.2);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-card.pending .stat-number { color: #e6a23c; }
.stat-card.approved .stat-number { color: #67c23a; }
.stat-card.rejected .stat-number { color: #f56c6c; }

.stat-label {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 8px;
}

.table-container {
  padding: 24px;
}

.content-preview {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.prompt-text {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.content-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.img-placeholder {
  width: 120px;
  height: 80px;
  background: var(--color-bg-glass, #f0f0f0);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 13px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: var(--color-text-muted);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.empty-hint {
  font-size: 13px;
  margin-top: 8px;
  opacity: 0.7;
}

.review-content {
  padding: 0;
}

.review-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
  font-size: 13px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border, #eee);
  margin-bottom: 16px;
}

.content-detail {
  background: var(--color-bg-glass, #f9f9f9);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.content-detail h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.content-detail p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
