<template>
  <AppLayout title="视频生成">
    <div class="video-generate-wrapper">
      <div class="params-panel glass-card glow-border">
        <div class="params-scrollable">
          <div class="panel-header">
            <div class="panel-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h2>视频创作</h2>
          </div>
          
          <div class="section-title">输入提示词</div>
          <el-input
            v-model="prompt"
            type="textarea"
            :rows="4"
            placeholder="请描述您想要生成的视频内容，例如：一只可爱的小猫在花园里玩耍..."
            class="prompt-input"
          />
          
          <div class="prompt-presets">
            <span class="preset-label">快速模板：</span>
            <div class="preset-tags">
              <el-tag
                v-for="(preset, index) in promptPresets"
                :key="index"
                class="preset-tag"
                effect="plain"
                @click="prompt = preset.text"
              >
                {{ preset.label }}
              </el-tag>
            </div>
          </div>
          
          <div class="ethics-tip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>请遵守伦理规范，不生成违法违规内容</span>
          </div>
          
          <div class="section-title">参数配置</div>
          
          <div class="param-group">
            <div class="param-row">
              <div class="param-item">
                <label>视频时长</label>
                <el-tag type="info" effect="plain" style="width:100%;justify-content:center;height:36px;font-size:14px;">固定 5 秒</el-tag>
              </div>
              <div class="param-item">
                <label>分辨率</label>
                <el-tag type="info" effect="plain" style="width:100%;justify-content:center;height:36px;font-size:14px;">720P（最省成本）</el-tag>
              </div>
            </div>

            <div class="param-item">
              <label>画面风格</label>
              <div class="style-options">
                <div
                  v-for="(style, index) in styleOptions"
                  :key="index"
                  class="style-option"
                  :class="{ 'active': params.style === style.value }"
                  @click="params.style = style.value"
                >
                  <div class="style-preview" :class="'style-' + style.value">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <span class="style-label">{{ style.label }}</span>
                </div>
              </div>
            </div>

            <div class="param-item">
              <label>画面比例</label>
              <div class="ratio-options">
                <div
                  v-for="ratio in ratioOptions"
                  :key="ratio.value"
                  class="ratio-option"
                  :class="{ 'active': params.ratio === ratio.value }"
                  @click="params.ratio = ratio.value"
                >
                  <div class="ratio-preview" :style="{ aspectRatio: ratio.value }"></div>
                  <span class="ratio-label">{{ ratio.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="generate-footer">
          <el-button
            class="generate-btn gradient-btn"
            size="large"
            @click="handleGenerate"
            :loading="isGenerating"
            :disabled="!prompt.trim()"
          >
            <svg v-if="!isGenerating" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {{ isGenerating ? '正在生成视频...' : '生成视频' }}
          </el-button>
        </div>
      </div>
      
      <div class="result-panel glass-card glow-border">
        <div class="panel-header">
          <div class="panel-icon result-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <h2>视频预览</h2>
          <el-button
            v-if="generatedVideo"
            type="primary"
            size="small"
            @click="handleRegenerate"
            :loading="isGenerating"
          >
            重新生成
          </el-button>
        </div>
        
        <div v-if="isGenerating" class="loading-state">
          <div class="loading-visual">
            <div class="video-placeholder">
              <div class="loading-frame">
                <div class="frame-loader">
                  <div class="loader-scan"></div>
                  <div class="loader-lines">
                    <div class="loader-line" v-for="i in 5" :key="i" :style="{ animationDelay: (i * 0.1) + 's' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="loading-content">
            <h3>AI正在生成视频</h3>
            <p class="loading-desc">{{ loadingMessage }}</p>
            
            <div class="loading-steps">
              <div
                v-for="(step, index) in loadingSteps"
                :key="index"
                class="loading-step"
                :class="{ 
                  'active': currentStep === index,
                  'completed': currentStep > index
                }"
              >
                <div class="step-number">
                  <svg v-if="currentStep > index" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="step-label">{{ step }}</span>
              </div>
            </div>
            
            <div class="progress-section">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <div class="progress-info">
                <span>{{ Math.round(progressPercent) }}%</span>
                <span>预计剩余 {{ remainingTime }} 秒</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="!generatedVideo" class="empty-state">
          <div class="empty-icon">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </div>
          <h3>开始视频创作</h3>
          <p>描述您想要的视频场景，AI 将为您生成精彩内容</p>
          
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                </svg>
              </div>
              <div class="feature-info">
                <h4>智能理解</h4>
                <p>AI 深度理解您的提示词</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <div class="feature-info">
                <h4>高清画质</h4>
                <p>支持 1080p 高清输出</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <div class="feature-info">
                <h4>一键下载</h4>
                <p>轻松导出您的创作</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="video-display">
          <div class="video-container">
            <div class="video-wrapper">
              <video :src="generatedVideo" controls class="video-player">
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>
          
          <div class="video-info">
            <div class="info-tags">
              <el-tag type="success" effect="plain">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ params.duration }}秒
              </el-tag>
              <el-tag type="primary" effect="plain">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <rect x="3" y="9" width="18" height="6"></rect>
                  <line x1="9" y1="9" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="15"></line>
                </svg>
                {{ params.resolution }}
              </el-tag>
              <el-tag type="warning" effect="plain">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                </svg>
                {{ getStyleLabel(params.style) }}
              </el-tag>
              <el-tag type="info" effect="plain">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
                {{ params.ratio }}
              </el-tag>
            </div>
            
            <div class="video-actions">
              <el-button @click="handleExport" type="primary" size="large" class="gradient-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; display: inline-block; vertical-align: middle;">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                下载视频
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import AppLayout from '../components/AppLayout.vue'
import API from '../api'

const prompt = ref('')
const isGenerating = ref(false)
const generatedVideo = ref('')
const progressPercent = ref(0)
const loadingMessage = ref('正在初始化...')
const currentStep = ref(0)
const remainingTime = ref(120)

let timer = null

const params = reactive({
  duration: 5,
  resolution: '720P',
  ratio: '16:9',
  style: 'realistic'
})
// 注意：当前使用 wan2.2-t2v-plus 模型，固定 5 秒 / 720P，仅比例可调

const promptPresets = [
  { label: '自然风光', text: '壮观的日落景象，金色阳光洒在连绵的山脉上，水面波光粼粼' },
  { label: '城市夜景', text: '繁华都市的夜景，霓虹灯闪烁，高楼大厦灯火通明' },
  { label: '科技未来', text: '未来科技城市，悬浮列车，全息投影，充满科幻感的场景' },
  { label: '梦幻仙境', text: '梦幻的森林仙境，萤火虫飞舞，神秘的光芒，童话般的氛围' }
]

const ratioOptions = [
  { label: '16:9 横屏', value: '16:9' },
  { label: '9:16 竖屏', value: '9:16' },
  { label: '1:1 方形', value: '1:1' }
]

const styleOptions = [
  { label: '写实', value: 'realistic' },
  { label: '卡通', value: 'cartoon' },
  { label: '科幻', value: 'sci-fi' },
  { label: '油画', value: 'painting' }
]

const styleLabels = {
  realistic: '写实',
  cartoon: '卡通',
  'sci-fi': '科幻',
  painting: '油画'
}

const loadingSteps = [
  '提交任务',
  '排队等待',
  'AI生成中',
  '渲染画面',
  '合成视频'
]

const loadingMessages = [
  '正在向魔塔社区提交生成任务...',
  '任务排队中，请稍候...',
  'AI 正在生成视频，通常需要 1-3 分钟...',
  '正在渲染每一帧画面...',
  '即将完成，正在合成最终视频...'
]

const getStyleLabel = (style) => styleLabels[style] || style

const handleGenerate = async () => {
  if (!prompt.value.trim()) {
    ElMessage.error('请输入提示词')
    return
  }

  isGenerating.value = true
  generatedVideo.value = ''
  progressPercent.value = 0
  currentStep.value = 0
  remainingTime.value = 120
  loadingMessage.value = loadingMessages[0]

  try {
    // Step 1: 提交异步任务到魔塔社区（DashScope Wan 模型）
    const { taskId } = await API.submitVideoTask(prompt.value, {
      duration: params.duration,
      resolution: params.resolution,
      style: params.style,
      ratio: params.ratio
    })

    loadingMessage.value = '任务已提交，等待处理...'
    progressPercent.value = 5
    currentStep.value = 1

    // Step 2: 每 10 秒轮询任务状态
    timer = setInterval(async () => {
      try {
        const result = await API.queryVideoTask(taskId)

        if (result.status === 'SUCCEEDED' && result.videoUrl) {
          clearInterval(timer)
          timer = null
          generatedVideo.value = result.videoUrl
          progressPercent.value = 100
          currentStep.value = loadingSteps.length
          remainingTime.value = 0
          isGenerating.value = false
          // 保存到历史记录
          try {
            const history = JSON.parse(localStorage.getItem('aigc_video_history') || '[]')
            history.unshift({ id: Date.now(), prompt: prompt.value, video_url: result.videoUrl, created_at: new Date().toISOString() })
            localStorage.setItem('aigc_video_history', JSON.stringify(history.slice(0, 100)))
          } catch (_) {}
          ElMessage.success('视频生成成功！')
        } else if (result.status === 'FAILED') {
          clearInterval(timer)
          timer = null
          isGenerating.value = false
          ElMessage.error('视频生成失败: ' + (result.message || '请稍后重试'))
        } else if (result.status === 'RUNNING') {
          loadingMessage.value = loadingMessages[2]
          progressPercent.value = Math.min(90, progressPercent.value + 3)
          currentStep.value = 2
          remainingTime.value = Math.max(0, Math.floor((100 - progressPercent.value) / 1.5))
        } else if (result.status === 'PENDING') {
          loadingMessage.value = loadingMessages[1]
          progressPercent.value = Math.max(5, progressPercent.value + 0.5)
        } else if (result.status === 'UNKNOWN') {
          clearInterval(timer)
          timer = null
          isGenerating.value = false
          ElMessage.error('任务已过期或不存在，请重新生成')
        }
      } catch (pollErr) {
        console.error('轮询出错:', pollErr)
      }
    }, 10000)
  } catch (error) {
    console.error('提交任务失败:', error)
    isGenerating.value = false
    if (timer) { clearInterval(timer); timer = null }
    const msg = error.message || ''
    if (msg.includes('CORS') || msg.includes('代理')) {
      ElMessage.error('网络代理不可用，请刷新页面重试')
    } else if (msg.includes('403')) {
      ElMessage.error('API 授权失败，请检查 DashScope 余额或权限')
    } else if (msg.includes('429')) {
      ElMessage.error('请求过于频繁，请稍后再试')
    } else {
      ElMessage.error('提交失败: ' + msg)
    }
  }
}

const handleRegenerate = () => {
  if (!prompt.value.trim()) {
    ElMessage.error('请输入提示词')
    return
  }
  handleGenerate()
}

const handleExport = () => {
  if (!generatedVideo.value) {
    ElMessage.error('没有可导出的视频')
    return
  }
  
  const link = document.createElement('a')
  link.href = generatedVideo.value
  link.download = `generated_video_${Date.now()}.mp4`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('视频已下载')
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.video-generate-wrapper {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 24px;
  height: calc(100vh - 140px);
  animation: fadeIn 0.5s ease;
}

.params-panel {
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.params-scrollable {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.generate-footer {
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  margin-top: 16px;
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.panel-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #06b6d4 0%, #f59e0b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
}

.panel-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.prompt-input :deep(.el-textarea__inner) {
  min-height: 120px !important;
  resize: vertical;
}

.prompt-presets {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preset-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.preset-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-tag {
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-bg-glass) !important;
  border-color: var(--color-border) !important;
  color: var(--color-text-secondary) !important;
}

.preset-tag:hover {
  background: rgba(6, 182, 212, 0.2) !important;
  border-color: #06b6d4 !important;
  color: #22d3ee !important;
}

.ethics-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--color-warning);
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.param-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.param-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.param-select {
  width: 100%;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.param-header label {
  margin-bottom: 0;
}

.param-value {
  font-size: 14px;
  font-weight: 600;
  color: #22d3ee;
}

.style-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.style-option:hover {
  border-color: rgba(6, 182, 212, 0.5);
  background: rgba(6, 182, 212, 0.1);
}

.style-option.active {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.2);
}

.style-preview {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.style-realistic {
  background: linear-gradient(135deg, #64748b 0%, #334155 100%);
}

.style-cartoon {
  background: linear-gradient(135deg, #f472b6 0%, #fbbf24 100%);
}

.style-sci-fi {
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
}

.style-painting {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}

.style-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.style-option.active .style-label {
  color: var(--color-text-primary);
  font-weight: 500;
}

.ratio-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.ratio-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ratio-option:hover {
  border-color: rgba(6, 182, 212, 0.5);
  background: rgba(6, 182, 212, 0.1);
}

.ratio-option.active {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.2);
}

.ratio-preview {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #64748b 0%, #334155 100%);
  border-radius: 6px;
  transition: all var(--transition-fast);
}

.ratio-option.active .ratio-preview {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  box-shadow: 0 2px 12px rgba(6, 182, 212, 0.4);
}

.ratio-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.ratio-option.active .ratio-label {
  color: var(--color-text-primary);
  font-weight: 500;
}

.generate-section {
  margin-top: auto;
  padding-top: 8px;
}

.generate-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  gap: 8px;
  background: linear-gradient(135deg, #06b6d4 0%, #f59e0b 100%) !important;
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  max-height: calc(100vh - var(--header-height) - 48px);
}

.result-panel .panel-header {
  justify-content: space-between;
}

.result-panel .panel-header > div:first-child {
  display: flex;
  align-items: center;
  gap: 12px;
}

.result-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #f472b6 100%);
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 20px;
}

.loading-visual {
  width: 100%;
  max-width: 500px;
}

.video-placeholder {
  aspect-ratio: 16 / 9;
  background: var(--color-bg-glass);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.loading-frame {
  width: 80%;
  height: 80%;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.frame-loader {
  position: relative;
  width: 100%;
  height: 100%;
}

.loader-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #06b6d4, transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.loader-lines {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.loader-line {
  height: 10px;
  background: linear-gradient(90deg, var(--color-bg-glass), rgba(6, 182, 212, 0.3), var(--color-bg-glass));
  border-radius: 4px;
  animation: shimmer 1.5s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.loading-content {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.loading-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--color-text-primary);
}

.loading-desc {
  margin: 0 0 24px;
  color: var(--color-text-secondary);
}

.loading-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.loading-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-bg-glass);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: all var(--transition-normal);
}

.loading-step.active .step-number {
  background: linear-gradient(135deg, #06b6d4 0%, #f59e0b 100%);
  border-color: transparent;
  color: white;
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.loading-step.completed .step-number {
  background: var(--color-success);
  border-color: transparent;
  color: white;
}

.step-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.loading-step.active .step-label {
  color: #22d3ee;
}

.loading-step.completed .step-label {
  color: var(--color-success);
}

.progress-section {
  text-align: left;
}

.progress-bar {
  height: 8px;
  background: var(--color-bg-glass);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #f59e0b);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-muted);
}

.progress-info span:first-child {
  font-weight: 600;
  color: #22d3ee;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  gap: 16px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  background: var(--color-bg-glass);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.empty-state h3 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.empty-state > p {
  margin: 0;
  color: var(--color-text-secondary);
  max-width: 400px;
}

.feature-list {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--color-bg-glass);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  flex: 1;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
  flex-shrink: 0;
}

.feature-info {
  text-align: left;
}

.feature-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--color-text-primary);
}

.feature-info p {
  font-size: 12px;
  margin: 0;
  color: var(--color-text-muted);
}

.video-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideInRight 0.5s ease;
}

.video-container {
  background: var(--color-bg-glass);
  border-radius: var(--radius-lg);
  padding: 16px;
  border: 1px solid var(--color-border);
}

.video-wrapper {
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
}

.video-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-tags {
  display: flex;
  gap: 12px;
}

.video-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 1200px) {
  .video-generate-wrapper {
    grid-template-columns: 1fr;
  }
  
  .params-panel,
  .result-panel {
    max-height: none;
  }
  
  .style-options {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .feature-list {
    flex-direction: column;
  }
}
</style>
