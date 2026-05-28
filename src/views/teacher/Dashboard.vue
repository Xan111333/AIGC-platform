<template>
  <AppLayout pageTitle="首页仪表盘" pageSubtitle="教师工作台 · 管理教学事务">
    <div class="teacher-dashboard">
      <!-- Hero 欢迎区 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>AI 驱动的教学管理平台</span>
          </div>
          <h1 class="hero-title">
            <span class="gradient-text">洞察学情，</span>
            <span class="gradient-text">赋能教学</span>
          </h1>
          <p class="hero-desc">
            一站式教学管理仪表盘，实时追踪学生学习进度、任务完成情况与作品质量，让教学决策有据可依。
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">{{ overview.total_students }}</span>
              <span class="stat-label">学生人数</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">{{ overview.total_tasks }}</span>
              <span class="stat-label">发布任务</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">{{ overview.submission_rate }}%</span>
              <span class="stat-label">提交率</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card card-1 glass-card glow-border">
            <div class="card-icon students">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span>学生管理</span>
          </div>
          <div class="floating-card card-2 glass-card glow-border">
            <div class="card-icon tasks">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <span>任务发布</span>
          </div>
          <div class="floating-card card-3 glass-card glow-border">
            <div class="card-icon grades">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <span>成绩分析</span>
          </div>
        </div>
      </section>

      <!-- 快捷操作 -->
      <section class="quick-actions-section">
        <div class="section-header">
          <h2>快捷操作</h2>
          <p>常用教学管理入口，一键直达</p>
        </div>
        <div class="quick-cards">
          <router-link to="/student-tasks" class="quick-card glass-card glow-border">
            <div class="quick-icon publish">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="quick-info">
              <h3>实训任务</h3>
              <p>发布、编辑与管理学生实训任务</p>
            </div>
            <div class="quick-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </router-link>

          <router-link to="/my-works" class="quick-card glass-card glow-border">
            <div class="quick-icon grade">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div class="quick-info">
              <h3>作品管理</h3>
              <p>查看、批改学生提交的各类作品</p>
            </div>
            <div class="quick-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </router-link>

          <router-link to="/resource-center" class="quick-card glass-card glow-border">
            <div class="quick-icon resource">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div class="quick-info">
              <h3>学习资源</h3>
              <p>上传与管理教学资料与参考文档</p>
            </div>
            <div class="quick-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </router-link>

          <div class="quick-card glass-card glow-border" @click="handleExportReport">
            <div class="quick-icon export">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div class="quick-info">
              <h3>导出报表</h3>
              <p>一键导出学生成绩与任务统计报表</p>
            </div>
            <div class="quick-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据概览 -->
      <section class="dashboard-grid">
        <div class="grid-left">
          <!-- 核心指标 -->
          <div class="stats-panel glass-card">
            <div class="panel-header">
              <h3>核心指标</h3>
              <el-select v-model="timePeriod" @change="handlePeriodChange" size="small" style="width: 100px;">
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
                <el-option label="本学期" value="all" />
              </el-select>
            </div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon-bg students">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div class="stat-text">
                  <div class="stat-number">{{ overview.total_students }}</div>
                  <div class="stat-name">学生总数</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon-bg tasks">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div class="stat-text">
                  <div class="stat-number">{{ overview.total_tasks }}</div>
                  <div class="stat-name">任务总数</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon-bg submission">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <div class="stat-text">
                  <div class="stat-number">{{ overview.submission_rate }}%</div>
                  <div class="stat-name">提交率</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon-bg score">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div class="stat-text">
                  <div class="stat-number">{{ overview.average_score }}</div>
                  <div class="stat-name">平均分</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="charts-row">
            <div class="chart-card glass-card">
              <div class="panel-header">
                <h3>成绩分布</h3>
              </div>
              <div ref="gradeChartRef" class="chart-container"></div>
            </div>

            <div class="chart-card glass-card">
              <div class="panel-header">
                <h3>任务完成率</h3>
              </div>
              <div ref="taskChartRef" class="chart-container"></div>
            </div>
          </div>

          <div class="chart-card wide glass-card">
            <div class="panel-header">
              <h3>模块使用频次</h3>
            </div>
            <div ref="moduleChartRef" class="chart-container"></div>
          </div>
        </div>

        <div class="grid-right">
          <!-- 最近提交 -->
          <div class="submissions-panel glass-card">
            <div class="panel-header">
              <h3>最近提交</h3>
              <router-link to="/my-works" class="view-all">查看全部</router-link>
            </div>
            <div class="submission-list">
              <div v-for="row in recentSubmissions.slice(0, 6)" :key="row.id" class="submission-item">
                <div class="submission-avatar">
                  {{ row.student_name?.charAt(0) || '?' }}
                </div>
                <div class="submission-info">
                  <h4>{{ row.student_name || '未知学生' }}</h4>
                  <p>{{ row.task_title || '未命名任务' }}</p>
                </div>
                <div class="submission-meta">
                  <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
                    {{ row.status === 'pending' ? '待批改' : '已完成' }}
                  </el-tag>
                  <span class="submission-time">{{ formatDate(row.submitted_at) }}</span>
                </div>
              </div>
              <div v-if="recentSubmissions.length === 0" class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p>暂无待批改提交</p>
              </div>
            </div>
          </div>

          <!-- 今日提示 -->
          <div class="tips-panel glass-card glow-border">
            <div class="tip-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12.5A2.5 2.5 0 0 1 4.5 10h15A2.5 2.5 0 0 1 22 12.5v4.5A2.5 2.5 0 0 1 19.5 19h-15A2.5 2.5 0 0 1 2 16.5z"></path>
                <path d="M6 10V8a6 6 0 0 1 12 0v2"></path>
              </svg>
            </div>
            <div class="tip-content">
              <h4>今日提示</h4>
              <p>定期查看学生的作品提交情况，及时给予反馈可以有效提升学生的参与度和创作热情。</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 批改弹窗 -->
    <el-dialog title="批改作业" v-model="gradeDialogVisible" width="500px" class="grade-dialog">
      <el-form :model="gradeForm" label-width="80px">
        <el-form-item label="学生">
          <el-input v-model="gradeForm.studentName" disabled />
        </el-form-item>
        <el-form-item label="任务">
          <el-input v-model="gradeForm.taskTitle" disabled />
        </el-form-item>
        <el-form-item label="成绩">
          <el-input-number v-model="gradeForm.score" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="评语">
          <el-input v-model="gradeForm.comment" type="textarea" :rows="4" placeholder="请输入评语" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="gradeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitGrade">提交</el-button>
      </template>
    </el-dialog>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import API from '../../api'
import AppLayout from '../../components/AppLayout.vue'

const timePeriod = ref('week')
const overview = ref({
  total_students: 0,
  total_tasks: 0,
  total_submissions: 0,
  submission_rate: 0,
  average_score: 0,
  pending_grades: 0,
  recent_submissions: []
})

const recentSubmissions = ref([])
const gradeChartRef = ref(null)
const taskChartRef = ref(null)
const moduleChartRef = ref(null)

let gradeChart = null
let taskChart = null
let moduleChart = null

const gradeDialogVisible = ref(false)
const gradeForm = reactive({
  id: null,
  studentName: '',
  taskTitle: '',
  score: 0,
  comment: ''
})

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

const loadOverview = async () => {
  try {
    const data = await API.request('/api/statistics/overview')
    overview.value = data
    recentSubmissions.value = data.recent_submissions || []
  } catch (error) {
    console.error('Load overview error:', error)
    overview.value = {
      total_students: 5,
      total_tasks: 3,
      total_submissions: 12,
      submission_rate: 80,
      average_score: 85.5,
      pending_grades: 3,
      recent_submissions: []
    }
  }
}

const loadGradeDistribution = async () => {
  try {
    const data = await API.request('/api/statistics/grade-distribution')
    initGradeChart(data)
  } catch (error) {
    console.error('Load grade distribution error:', error)
    initGradeChart({
      "0-59": 2,
      "60-69": 5,
      "70-79": 8,
      "80-89": 10,
      "90-100": 5
    })
  }
}

const loadTaskCompletion = async () => {
  try {
    const data = await API.request('/api/statistics/task-completion')
    initTaskChart(data)
  } catch (error) {
    console.error('Load task completion error:', error)
    initTaskChart([
      { title: '文本生成任务', completion_rate: 85 },
      { title: '图像生成任务', completion_rate: 70 },
      { title: '综合实训任务', completion_rate: 60 }
    ])
  }
}

const loadModuleUsage = async () => {
  try {
    const data = await API.request(`/api/statistics/module-usage?period=${timePeriod.value}`)
    initModuleChart(data)
  } catch (error) {
    console.error('Load module usage error:', error)
    initModuleChart({
      text: 45,
      image: 32,
      video: 18,
      audio: 12
    })
  }
}

const initGradeChart = (data) => {
  if (!gradeChartRef.value) return
  if (!gradeChart) {
    gradeChart = echarts.init(gradeChartRef.value)
  }

  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: Object.keys(data),
      axisLabel: { rotate: 0 }
    },
    yAxis: { type: 'value', name: '人数' },
    series: [{
      type: 'bar',
      data: Object.values(data),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ])
      },
      barRadius: [4, 4, 0, 0]
    }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  }

  gradeChart.setOption(option)
}

const initTaskChart = (data) => {
  if (!taskChartRef.value) return
  if (!taskChart) {
    taskChart = echarts.init(taskChartRef.value)
  }

  const chartData = data.map(item => ({
    name: item.title,
    value: item.completion_rate
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}%'
      },
      data: chartData,
      color: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
    }]
  }

  taskChart.setOption(option)
}

const initModuleChart = (data) => {
  if (!moduleChartRef.value) return
  if (!moduleChart) {
    moduleChart = echarts.init(moduleChartRef.value)
  }

  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['文本生成', '图像生成', '视频生成', '音频生成']
    },
    yAxis: { type: 'value', name: '使用次数' },
    series: [{
      type: 'line',
      data: [data.text || 0, data.image || 0, data.video || 0, data.audio || 0],
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
        ])
      },
      lineStyle: { color: '#667eea', width: 3 },
      itemStyle: { color: '#667eea' }
    }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  }

  moduleChart.setOption(option)
}

const handlePeriodChange = () => {
  loadModuleUsage()
}

const handleExportReport = async () => {
  try {
    const subs = await API.getTaskSubmissions(0)
    const rows = subs.map(s => `${s.student_name || ''},${s.task_title || ''},${s.grade?.score || ''},${s.grade?.feedback || ''}`)
    const csv = '学生,任务,分数,评语\n' + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'grade_report.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('报表导出成功')
  } catch (error) {
    console.error('Export error:', error)
    ElMessage.error('报表导出失败')
  }
}

const handleGrade = (row) => {
  gradeForm.id = row.id
  gradeForm.studentName = row.student_name
  gradeForm.taskTitle = row.task_title
  gradeForm.score = row.score || 0
  gradeForm.comment = row.comment || ''
  gradeDialogVisible.value = true
}

const submitGrade = async () => {
  try {
    await API.updateGrade(gradeForm.id, {
      score: gradeForm.score,
      comment: gradeForm.comment
    })
    ElMessage.success('批改成功')
    gradeDialogVisible.value = false
    loadOverview()
  } catch (error) {
    console.error('Grade error:', error)
    ElMessage.error('批改失败')
  }
}

const handleResize = () => {
  gradeChart?.resize()
  taskChart?.resize()
  moduleChart?.resize()
}

onMounted(() => {
  loadOverview()
  loadGradeDistribution()
  loadTaskCompletion()
  loadModuleUsage()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  gradeChart?.dispose()
  taskChart?.dispose()
  moduleChart?.dispose()
})
</script>

<style scoped>
.teacher-dashboard {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== Hero Section ===== */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: var(--color-success);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--color-success);
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 16px;
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline;
}

.hero-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0 0 32px;
  max-width: 480px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.hero-stats .stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-stats .stat-number {
  font-size: 28px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-stats .stat-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* Hero Visual */
.hero-visual {
  position: relative;
  height: 280px;
}

.floating-card {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  width: 130px;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.card-1 { top: 20px; left: 20px; animation: float1 4s ease-in-out infinite; }
.card-2 { top: 50px; right: 40px; animation: float2 5s ease-in-out infinite; }
.card-3 { bottom: 20px; left: 50%; transform: translateX(-50%); animation: float3 4.5s ease-in-out infinite; }

@keyframes float1 {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

@keyframes float2 {
  0%, 100% { transform: translateY(0) rotate(2deg); }
  50% { transform: translateY(-20px) rotate(-2deg); }
}

@keyframes float3 {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-12px); }
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-icon.students { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.card-icon.tasks { background: linear-gradient(135deg, #22c55e, #10b981); }
.card-icon.grades { background: linear-gradient(135deg, #f59e0b, #f97316); }

/* ===== Quick Actions ===== */
.quick-actions-section {
  margin-bottom: 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--color-text-primary);
}

.section-header p {
  margin: 0;
  color: var(--color-text-muted);
}

.quick-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.quick-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.quick-icon.publish { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.quick-icon.grade { background: linear-gradient(135deg, #f59e0b, #f97316); }
.quick-icon.resource { background: linear-gradient(135deg, #22c55e, #10b981); }
.quick-icon.export { background: linear-gradient(135deg, #f472b6, #fb7185); }

.quick-info {
  flex: 1;
}

.quick-info h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--color-text-primary);
}

.quick-info p {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

.quick-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: all var(--transition-normal);
}

.quick-card:hover .quick-arrow {
  background: var(--gradient-primary);
  color: white;
  transform: translateX(4px);
}

/* ===== Dashboard Grid ===== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.grid-left,
.grid-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.view-all {
  font-size: 13px;
  color: var(--color-primary-light);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.view-all:hover {
  color: var(--color-primary);
}

/* Stats Panel */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stats-panel .stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--color-bg-glass);
  border-radius: 14px;
}

.stat-icon-bg {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon-bg.students { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.stat-icon-bg.tasks { background: linear-gradient(135deg, #22c55e, #10b981); }
.stat-icon-bg.submission { background: linear-gradient(135deg, #f59e0b, #f97316); }
.stat-icon-bg.score { background: linear-gradient(135deg, #f472b6, #fb7185); }

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-text .stat-number {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-text .stat-name {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  padding: 20px;
  border-radius: 16px;
}

.chart-card.wide {
  grid-column: span 2;
}

.chart-container {
  height: 260px;
}

/* Submissions Panel */
.submission-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submission-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--color-bg-glass);
  border-radius: 12px;
  transition: all var(--transition-fast);
}

.submission-item:hover {
  background: var(--color-bg-glass-hover);
}

.submission-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}

.submission-info {
  flex: 1;
  min-width: 0;
}

.submission-info h4 {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
  color: var(--color-text-primary);
}

.submission-info p {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submission-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.submission-time {
  font-size: 11px;
  color: var(--color-text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  color: var(--color-text-muted);
}

.empty-state svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

/* Tips Panel */
.tips-panel {
  display: flex;
  gap: 16px;
  padding: 20px;
}

.tip-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.tip-content h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
  color: var(--color-text-primary);
}

.tip-content p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1200px) {
  .hero-section {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    display: none;
  }
  .quick-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .charts-row {
    grid-template-columns: 1fr;
  }
  .chart-card.wide {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 30px;
  }
  .hero-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
  .stat-divider {
    display: none;
  }
  .quick-cards {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
