import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph } from 'docx'
import JSZip from 'jszip'

const ZHIPU_API_KEY = 'd1354054dcb045c19df3dcd50c2f4827.C0osK2v5qXYiEOI1'

function localGet(key) {
  try { return JSON.parse(localStorage.getItem('aigc_' + key) || 'null') } catch { return null }
}
function localSet(key, val) { localStorage.setItem('aigc_' + key, JSON.stringify(val)) }
function simpleHash(password) {
  let hash = 0; for (let i = 0; i < password.length; i++) { hash = ((hash << 5) - hash) + password.charCodeAt(i); hash |= 0 }
  return hash.toString(16)
}
function initDefaultUsers() {
  if (localGet('users')) return
  const users = {
    admin: { id: 1, username: 'admin', email: 'admin@example.com', hashed_password: simpleHash('admin123'), role: 'admin', full_name: 'Admin User', is_active: true, created_at: new Date().toISOString() },
    teacher: { id: 2, username: 'teacher', email: 'teacher@example.com', hashed_password: simpleHash('teacher123'), role: 'teacher', full_name: 'Teacher User', is_active: true, created_at: new Date().toISOString() },
    student: { id: 3, username: 'student', email: 'student@example.com', hashed_password: simpleHash('student123'), role: 'student', full_name: 'Student User', is_active: true, created_at: new Date().toISOString() }
  }
  localSet('users', users)
  localSet('user_id_counter', 4)
  localSet('tasks', [])
  localSet('submissions', [])
  localSet('resources', [])
  localSet('creation_logs', [])
  localSet('admin_logs', [])
  localSet('text_history', [])
  localSet('image_history', [])
  localSet('video_history', [])
  localSet('audio_history', [])
  localSet('system_config', { site_name: 'AIGC 实训平台', site_description: '探索 AI 创作的无限可能', max_daily_generations: 50, allow_registration: true, require_content_review: false, api_key_status: { zhipu: true } })
}
initDefaultUsers()

const API = {
  getToken() { return localStorage.getItem('token') },
  setToken(token) { localStorage.setItem('token', token) },
  removeToken() { localStorage.removeItem('token') },
  getCurrentUser() {
    const token = this.getToken(); if (!token) return null
    try { const data = JSON.parse(atob(token.split('.')[1])); const users = localGet('users') || {}; return users[data.sub] || null } catch { return null }
  },
  _makeToken(username) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const now = Math.floor(Date.now() / 1000)
    const payload = btoa(JSON.stringify({ sub: username, exp: now + 3600 * 24 * 7, iat: now }))
    return `${header}.${payload}.fake-signature-for-demo`
  },

  async login(username, password) {
    const users = localGet('users') || {}
    const user = users[username]
    if (!user || user.hashed_password !== simpleHash(password)) throw new Error('用户名或密码错误')
    if (!user.is_active) throw new Error('账户已被禁用')
    const token = this._makeToken(username)
    this.setToken(token)
    const logs = localGet('admin_logs') || []
    logs.push({ id: Date.now(), user_id: user.id, action: 'login', details: `${user.username} 登录系统`, created_at: new Date().toISOString() })
    localSet('admin_logs', logs.slice(-200))
    return { access_token: token, token_type: 'bearer', user }
  },

  async request(url, options = {}) {
    await new Promise(r => setTimeout(r, 100))
    const token = this.getToken()
    const user = token ? this.getCurrentUser() : null
    const path = url.replace(/^\//, '')
    const body = options.body ? JSON.parse(options.body) : null
    const method = (options.method || 'GET').toUpperCase()

    if (path === 'api/users/me') {
      if (!user) throw new Error('未登录')
      return user
    }
    if (path === 'api/auth/register' && method === 'POST') {
      const users = localGet('users') || {}
      if (users[body.username]) throw new Error('用户名已存在')
      let counter = localGet('user_id_counter') || 4
      users[body.username] = { id: counter++, username: body.username, email: body.email || '', hashed_password: simpleHash(body.password), role: body.role || 'student', full_name: body.full_name || body.username, is_active: true, created_at: new Date().toISOString() }
      localSet('users', users)
      localSet('user_id_counter', counter)
      return { message: '注册成功' }
    }
    if (path === 'api/text/generate' && method === 'POST') {
      const result = await this._callZhipuChat(body.prompt)
      const history = localGet('text_history') || []
      history.unshift({ id: Date.now(), prompt: body.prompt, content: result, created_at: new Date().toISOString(), user_id: user?.id })
      localSet('text_history', history.slice(0, 100))
      return { content: result, generated_at: new Date().toISOString() }
    }
    if (path === 'api/image/generate' && method === 'POST') {
      const result = await this._callZhipuImage(body.prompt)
      const history = localGet('image_history') || []
      history.unshift({ id: Date.now(), prompt: body.prompt, image_url: result, created_at: new Date().toISOString(), user_id: user?.id })
      localSet('image_history', history.slice(0, 100))
      return { image_url: result, generated_at: new Date().toISOString() }
    }
    if (path === 'api/audio/generate' && method === 'POST') {
      const text = body.text || ''
      const history = localGet('audio_history') || []
      history.unshift({ id: Date.now(), text, audio_url: '', created_at: new Date().toISOString(), user_id: user?.id })
      localSet('audio_history', history.slice(0, 100))
      return { audio_url: '', message: '前端语音合成请使用浏览器 SpeechSynthesis API', generated_at: new Date().toISOString() }
    }
    if (path === 'api/video/generate' && method === 'POST') {
      const history = localGet('video_history') || []
      history.unshift({ id: Date.now(), prompt: body.prompt, video_url: '', created_at: new Date().toISOString(), user_id: user?.id })
      localSet('video_history', history.slice(0, 100))
      return { video_url: '', message: '视频生成当前为演示模式', generated_at: new Date().toISOString() }
    }
    if (path === 'api/text/history') { return (localGet('text_history') || []).slice(0, 50) }
    if (path === 'api/image/history') { return (localGet('image_history') || []).slice(0, 50) }
    if (path === 'api/audio/history') { return (localGet('audio_history') || []).slice(0, 50) }
    if (path === 'api/video/history') { return (localGet('video_history') || []).slice(0, 50) }
    if (path === 'api/tasks') {
      if (method === 'GET') return localGet('tasks') || []
      if (method === 'POST') { const tasks = localGet('tasks') || []; tasks.push({ ...body, id: Date.now(), created_at: new Date().toISOString(), creator_id: user?.id }); localSet('tasks', tasks); return tasks[tasks.length - 1] }
    }
    if (path.match(/^api\/tasks\/\d+$/)) {
      const taskId = parseInt(path.split('/')[2])
      const tasks = localGet('tasks') || []
      if (method === 'GET') return tasks.find(t => t.id === taskId) || null
      if (method === 'PUT') { const i = tasks.findIndex(t => t.id === taskId); if (i >= 0) tasks[i] = { ...tasks[i], ...body }; localSet('tasks', tasks); return tasks[i] }
      if (method === 'DELETE') { const i = tasks.findIndex(t => t.id === taskId); if (i >= 0) { const t = tasks.splice(i, 1)[0]; localSet('tasks', tasks); return t } }
    }
    if (path.match(/^api\/tasks\/\d+\/submissions$/)) {
      const taskId = parseInt(path.split('/')[2])
      return (localGet('submissions') || []).filter(s => s.task_id === taskId)
    }
    if (path === 'api/submissions') {
      if (method === 'POST') { const subs = localGet('submissions') || []; subs.push({ ...body, id: Date.now(), created_at: new Date().toISOString(), student_id: user?.id }); localSet('submissions', subs); return subs[subs.length - 1] }
    }
    if (path === 'api/submissions/my') {
      return (localGet('submissions') || []).filter(s => s.student_id === user?.id)
    }
    if (path.match(/^api\/submissions\/\d+\/grade$/)) {
      const sid = parseInt(path.split('/')[2])
      const subs = localGet('submissions') || []
      const i = subs.findIndex(s => s.id === sid)
      if (i >= 0) { subs[i] = { ...subs[i], grade: body.grade, feedback: body.feedback, graded_at: new Date().toISOString() }; localSet('submissions', subs); return subs[i] }
    }
    if (path === 'api/resources') {
      if (method === 'GET') { const cat = new URLSearchParams(url.split('?')[1]).get('category'); const res = localGet('resources') || []; return cat ? res.filter(r => r.category === cat) : res }
      if (method === 'POST') { const res = localGet('resources') || []; res.push({ ...body, id: Date.now(), created_at: new Date().toISOString(), uploader_id: user?.id }); localSet('resources', res); return res[res.length - 1] }
    }
    if (path.match(/^api\/resources\/\d+$/)) {
      const rid = parseInt(path.split('/')[2])
      const res = localGet('resources') || []
      if (method === 'GET') return res.find(r => r.id === rid) || null
      if (method === 'DELETE') { const i = res.findIndex(r => r.id === rid); if (i >= 0) { const r = res.splice(i, 1)[0]; localSet('resources', res); return r } }
    }
    if (path === 'api/resources/categories') { return [...new Set((localGet('resources') || []).map(r => r.category).filter(Boolean))] }
    if (path === 'api/creation-logs' && method === 'POST') { const logs = localGet('creation_logs') || []; logs.push({ ...body, id: Date.now(), created_at: new Date().toISOString(), user_id: user?.id }); localSet('creation_logs', logs); return logs[logs.length - 1] }
    if (path === 'api/statistics/overview') {
      const users = localGet('users') || {}
      const allUsers = Object.values(users)
      const subs = localGet('submissions') || []
      return { total_users: allUsers.length, total_students: allUsers.filter(u => u.role === 'student').length, total_teachers: allUsers.filter(u => u.role === 'teacher').length, total_admins: allUsers.filter(u => u.role === 'admin').length, total_tasks: (localGet('tasks') || []).length, total_submissions: subs.length, active_users: allUsers.filter(u => u.is_active).length, pending_contents: 0 }
    }
    if (path === 'api/statistics/task-completion') {
      const tasks = localGet('tasks') || []
      const subs = localGet('submissions') || []
      return tasks.map(t => ({ task_id: t.id, task_title: t.title, total_submissions: subs.filter(s => s.task_id === t.id).length, avg_score: subs.filter(s => s.task_id === t.id && s.grade).reduce((a, s) => a + (s.grade?.score || 0), 0) / (subs.filter(s => s.task_id === t.id && s.grade).length || 1) }))
    }
    if (path === 'api/statistics/grade-distribution') {
      const subs = localGet('submissions') || []
      const graded = subs.filter(s => s.grade)
      const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 }
      graded.forEach(s => { const sc = s.grade.score || 0; if (sc >= 90) dist.A++; else if (sc >= 80) dist.B++; else if (sc >= 70) dist.C++; else if (sc >= 60) dist.D++; else dist.F++ })
      return dist
    }
    if (path === 'api/statistics/module-usage') { return { text: (localGet('text_history') || []).length, image: (localGet('image_history') || []).length, audio: (localGet('audio_history') || []).length, video: (localGet('video_history') || []).length } }
    if (path === 'api/admin/users') {
      if (method === 'GET') { const users = localGet('users') || {}; return Object.values(users) }
      if (method === 'POST') { const users = localGet('users') || {}; let counter = localGet('user_id_counter') || 4; users[body.username] = { ...body, id: counter++, hashed_password: simpleHash(body.password || '123456'), is_active: true, created_at: new Date().toISOString() }; localSet('users', users); localSet('user_id_counter', counter); return users[body.username] }
    }
    if (path.match(/^api\/admin\/users\/\d+$/)) {
      const uid = parseInt(path.split('/')[3])
      const users = localGet('users') || {}
      const uname = Object.keys(users).find(k => users[k].id === uid)
      if (method === 'GET') return users[uname] || null
      if (method === 'PUT' && uname) { users[uname] = { ...users[uname], ...body }; localSet('users', users); return users[uname] }
      if (method === 'DELETE' && uname) { delete users[uname]; localSet('users', users); return { message: '删除成功' } }
    }
    if (path.match(/^api\/admin\/users\/\d+\/reset-password$/)) {
      const uid = parseInt(path.split('/')[3])
      const users = localGet('users') || {}
      const uname = Object.keys(users).find(k => users[k].id === uid)
      if (uname) { users[uname].hashed_password = simpleHash('123456'); localSet('users', users); return { message: '密码已重置为 123456' } }
    }
    if (path === 'api/admin/system/config') {
      if (method === 'GET') return localGet('system_config') || {}
      if (method === 'PUT') { localSet('system_config', { ...localGet('system_config'), ...body }); return localGet('system_config') }
    }
    if (path === 'api/admin/logs') { return (localGet('admin_logs') || []).reverse().slice(0, 50) }
    if (path === 'api/admin/statistics') {
      const users = localGet('users') || {}
      return { total_users: Object.values(users).length, total_creations: (localGet('text_history') || []).length + (localGet('image_history') || []).length + (localGet('audio_history') || []).length + (localGet('video_history') || []).length, total_contents: 0, pending_reviews: 0, total_tasks: (localGet('tasks') || []).length, total_submissions: (localGet('submissions') || []).length }
    }
    if (path === 'api/statistics/export-report') {
      return { report_url: '#', message: '报告导出功能暂由前端直接生成' }
    }
    throw new Error('API 未实现: ' + path)
  },

  async generateText(prompt, params) {
    return this.request('/api/text/generate', { method: 'POST', body: JSON.stringify({ prompt, ...params }) })
  },
  async generateImage(prompt, params) {
    return this.request('/api/image/generate', { method: 'POST', body: JSON.stringify({ prompt, ...params }) })
  },
  async generateAudio(text, params) {
    return this.request('/api/audio/generate', { method: 'POST', body: JSON.stringify({ text, ...params }) })
  },
  async generateVideo(prompt, params) {
    return this.request('/api/video/generate', { method: 'POST', body: JSON.stringify({ prompt, ...params }) })
  },

  async _callZhipuChat(prompt) {
    const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl)
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ZHIPU_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'glm-4-flash', messages: [{ role: 'user', content: prompt }] })
    })
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || 'AI 服务请求失败') }
    const data = await res.json()
    return data.choices?.[0]?.message?.content || '生成失败，请重试'
  },

  async _callZhipuImage(prompt) {
    const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/images/generations'
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl)
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ZHIPU_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'cogview-3-flash', prompt })
    })
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || 'AI 图像生成失败') }
    const data = await res.json()
    return data.data?.[0]?.url || ''
  },

  async exportTextToPdf(text, title = 'Generated Content') {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(title, 10, 20)
    doc.setFontSize(12)
    const lines = doc.splitTextToSize(text, 180)
    doc.text(lines, 10, 35)
    doc.save(`${title}.pdf`)
    return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' })
  },

  async exportTextToWord(text, title = 'Generated Content') {
    const doc = new Document({ sections: [{ children: [new Paragraph(title), new Paragraph(''), new Paragraph(text)] }] })
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${title}.docx`; a.click(); URL.revokeObjectURL(url)
    return blob
  },

  async exportImagesToZip(urls) {
    const zip = new JSZip()
    for (let i = 0; i < urls.length; i++) {
      try { const res = await fetch(urls[i]); const blob = await res.blob(); zip.file(`image_${i + 1}.png`, blob) } catch {}
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'images.zip'; a.click(); URL.revokeObjectURL(url)
    return blob
  },

  async getTextHistory() { return this.request('/api/text/history') },
  async getImageHistory() { return this.request('/api/image/history') },
  async getAudioHistory() { return this.request('/api/audio/history') },
  async getVideoHistory() { return this.request('/api/video/history') },
  async createTask(task) { return this.request('/api/tasks', { method: 'POST', body: JSON.stringify(task) }) },
  async getTasks() { return this.request('/api/tasks') },
  async getTask(taskId) { return this.request(`/api/tasks/${taskId}`) },
  async updateTask(taskId, task) { return this.request(`/api/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(task) }) },
  async deleteTask(taskId) { return this.request(`/api/tasks/${taskId}`, { method: 'DELETE' }) },
  async submitSubmission(submission) { return this.request('/api/submissions', { method: 'POST', body: JSON.stringify(submission) }) },
  async getMySubmissions() { return this.request('/api/submissions/my') },
  async getTaskSubmissions(taskId) { return this.request(`/api/tasks/${taskId}/submissions`) },
  async gradeSubmission(submissionId, grade) { return this.request(`/api/submissions/${submissionId}/grade`, { method: 'POST', body: JSON.stringify(grade) }) },
  async updateGrade(submissionId, grade) { return this.request(`/api/submissions/${submissionId}/grade`, { method: 'PUT', body: JSON.stringify(grade) }) },
  async createResource(resource) { return this.request('/api/resources', { method: 'POST', body: JSON.stringify(resource) }) },
  async getResources(category) { return this.request(`/api/resources${category ? '?category=' + category : ''}`) },
  async getResource(resourceId) { return this.request(`/api/resources/${resourceId}`) },
  async deleteResource(resourceId) { return this.request(`/api/resources/${resourceId}`, { method: 'DELETE' }) },
  async getResourceCategories() { return this.request('/api/resources/categories') },
  async getStatisticsOverview() { return this.request('/api/statistics/overview') },
  async getGradeDistribution() { return this.request('/api/statistics/grade-distribution') },
  async getTaskCompletion() { return this.request('/api/statistics/task-completion') },
  async getModuleUsage() { return this.request('/api/statistics/module-usage') },
  async getStudentProgress(studentId) { return { student_id: studentId, completed_tasks: 0, avg_score: 0, trend: 'stable' } },
  async createCreationLog(module, content) { return this.request('/api/creation-logs', { method: 'POST', body: JSON.stringify({ module, content }) }) },
  async getAdminUsers() { return this.request('/api/admin/users') },
  async createAdminUser(userData) { return this.request('/api/admin/users', { method: 'POST', body: JSON.stringify(userData) }) },
  async updateAdminUser(userId, userData) { return this.request(`/api/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(userData) }) },
  async deleteAdminUser(userId) { return this.request(`/api/admin/users/${userId}`, { method: 'DELETE' }) },
  async resetUserPassword(userId) { return this.request(`/api/admin/users/${userId}/reset-password`, { method: 'POST' }) },
  async getSystemConfig() { return this.request('/api/admin/system/config') },
  async updateSystemConfig(configData) { return this.request('/api/admin/system/config', { method: 'PUT', body: JSON.stringify(configData) }) },
  async getAdminLogs() { return this.request('/api/admin/logs') },
  async getPendingContents() { return [] },
  async reviewContent() { return { message: 'ok' } },
  async getAdminStatistics() { return this.request('/api/admin/statistics') }
}

export default API
