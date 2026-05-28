import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph } from 'docx'
import JSZip from 'jszip'

const ZHIPU_API_KEY = 'd1354054dcb045c19df3dcd50c2f4827.C0osK2v5qXYiEOI1'
const DASHSCOPE_API_KEY = 'sk-f32611a38b47427cb06458ceac30ae39'

function localGet(key) {
  try { return JSON.parse(localStorage.getItem('aigc_' + key) || 'null') } catch { return null }
}
function localSet(key, val) { localStorage.setItem('aigc_' + key, JSON.stringify(val)) }
function simpleHash(password) {
  let hash = 0; for (let i = 0; i < password.length; i++) { hash = ((hash << 5) - hash) + password.charCodeAt(i); hash |= 0 }
  return hash.toString(16)
}
function getDefaultTasks() {
  const now = new Date()
  const d = (days) => new Date(now.getTime() + days * 86400000).toISOString()
  return [
    { id: 1, title: 'AI文本生成：撰写一篇关于人工智能伦理的议论文', description: '利用AI大语言模型，撰写一篇不少于800字的议论文，探讨人工智能技术在现代社会中的伦理问题，包括但不限于：隐私保护、算法偏见、就业替代、自主决策等。', type: 'text', requirements: '1. 使用平台AI文本生成工具完成文章撰写\n2. 文章字数不少于800字\n3. 需包含至少3个具体案例或论据\n4. 结构清晰：引言-论点展开-结论\n5. 提交时附上你使用的Prompt提示词', deadline: d(14), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 2, title: 'AI图像生成：设计一个未来智慧城市概念场景', description: '使用AI图像生成工具，设计并生成一张展现2050年未来智慧城市的概念插画。场景应包含智能交通、绿色建筑、空中花园等元素。', type: 'image', requirements: '1. 使用平台AI图像生成工具\n2. 图像分辨率不低于1024x1024\n3. 画面需包含至少3个未来科技元素\n4. 风格统一，色彩协调\n5. 提交时附上完整的Prompt提示词和生成参数', deadline: d(10), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 3, title: 'AI文本生成：为新产品撰写营销文案', description: '假设你是一家科技创业公司的营销人员，使用AI文本生成工具为一款面向大学生的智能学习助手APP撰写一套完整的营销文案，包括产品介绍、核心卖点、使用场景等。', type: 'text', requirements: '1. 文案包含：产品Slogan（1句）、产品简介（200字内）、核心卖点（3-5个）、使用场景描述（至少2个）\n2. 语言风格年轻化，贴近大学生群体\n3. 使用AI生成后需进行人工优化润色\n4. 提交原文Prompt和最终优化后的文案', deadline: d(7), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 4, title: 'AI图像生成：创作中国传统节日主题插画', description: '使用AI图像生成工具，创作一幅以中国传统节日（春节、端午节、中秋节任选其一）为主题的插画作品。要求融合传统元素与现代设计风格。', type: 'image', requirements: '1. 选择一个中国传统节日作为主题\n2. 需包含该节日的代表性元素（如灯笼、龙舟、月饼等）\n3. 风格要求：新中式/国潮风格\n4. 提交至少2张不同Prompt的生成结果进行对比\n5. 附上Prompt和创作说明', deadline: d(12), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 5, title: 'AI音频生成：制作一段产品宣传语音', description: '使用AI语音合成工具，为一家虚构的咖啡品牌制作一段30-60秒的产品宣传语音广告。要求语音自然流畅，富有感染力。', type: 'audio', requirements: '1. 先使用AI文本工具撰写广告脚本\n2. 使用平台AI语音生成工具合成语音\n3. 时长控制在30-60秒之间\n4. 语音内容需包含品牌名称、产品特色、促销信息\n5. 提交广告脚本和生成的音频文件', deadline: d(10), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 6, title: 'AI文本生成：编写一个Python数据分析教学案例', description: '使用AI文本生成工具，编写一份完整的Python数据分析教学案例，主题为"某电商平台用户行为分析"。案例应包含数据说明、分析步骤、代码示例和结论。', type: 'text', requirements: '1. 使用Markdown格式撰写\n2. 包含完整的Python代码示例（使用pandas/matplotlib）\n3. 案例结构：背景介绍→数据说明→分析步骤→可视化→结论\n4. 代码需可直接运行\n5. 提交Prompt和完整案例文档', deadline: d(14), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 7, title: 'AI图像生成：设计一套APP图标方案', description: '使用AI图像生成工具，为一款健康管理类APP设计3套不同风格的图标方案。每套方案需包含App主图标和应用内主要功能图标（运动、饮食、睡眠）。', type: 'image', requirements: '1. 设计3套不同风格的图标方案（如：扁平化、拟物化、渐变风）\n2. 每套至少4个图标（1个主图标+3个功能图标）\n3. 同一套内风格保持统一\n4. 图标辨识度高，符合健康管理主题\n5. 提交所有Prompt和设计说明文档', deadline: d(14), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 8, title: 'AI音频生成：创作一段古诗朗诵音频', description: '使用AI语音合成工具，选择一首唐宋诗词，生成一段富有感情的朗诵音频。要求语速适当、抑扬顿挫，符合诗词意境。', type: 'audio', requirements: '1. 选择的诗词不少于8句\n2. 先撰写朗诵脚本（标注停顿、重音、语速变化）\n3. 使用AI语音工具生成朗诵音频\n4. 选择合适的音色（男声/女声需符合诗词风格）\n5. 提交诗词原文、朗诵脚本和音频文件', deadline: d(10), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 9, title: 'AI视频生成：制作一段AI技术科普短视频脚本', description: '使用AI文本生成工具，编写一段1-2分钟的短视频脚本，主题为"什么是大语言模型"。脚本需包含画面描述、旁白台词、字幕建议等内容。', type: 'video', requirements: '1. 脚本格式：分镜脚本（画面+旁白+字幕+时长）\n2. 总时长控制在1-2分钟\n3. 内容准确，用通俗易懂的语言解释技术概念\n4. 包含至少1个生动的比喻或类比\n5. 提交Prompt和完整脚本文档', deadline: d(12), creator_id: 2, created_at: now.toISOString(), is_active: true },
    { id: 10, title: 'AI视频生成：设计一段产品开箱短视频分镜', description: '为一款智能手表设计一段30秒的开箱短视频分镜脚本。使用AI工具辅助创意构思和脚本撰写，体现产品的科技感和时尚感。', type: 'video', requirements: '1. 分镜脚本格式，标注每个镜头的时长、画面内容、运镜方式\n2. 总时长30秒\n3. 至少设计6个分镜\n4. 体现产品核心卖点（健康监测、消息通知、运动追踪等）\n5. 提交Prompt和完整分镜脚本', deadline: d(7), creator_id: 2, created_at: now.toISOString(), is_active: true }
  ]
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
  localSet('content_reviews', [])
  localSet('system_config', { site_name: 'AIGC 实训平台', site_description: '探索 AI 创作的无限可能', max_daily_generations: 50, allow_registration: true, require_content_review: true, api_key_status: { zhipu: true } })
}
initDefaultUsers()
// 如果任务表为空或缺少默认题目，自动填充（使用版本标记防止重复）
const TASK_SEED_VERSION = 2
const seededVersion = localGet('task_seed_version')
if (!seededVersion || seededVersion < TASK_SEED_VERSION) {
  const existing = localGet('tasks') || []
  // 移除旧版本种子任务（id 1-10），保留用户新建的任务
  const userTasks = existing.filter(t => t.id > 10)
  const defaultTasks = getDefaultTasks()
  localSet('tasks', [...defaultTasks, ...userTasks])
  localSet('task_seed_version', TASK_SEED_VERSION)
}
// 将历史生成记录迁移到内容审核表（只执行一次）
const CONTENT_REVIEW_MIGRATED = localGet('content_review_migrated')
if (!CONTENT_REVIEW_MIGRATED) {
  const reviews = localGet('content_reviews') || []
  const users = localGet('users') || {}
  const uidToName = (uid) => {
    const u = Object.values(users).find(u => u.id === uid)
    return u ? (u.full_name || u.username) : 'unknown'
  }
  const textH = localGet('text_history') || []
  textH.forEach(h => reviews.unshift({ id: h.id + 0.1, type: 'text', user_id: h.user_id, username: uidToName(h.user_id), prompt: h.prompt, content: (h.content || '').substring(0, 500), status: 'approved', created_at: h.created_at, reviewed_at: h.created_at, review_reason: '历史数据自动通过' }))
  const imageH = localGet('image_history') || []
  imageH.forEach(h => reviews.unshift({ id: h.id + 0.2, type: 'image', user_id: h.user_id, username: uidToName(h.user_id), prompt: h.prompt, content: h.image_url || '', status: 'approved', created_at: h.created_at, reviewed_at: h.created_at, review_reason: '历史数据自动通过' }))
  const audioH = localGet('audio_history') || []
  audioH.forEach(h => reviews.unshift({ id: h.id + 0.3, type: 'audio', user_id: h.user_id, username: uidToName(h.user_id), prompt: h.text || '', content: '', status: 'approved', created_at: h.created_at, reviewed_at: h.created_at, review_reason: '历史数据自动通过' }))
  const videoH = localGet('video_history') || []
  videoH.forEach(h => reviews.unshift({ id: h.id + 0.4, type: 'video', user_id: h.user_id, username: uidToName(h.user_id), prompt: h.prompt || '', content: '', status: 'approved', created_at: h.created_at, reviewed_at: h.created_at, review_reason: '历史数据自动通过' }))
  localSet('content_reviews', reviews.slice(0, 500))
  localSet('content_review_migrated', true)
}

const API = {
  getToken() { return localStorage.getItem('token') },
  setToken(token) { localStorage.setItem('token', token) },
  removeToken() { localStorage.removeItem('token') },

  _addContentReview(type, user, prompt, content) {
    const reviews = localGet('content_reviews') || []
    reviews.unshift({
      id: Date.now() + Math.random(),
      type,
      user_id: user?.id || null,
      username: user?.username || 'unknown',
      prompt,
      content,
      status: 'pending',
      created_at: new Date().toISOString(),
      reviewed_at: null,
      review_reason: ''
    })
    localSet('content_reviews', reviews.slice(0, 500))
  },

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
    const path = url.replace(/^\//, '').split('?')[0]
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
      this._addContentReview('text', user, body.prompt, result.substring(0, 500))
      return { content: result, generated_at: new Date().toISOString() }
    }
    if (path === 'api/image/generate' && method === 'POST') {
      const result = await this._callZhipuImage(body.prompt)
      const history = localGet('image_history') || []
      history.unshift({ id: Date.now(), prompt: body.prompt, image_url: result, created_at: new Date().toISOString(), user_id: user?.id })
      localSet('image_history', history.slice(0, 100))
      this._addContentReview('image', user, body.prompt, result)
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
      const subs = (localGet('submissions') || []).filter(s => s.task_id === taskId)
      const users = localGet('users') || {}
      subs.forEach(s => {
        const user = Object.values(users).find(u => u.id === s.student_id)
        if (user) s.student_name = user.full_name || user.username
        if (!s.status) s.status = 'submitted'
      })
      return subs
    }
    if (path === 'api/submissions') {
      if (method === 'POST') { const subs = localGet('submissions') || []; const now = new Date().toISOString(); subs.push({ ...body, id: Date.now(), created_at: now, submitted_at: now, status: 'submitted', student_id: user?.id }); localSet('submissions', subs); return subs[subs.length - 1] }
    }
    if (path === 'api/submissions/my') {
      const subs = (localGet('submissions') || []).filter(s => s.student_id === user?.id)
      subs.forEach(s => { if (!s.status) s.status = 'submitted' })
      return subs
    }
    if (path.match(/^api\/submissions\/\d+\/grade$/)) {
      const sid = parseInt(path.split('/')[2])
      const subs = localGet('submissions') || []
      const i = subs.findIndex(s => s.id === sid)
      if (i >= 0) { subs[i] = { ...subs[i], status: 'completed', score: body.grade || body.score, comment: body.feedback || body.comment, graded_at: new Date().toISOString() }; localSet('submissions', subs); return subs[i] }
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
      const params = new URLSearchParams(url.split('?')[1] || '')
      const searchRole = params.get('role')
      const search = (params.get('search') || '').toLowerCase()
      const skip = parseInt(params.get('skip') || '0')
      const limit = parseInt(params.get('limit') || '100')
      if (method === 'GET') {
        let users = Object.values(localGet('users') || {})
        if (searchRole) users = users.filter(u => u.role === searchRole)
        if (search) users = users.filter(u => (u.username || '').toLowerCase().includes(search) || (u.full_name || '').toLowerCase().includes(search))
        return users.slice(skip, skip + limit)
      }
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
    if (path === 'api/admin/contents/pending') {
      let reviews = localGet('content_reviews') || []
      const statusFilter = new URLSearchParams(url.split('?')[1] || '').get('status')
      if (statusFilter) reviews = reviews.filter(r => r.status === statusFilter)
      const users = localGet('users') || {}
      reviews.forEach(r => {
        if (r.user_id && !r.username) {
          const u = Object.values(users).find(u => u.id === r.user_id)
          if (u) r.username = u.full_name || u.username
        }
      })
      return reviews.slice(0, 100)
    }
    if (path.match(/^api\/admin\/contents\/[\d.]+\/review$/)) {
      const id = parseFloat(path.split('/')[3])
      const reviews = localGet('content_reviews') || []
      const idx = reviews.findIndex(r => r.id === id)
      if (idx >= 0) {
        reviews[idx].status = body.approved ? 'approved' : 'rejected'
        reviews[idx].reviewed_at = new Date().toISOString()
        reviews[idx].review_reason = body.reason || ''
        localSet('content_reviews', reviews)
        const logs = localGet('admin_logs') || []
        logs.push({ id: Date.now(), user_id: user?.id, action: 'review_content', details: `${body.approved ? '通过' : '拒绝'}内容审核 #${Math.floor(id)}`, created_at: new Date().toISOString() })
        localSet('admin_logs', logs.slice(-200))
        return { message: body.approved ? '内容已通过审核' : '内容已拒绝' }
      }
      throw new Error('内容不存在')
    }
    if (path === 'api/admin/contents/stats') {
      const reviews = localGet('content_reviews') || []
      return {
        total: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length
      }
    }
    if (path === 'api/admin/statistics') {
      const users = localGet('users') || {}
      const reviews = localGet('content_reviews') || []
      return { total_users: Object.values(users).length, total_creations: (localGet('text_history') || []).length + (localGet('image_history') || []).length + (localGet('audio_history') || []).length + (localGet('video_history') || []).length, total_contents: reviews.length, pending_reviews: reviews.filter(r => r.status === 'pending').length, total_tasks: (localGet('tasks') || []).length, total_submissions: (localGet('submissions') || []).length }
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

  // === DashScope 视频生成（魔塔社区 Wan 模型） ===
  async _dashscopeFetch(url, options = {}) {
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url)
    const headers = { 'Authorization': `Bearer ${DASHSCOPE_API_KEY}` }
    if (options.method && options.method !== 'GET') {
      headers['Content-Type'] = 'application/json'
    }
    Object.assign(headers, options.headers || {})
    const res = await fetch(proxyUrl, { ...options, headers })
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.output?.message || err.message || `DashScope 请求失败 (${res.status})`) }
    return res.json()
  },

  async submitVideoTask(promptText, params = {}) {
    const styleMap = { 'realistic': '写实风格，真实感强，', 'cartoon': '卡通动画风格，色彩鲜艳，', 'sci-fi': '科幻风格，未来感，', 'painting': '油画风格，艺术感，' }
    const enhancedPrompt = (styleMap[params.style] || '') + promptText
    const duration = Math.min(15, Math.max(2, parseInt(params.duration) || 5))
    const resolution = (params.resolution || '720p').toUpperCase()
    const data = await this._dashscopeFetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis',
      { method: 'POST', headers: { 'X-DashScope-Async': 'enable' }, body: JSON.stringify({ model: 'wan2.1-t2v-plus', input: { prompt: enhancedPrompt }, parameters: { duration, resolution, ratio: params.ratio || '16:9' } }) }
    )
    const taskId = data.output?.task_id
    if (taskId) return { taskId }
    throw new Error(data.message || data.output?.message || '提交视频生成任务失败')
  },

  async queryVideoTask(taskId) {
    const data = await this._dashscopeFetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, { method: 'GET' })
    return { status: data.output?.task_status || 'UNKNOWN', videoUrl: data.output?.video_url || '', message: data.output?.message || '' }
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
