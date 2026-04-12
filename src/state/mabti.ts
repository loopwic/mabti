export type AxisKey = 'attack' | 'risk' | 'reading' | 'tempo' | 'team' | 'fortune'

export type AnswerMap = Record<string, number>

export interface AxisDefinition {
  key: AxisKey
  shortLabel: string
  label: string
  description: string
  left: {
    label: string
    letter: string
    color: string
  }
  right: {
    label: string
    letter: string
    color: string
  }
}

export interface Question {
  id: string
  axis: AxisKey
  prompt: string
  caption: string
  tag: string
  direction: 1 | -1
  type?: 'likert' | 'binary' | 'abcd'
  options?: { label: string, text: string, value: number }[]
}

export interface QuestionGroup {
  id: string
  title: string
  subtitle: string
  description: string
  questionIds: string[]
}

export interface ResultVisual {
  accent: string
  secondary: string
  surface: string
  halo: string
  outfit: 'kimono' | 'jacket' | 'cloak'
  prop: 'fan' | 'shield' | 'tile' | 'riichi-stick' | 'score-sheet'
  pose: 'forward' | 'balanced' | 'guarded'
  mood: 'smile' | 'calm' | 'determined'
}

export interface ResultAxisSummary {
  key: AxisKey
  label: string
  percentage: number
  dominantLabel: string
  narrative: string
  color: string
}

export interface RadarItem {
  label: string
  value: number
}

export interface ResultFact {
  label: string
  value: string
}

export interface ResultMetric {
  label: string
  value: string
  helper: string
}

export interface MatchupInfo {
  code: string
  label: string
  reason: string
}

export interface MabtiResult {
  id: string
  seed: string
  typeCode: string
  title: string
  subtitle: string
  roleTag: string
  description: string
  catchphrase: string
  quote: string
  coreStyle: string
  keywords: string[]
  quickFacts: string[]
  strengths: string[]
  pitfalls: string[]
  growthTips: string[]
  metrics: ResultMetric[]
  tableHabits: ResultFact[]
  sceneCards: ResultFact[]
  funTags: string[]
  compatibility: {
    ideal: MatchupInfo
    mirror: MatchupInfo
    chaos: MatchupInfo
  }
  axes: ResultAxisSummary[]
  radar: RadarItem[]
  visual: ResultVisual
  createdAt: string
}

export interface SeedPayload {
  v: 1
  answers: AnswerMap
}

export const axisDefinitions: AxisDefinition[] = [
  {
    key: 'attack',
    shortLabel: '攻守',
    label: 'ATTACK VS DEFENSE',
    description: '你是那种拿到配牌就踩死油门的狂徒，还是冷静评估全场后再出刀的刺客？',
    left: { label: '止损防守 D', letter: 'D', color: '#00e099' },
    right: { label: '极限施压 A', letter: 'A', color: '#ff4d00' },
  },
  {
    key: 'risk',
    shortLabel: '稳赌',
    label: 'STABILITY VS VARIANCE',
    description: '你更信仰长期的数学概率，还是愿意在那 1% 的绝望中押上全部去博取奇迹？',
    left: { label: 'EV 守护者 S', letter: 'S', color: '#4d94ff' },
    right: { label: '赌徒本能 G', letter: 'G', color: '#ffcc00' },
  },
  {
    key: 'reading',
    shortLabel: '读摸',
    label: 'LOGIC VS INSTINCT',
    description: '牌河是你的显微镜，还是说，你指尖的温度已经提前告诉了你下一张牌的颜色？',
    left: { label: '牌河解构 R', letter: 'R', color: '#884dff' },
    right: { label: '狂热直觉 Z', letter: 'Z', color: '#ff4da6' },
  },
  {
    key: 'tempo',
    shortLabel: '速点',
    label: 'SPEED VS IMPACT',
    description: '你是那种快速交卷用闪电战憋死对手的极速快刀，还是蛰伏在暗处组装核弹的重炮手？',
    left: { label: '闪电速攻 F', letter: 'F', color: '#00ccff' },
    right: { label: '重装火力 H', letter: 'H', color: '#ff8800' },
  },
  {
    key: 'team',
    shortLabel: '协狼',
    label: 'SYNC VS SOLO',
    description: '你是掌控整张牌桌呼吸的政治家，还是戴上耳机只走自己剧本的绝对孤狼？',
    left: { label: '全桌指挥 C', letter: 'C', color: '#33cc33' },
    right: { label: '独行暗杀 W', letter: 'W', color: '#6600cc' },
  },
  {
    key: 'fortune',
    shortLabel: '运技',
    label: 'FATE VS SKILL',
    description: '你相信这桌上的胜负掌握在你的微操里，还是坦然承认发牌姬才是唯一的真神？',
    left: { label: '敬畏天命 L', letter: 'L', color: '#ff3333' },
    right: { label: '技术狂热 T', letter: 'T', color: '#3366ff' },
  },
]

export const questions: Question[] = [
  {
    id: 'q1',
    axis: 'attack',
    prompt: '起手哪怕是地狱配牌，我也会下意识寻找一条能让我先制立直的血路。',
    caption: '战争本能',
    tag: '先制渴望',
    direction: 1,
  },
  {
    id: 'q2',
    axis: 'attack',
    prompt: '当别人立直宣告开战，只要我还没听牌，第一时间就是寻找安牌龟缩。',
    caption: '生存第一',
    tag: '避战反射',
    direction: -1,
    type: 'abcd',
    options: [
      { label: 'A', text: '绝对防守：拆掉所有面子，哪怕打乱牌效也只打绝对安牌。', value: 3 },
      { label: 'B', text: '弹性退让：保留一定牌形，打出现有手中相对安全的牌。', value: 1 },
      { label: 'C', text: '伺机反击：只防致命牌，继续推进手牌寻找听牌机会。', value: -1 },
      { label: 'D', text: '无视警告：除非是生张无筋危险牌，否则照常按原定计划切牌。', value: -3 },
    ]
  },
  {
    id: 'q3',
    axis: 'attack',
    prompt: '只要我听牌了，管他立直还是染手，哪怕摸到生张危险牌我也敢毫不犹豫地拍出去对日。',
    caption: '钢铁之躯',
    tag: '对攻烈度',
    direction: 1,
    type: 'binary',
  },
  {
    id: 'q4',
    axis: 'attack',
    prompt: '只要我是 TOP，这局的任何诱惑对我来说都不存在，死死保住顺位就是唯一的真理。',
    caption: '见好就收',
    tag: '领跑收缩',
    direction: -1,
  },
  {
    id: 'q5',
    axis: 'risk',
    prompt: '只要这手牌有做成役满或倍满的浪漫潜质，我愿意把我的顺位和命全押上去。',
    caption: '赌徒狂欢',
    tag: '收益贪婪',
    direction: 1,
    type: 'binary',
  },
  {
    id: 'q6',
    axis: 'risk',
    prompt: '每一次出牌我都会计算期望值(EV)，任何破坏长期胜率的“奇迹打法”都是愚蠢的。',
    caption: '机器理性',
    tag: 'EV 洁癖',
    direction: -1,
  },
  {
    id: 'q7',
    axis: 'risk',
    prompt: '就算吃四已成定局，我也要用最极端的高打点路线去尝试那 1% 的翻盘奇迹。',
    caption: '拒绝平庸',
    tag: '绝境加戏',
    direction: 1,
  },
  {
    id: 'q8',
    axis: 'risk',
    prompt: '逆风局最重要的是冷静，我会像剥洋葱一样，几百点几百点地把分慢慢咬回来。',
    caption: '稳定至上',
    tag: '步步为营',
    direction: -1,
    type: 'abcd',
    options: [
      { label: 'A', text: '绝对认同：只抓稳妥的副露和小牌，靠多次和牌蚕食点数。', value: 3 },
      { label: 'B', text: '部分认同：先用小和回血，等牌姿转好再考虑做大。', value: 1 },
      { label: 'C', text: '稍有抵触：小和不能解渴，我会刻意尝试凑出满贯底子。', value: -1 },
      { label: 'D', text: '完全反对：逆风只能靠一把跳满或役满逆天改命。', value: -3 },
    ]
  },
  {
    id: 'q9',
    axis: 'reading',
    prompt: '牌河就是供我解剖的犯罪现场，每一张弃牌都在为我拼凑出对手的听牌真相。',
    caption: '冰冷推演',
    tag: '牌河解构',
    direction: -1,
  },
  {
    id: 'q10',
    axis: 'reading',
    prompt: '我经常能“听见”下一张牌在呼唤我，这种指尖的直觉往往比牌效计算更准。',
    caption: '灵魂共鸣',
    tag: '神明附体',
    direction: 1,
  },
  {
    id: 'q11',
    axis: 'reading',
    prompt: '我像审讯犯人一样盯着对手的切牌节奏、表情和犹豫，人性比牌面更真实。',
    caption: '心理测写',
    tag: '人性拆解',
    direction: -1,
    type: 'abcd',
    options: [
      { label: 'A', text: '时刻盯梢：切牌的停顿、叹气都是我读牌的绝对核心。', value: 3 },
      { label: 'B', text: '偶尔关注：只在关键巡目或有人立直时观察对手状态。', value: 1 },
      { label: 'C', text: '更看牌面：我不信表情，只相信牌河里打出来的证据。', value: -1 },
      { label: 'D', text: '完全无视：我只关心自己的手牌和牌效，其他人爱怎样怎样。', value: -3 },
    ]
  },
  {
    id: 'q12',
    axis: 'reading',
    prompt: '当感觉自己正处于“无敌状态”时，所有的防守逻辑对我来说都是废纸，闭眼冲就是了。',
    caption: '狂热信徒',
    tag: '状态暴走',
    direction: 1,
    type: 'binary',
  },
  {
    id: 'q13',
    axis: 'tempo',
    prompt: '只要能截断对手的节奏，我不在乎牌型有多难看，哪怕 1000 点我也会光速吃碰和牌。',
    caption: '闪电战术',
    tag: '极限速攻',
    direction: -1,
  },
  {
    id: 'q14',
    axis: 'tempo',
    prompt: '让我和那种廉价的断幺九简直是侮辱，我宁愿多绕几巡，也要亲手打造出毁灭级的重炮。',
    caption: '重火力崇拜',
    tag: '打点暴君',
    direction: 1,
  },
  {
    id: 'q15',
    axis: 'tempo',
    prompt: '在别人还做着大牌美梦的时候，我用一次次光速的小和把他们活活憋死，这让我感到愉悦。',
    caption: '窒息节奏',
    tag: '控速折磨',
    direction: -1,
    type: 'abcd',
    options: [
      { label: 'A', text: '最爱截胡：破坏别人的大牌比我自己和出大牌还要爽。', value: 3 },
      { label: 'B', text: '节奏优先：防守兼备的速攻是最稳妥的战术。', value: 1 },
      { label: 'C', text: '视情况定：如果手牌能做大，我绝不轻易小和。', value: -1 },
      { label: 'D', text: '绝不憋屈：小和就是浪费机会，每一把都要向着高打点冲刺。', value: -3 },
    ]
  },
  {
    id: 'q16',
    axis: 'tempo',
    prompt: '我可以在黑暗中蛰伏一整晚，只为了那一次能把对手瞬间清空的核弹爆击。',
    caption: '一击必杀',
    tag: '终极忍耐',
    direction: 1,
    type: 'binary',
  },
  {
    id: 'q17',
    axis: 'team',
    prompt: '当桌上出现失控的怪物时，我会立刻放下身段，联合其他两家一起把他绞杀在摇篮里。',
    caption: '牌桌政客',
    tag: '联合绞杀',
    direction: -1,
  },
  {
    id: 'q18',
    axis: 'team',
    prompt: '我只低头看着我自己的牌谱，外界的喧闹和别人的企图与我无关，我只走我自己的路。',
    caption: '绝对自我',
    tag: '孤狼独行',
    direction: 1,
    type: 'binary',
  },
  {
    id: 'q19',
    axis: 'team',
    prompt: '我不仅要赢，我还要掌控整张桌子的呼吸，用鸣牌和压迫感把控每一家的节奏。',
    caption: '暴君控盘',
    tag: '动态施压',
    direction: -1,
    type: 'abcd',
    options: [
      { label: 'A', text: '绝对控盘：我是牌桌导演，靠鸣牌和假动作操控所有人的打法。', value: 3 },
      { label: 'B', text: '适当施压：偶尔碰牌造出威慑，逼迫对手放弃进攻。', value: 1 },
      { label: 'C', text: '专注手牌：我不喜欢心理战，把自己的牌效做到极致即可。', value: -1 },
      { label: 'D', text: '透明人：我只想安静地打自己的门清，不想引起任何注意。', value: -3 },
    ]
  },
  {
    id: 'q20',
    axis: 'team',
    prompt: '别跟我谈什么“喂牌避险”，我绝不会为了破坏别人的节奏而牺牲我自己的手牌规划。',
    caption: '路径洁癖',
    tag: '纯粹推进',
    direction: 1,
  },
  {
    id: 'q21',
    axis: 'fortune',
    prompt: '我深知麻将是一场受天命支配的游戏，当发牌姬要搞你的时候，所有技术都是徒劳。',
    caption: '敬畏天命',
    tag: '运势臣服',
    direction: -1,
    type: 'binary',
  },
  {
    id: 'q22',
    axis: 'fortune',
    prompt: '别把放铳怪罪给运气，每一局的失败都可以通过剥丝抽茧的复盘找出我操作上的瑕疵。',
    caption: '绝对微操',
    tag: '技术狂热',
    direction: 1,
  },
  {
    id: 'q23',
    axis: 'fortune',
    prompt: '那种牌桌上连绵不断的“运势”是真实存在的，当我骑上这股势，我就知道今天我赢定了。',
    caption: '乘风破浪',
    tag: '顺势收割',
    direction: -1,
  },
  {
    id: 'q24',
    axis: 'fortune',
    prompt: '运势只是伪科学，真正能在长期对局中保护我的，只有我那肌肉记忆般的牌效计算和防守纪律。',
    caption: '逻辑壁垒',
    tag: '概率信徒',
    direction: 1,
    type: 'abcd',
    options: [
      { label: 'A', text: '绝对理性：运气是不存在的，这只是一场长期的概率游戏。', value: 3 },
      { label: 'B', text: '偏向技术：状态会波动，但扎实的基本功才是保底的武器。', value: 1 },
      { label: 'C', text: '偏向运势：技术只能保证下限，但赢大牌还是要看今天的运流。', value: -1 },
      { label: 'D', text: '玄学至上：风水、方位、状态流才是一切，打错牌不如坐错位。', value: -3 },
    ]
  },
]

export const questionGroups: QuestionGroup[] = [
  {
    id: 'g1',
    title: 'FIRST BLOOD',
    subtitle: '攻守之初',
    description: '坐下的一瞬间，你是选择点燃这桌的火，还是冷眼观察谁先露出破绽？',
    questionIds: ['q1', 'q2', 'q3', 'q4'],
  },
  {
    id: 'g2',
    title: 'THE GAMBLE',
    subtitle: '稳赌博弈',
    description: '深渊面前，你是精密计算的数学家，还是愿意为奇迹押上全部的疯子？',
    questionIds: ['q5', 'q6', 'q7', 'q8'],
  },
  {
    id: 'g3',
    title: 'MIND OR MAGIC',
    subtitle: '逻辑与直觉',
    description: '读牌是为了看透真相，自摸是为了创造真相。你更信哪一个？',
    questionIds: ['q9', 'q10', 'q11', 'q12'],
  },
  {
    id: 'g4',
    title: 'SPEED VS POWER',
    subtitle: '速度与打点',
    description: '追求极致轻巧的匕首，还是追求重型武器的轰鸣？你的牌姿出卖了你。',
    questionIds: ['q13', 'q14', 'q15', 'q16'],
  },
  {
    id: 'g5',
    title: 'THE PREDATOR',
    subtitle: '协调与独行',
    description: '这局是一个人的孤高交响乐，还是四个人的殊死政治博弈？',
    questionIds: ['q17', 'q18', 'q19', 'q20'],
  },
  {
    id: 'g6',
    title: 'FATE OVERWRITTEN',
    subtitle: '天命与微操',
    description: '当满贯揭晓，你把这归结为你的肌肉记忆，还是上天的垂怜？',
    questionIds: ['q21', 'q22', 'q23', 'q24'],
  },
]

export const scaleOptions = [
  { value: -3, label: '强烈偏左', size: 64 },
  { value: -2, label: '明显偏左', size: 54 },
  { value: -1, label: '稍微偏左', size: 44 },
  { value: 0, label: '中立', size: 36 },
  { value: 1, label: '稍微偏右', size: 44 },
  { value: 2, label: '明显偏右', size: 54 },
  { value: 3, label: '强烈偏右', size: 64 },
] as const

export const sampleProfiles: Array<{ label: string; targets: Partial<Record<AxisKey, number>> }> = [
  {
    label: '红棒先声者',
    targets: { attack: 10, risk: 2, reading: 4, tempo: 6, team: -6, fortune: 5 },
  },
  {
    label: '海月捞月者',
    targets: { attack: -6, risk: 8, reading: 10, tempo: 4, team: -4, fortune: -8 },
  },
  {
    label: '点墨算师',
    targets: { attack: 4, risk: -8, reading: -10, tempo: 6, team: 4, fortune: 10 },
  },
]

const STORAGE_KEY = 'mabti-results'
const MAX_AXIS_SCORE = 12


interface PersonaData {
  title: string
  roleTag: string
  catchphrase: string
  quote: string
  opening: string
  strengths: string[]
  pitfalls: string[]
  growthTips: string[]
  tags: string[]
}

const personas: Record<string, PersonaData> = {
  ENFJ: {
    title: '破阵火镰',
    roleTag: '战争发动机',
    catchphrase: '安静的桌子只会让人腐朽，让我来点燃这场绞肉机。',
    quote: '我不只是在宣告听牌，我是在逼迫你们做出痛苦的抉择。',
    opening: '你像第一个把炸药扔进牌桌的人，极具压迫感，擅长用先制立直和气场把全桌拖入你的狂热节奏。',
    strengths: ['起手就能点燃全场', '恐怖的桌控压迫力', '能逼迫对手陷入失误'],
    pitfalls: ['极度容易上头', '把车门焊死后容易自己撞崖'],
    growthTips: ['学会区分“战略压制”和“无脑狂飙”', '给刹车片留一点空间'],
    tags: ['破阵', '高压', '狂热'],
  },
  ENFP: {
    title: '暴走弹头',
    roleTag: '混乱制造者',
    catchphrase: '平庸的胜负有什么意思？我要的是摧毁一切理智的烟火！',
    quote: '当概率论者还在计算 EV 时，我已经把命押给了奇迹。',
    opening: '你是一颗不可预测的暴走弹头，对高打点和名场面有着病态的追求，能在绝境中撕开最疯狂的血路。',
    strengths: ['不讲道理的机会嗅觉', '逆境中的爆破能力', '能用情绪摧毁对手的防线'],
    pitfalls: ['波动大到像过山车', '经常为了追求刺激而葬送好局'],
    growthTips: ['在点燃引信前看一眼剩余点数', '有时候平庸的胜利也是胜利'],
    tags: ['爆破', '戏剧', '贪婪'],
  },
  ENTJ: {
    title: '极权铁壁',
    roleTag: '深渊独裁者',
    catchphrase: '挣扎是没有用的，因为连你的逃跑路线都在我的计算之内。',
    quote: '这不是四个人的博弈，这是我一个人的猎场。',
    opening: '你像一座无法逾越的漆黑要塞，控盘无情，意志如铁。你的每一手牌都在绞杀对手的生存空间。',
    strengths: ['令人窒息的统治力', '极端的执行纪律', '大劣势下也能保持绝对冰冷'],
    pitfalls: ['极度排斥脱离计划的变数', '面对无逻辑的乱打容易僵硬'],
    growthTips: ['给对手留一丝他们自以为的生机', '允许不完美的残局过渡'],
    tags: ['独裁', '压制', '铁血'],
  },
  ENTP: {
    title: '满贯狂徒',
    roleTag: '役满编剧',
    catchphrase: '既然上帝给了我发光的机会，我就绝不接受暗淡的结局。',
    quote: '就算防守能苟活，我也要选择最华丽的死法或最震撼的虐杀。',
    opening: '你是个无可救药的满贯狂徒，对大牌的执念超越了一切。你在牌桌上追求的不是赢，而是艺术品的诞生。',
    strengths: ['击穿天花板的打点爆发', '能在垃圾牌中看出逆天骨架', '对平庸打法极具破坏力'],
    pitfalls: ['为了做大而无视明显的死局', '把高风险美化成“男人的浪漫”'],
    growthTips: ['艺术品需要活下来才能展出', '学会在垃圾时间里当个凡人'],
    tags: ['大牌病', '偏执', '艺术家'],
  },
  ESFJ: {
    title: '闪电斩刀',
    roleTag: '极速清道夫',
    catchphrase: '别做你的大梦了，这局在第三巡就已经结束了。',
    quote: '我不需要名留青史的番数，我只需要一次又一次斩断你们的咽喉。',
    opening: '你是极致的快攻清道夫，用无数轻薄但致命的刀片，活活把做大牌的对手凌迟致死。',
    strengths: ['令人绝望的成型速度', '摧毁他人节奏的专家', '对价值兑现的极致敏感'],
    pitfalls: ['沉迷快攻而错失高价值斩杀', '被重炮锁定后缺乏应对深度'],
    growthTips: ['该拔重剑的时候别再用匕首', '别让副露成为你唯一的肌肉记忆'],
    tags: ['光速', '截胡', '折磨'],
  },
  ESFP: {
    title: '嗜血鬣狗',
    roleTag: '战局掠食者',
    catchphrase: '只要闻到血腥味，我就会死死咬住不放，直到把肉扯下来。',
    quote: '我不信什么牌理，我只知道那张宝牌上写着我的名字。',
    opening: '你是战局里嗅觉最灵敏的掠食者。局势的任何松动和缝隙，都会成为你扑上去撕咬的契机。',
    strengths: ['野兽般的战机嗅觉', '顺风局的极限扩大者', '身段柔软，改道极快'],
    pitfalls: ['闻到血味就不顾一切的追击', '被反向设伏的重灾区'],
    growthTips: ['猎杀前确认那是不是陷阱', '学会放弃那些带刺的腐肉'],
    tags: ['宝牌控', '嗅觉', '追猎'],
  },
  ESTJ: {
    title: '冰冷天平',
    roleTag: '期望值审判官',
    catchphrase: '别拿概率和我讲情怀，在这个桌子上数字就是上帝。',
    quote: '我没有情绪，我只有盈亏比。',
    opening: '你是拿着天平的残酷审判官。你用绝对冰冷的期望值计算，把那些靠感觉打牌的人钉在耻辱柱上。',
    strengths: ['毫无破绽的账本级决策', '长期对局中的不败金身', '剥离一切情绪的机器'],
    pitfalls: ['算得太满而丧失出刀的勇气', '面对疯狗流极其容易内耗'],
    growthTips: ['数学是武器而不是枷锁', '偶尔需要依靠直觉去跃过逻辑的悬崖'],
    tags: ['计算', '机器', '无情'],
  },
  ESTP: {
    title: '沸腾引擎',
    roleTag: '残暴连庄客',
    catchphrase: '别以为这只是一次放铳，这只是地狱开门的声音。',
    quote: '只要我不松开油门，今天这把椅子上就只能听到我的宣告。',
    opening: '你是一台永远沸腾的连庄引擎。在顺风局里，你能把小优势滚成令全场绝望的雪球。',
    strengths: ['摧毁理智的连庄续航', '顺风压制力极高', '越打越疯的体力怪'],
    pitfalls: ['不知道什么是见好就收', '吃瘪后容易不顾一切地对日'],
    growthTips: ['把引擎的冷却系统装回去', '学会接受偶尔被别人拿走的局'],
    tags: ['连庄', '气焰', '贪婪'],
  },
  INFJ: {
    title: '迷雾织网者',
    roleTag: '深空策划师',
    catchphrase: '你们看到的是散落的单骑，我看到的是已经收拢的绞刑架。',
    quote: '真正的杀局，是在敌人毫无察觉时就已经布置完毕的。',
    opening: '你是潜伏在牌局深处的织网者，偏执于牌姿的内在逻辑和长线发育，能在无声无息中完成致命染手。',
    strengths: ['深不见底的战术纵深', '对大牌骨架的极致培育', '静水流深的压迫感'],
    pitfalls: ['路线一旦被砍断就极其痛苦', '有时过于沉迷“完美的死法”'],
    growthTips: ['允许牌谱出现难看的补丁', '杀人不见血，但也别忘了出刀'],
    tags: ['染手', '深远', '编织'],
  },
  INFP: {
    title: '深渊盲注',
    roleTag: '潜流拾荒人',
    catchphrase: '哪怕沉入海底，我也相信那最后一张牌是为我留的。',
    quote: '我不喧哗，我只在你们自相残杀的废墟里拿走属于我的东西。',
    opening: '你像潜伏在深渊的拾荒人，不喜欢正面硬刚，但对残局和河底的微光有着近乎迷信的偏执。',
    strengths: ['令人毛骨悚然的潜伏能力', '借力打力的边缘猎杀', '绝境中惊人的直觉'],
    pitfalls: ['过度迷信“命运的眷顾”', '前期过分退让导致无分可收'],
    growthTips: ['命运不会每次都在海底等你', '把主动权抢回自己手里'],
    tags: ['海底捞月', '潜行', '灵异'],
  },
  INTJ: {
    title: '绝对领域',
    roleTag: '门清审判长',
    catchphrase: '暴露自己的底牌是弱者的行为，我更喜欢让你们猜。',
    quote: '当我在暗处宣告听牌，你们就只剩下祈祷了。',
    opening: '你是极度洁癖的门清捍卫者。把手牌深藏在黑暗中，用完美的系统和逻辑一步步逼死对手。',
    strengths: ['毫无破绽的防守威慑', '深不见底的牌路体系', '极高的打点威慑力'],
    pitfalls: ['为了门清而错失一击必杀的时机', '过于僵硬的体系化思维'],
    growthTips: ['放下傲慢，副露也是一种兵器', '别让洁癖成为你的软肋'],
    tags: ['门清', '深邃', '洁癖'],
  },
  INTP: {
    title: '终焉剪影',
    roleTag: '残局终结者',
    catchphrase: '前半局随你们怎么闹，最后怎么收场，规矩由我定。',
    quote: '我不创造高光，我只负责关上你们的棺材板。',
    opening: '你对局面的收束有着极度冷酷的敏感。当残局到来，你会像死神一样精准地剪断所有的变数。',
    strengths: ['残局处理的绝对专家', '极度冷静的止损切割', '善于利用规则而非运气'],
    pitfalls: ['中盘缺乏进攻的压迫感', '容易为了追求最稳而错失更大收益'],
    growthTips: ['把你的死神镰刀提前一巡拔出来', '允许局势多保留一点不确定性'],
    tags: ['残局', '收割', '冷酷'],
  },
  ISFJ: {
    title: '逆推之眼',
    roleTag: '牌河解剖师',
    catchphrase: '你切下的每一张牌，都在为你的死刑判决书签字。',
    quote: '别想骗我，死人是不会说谎的，牌河也一样。',
    opening: '你长着一双恐怖的逆推之眼，把全桌的牌河当作证据的海洋，能在对手听牌前就看穿他的底裤。',
    strengths: ['骇人的情报读取能力', '防守端的先知先觉', '极少盲目踩雷'],
    pitfalls: ['容易被故意做的伪装骗入深渊', '搜集证据太久导致错失反击窗口'],
    growthTips: ['证据有七成的时候就可以开火了', '不要因为害怕犯错而放弃主导权'],
    tags: ['读局', '解剖', '先知'],
  },
  ISFP: {
    title: '铁棘乌龟',
    roleTag: '后门捍卫者',
    catchphrase: '随便你们怎么狂轰滥炸，能活着站到最后的才是赢家。',
    quote: '我不仅留了退路，我还顺便在退路上埋了地雷。',
    opening: '你是把安牌当成信仰的后门捍卫者。无论局势多顺，你永远为自己留着一块无法击穿的铁盾。',
    strengths: ['令人绝望的防守韧性', '极高的容错率', '在夹缝中生存的宗师'],
    pitfalls: ['把盾牌举得太高而忘了拔剑', '经常因为胆怯而让出版图'],
    growthTips: ['有时候最好的防守就是把他们全杀了', '识别出不需要留退路的绝对优势局'],
    tags: ['死守', '安牌', '铁幕'],
  },
  ISTJ: {
    title: '叹息之墙',
    roleTag: '绝对防御阵',
    catchphrase: '你们的进攻打在我身上，只会变成毫无意义的叹息。',
    quote: '只要不放铳，这局我就还没有输。',
    opening: '你是一面冰冷沉重的叹息之墙，止损理解极深，能在对手最猛烈的火力下找到最安全的缝隙。',
    strengths: ['磐石般的兜底防守', '果断的壮士断腕', '能把毁灭性的崩盘化为小擦伤'],
    pitfalls: ['第一反应总是逃避而非反杀', '容易陷入被全场按着打的憋屈局面'],
    growthTips: ['防守只能不输，赢需要你露出獠牙', '偶尔也用肉身去扛一次子弹'],
    tags: ['筋壁', '铜墙', '止损'],
  },
  ISTP: {
    title: '巡目绞肉机',
    roleTag: '冷血节拍器',
    catchphrase: '还剩几巡？还差几张？数字倒数完毕的时候，就是你的死期。',
    quote: '我没有情绪，我只有极其冰冷的倒计时。',
    opening: '你是一台紧贴着桌面的冷血节拍器，对向听数和巡目的敏感达到了机械的程度，擅长把乱局拖入你的精密节奏。',
    strengths: ['机器般的节奏校准能力', '对剩余价值的极限压榨', '逆境中极其可怕的韧性'],
    pitfalls: ['一旦节奏被彻底粉碎就容易死机', '对不讲道理的暴力流缺乏想象力应对'],
    growthTips: ['允许你的齿轮偶尔卡顿一次', '学习在没有节奏的混乱中挥刀'],
    tags: ['向听', '机械', '精准'],
  },
}

function getPersonaKey(typeCode: string) {
  const energy = typeCode[0] === 'A' ? 'E' : 'I'
  const focus = typeCode[2] === 'Z' ? 'N' : 'S'
  const tableStyle = typeCode[4] === 'C' ? 'F' : 'T'
  const discipline = typeCode[1] === 'S' ? 'J' : 'P'
  return `${energy}${focus}${tableStyle}${discipline}`
}

export function createBlankAnswers(): AnswerMap {
  return questions.reduce<AnswerMap>((res, q) => { res[q.id] = 0; return res }, {})
}

export function buildSampleAnswers(targets: Partial<Record<AxisKey, number>>): AnswerMap {
  const answers = createBlankAnswers()
  for (const axis of axisDefinitions) {
    const qList = questions.filter(q => q.axis === axis.key)
    const target = targets[axis.key] ?? 0
    const base = Math.trunc(target / qList.length)
    let rem = target - base * qList.length
    qList.forEach(q => {
      let val = base
      if (rem !== 0) { val += rem > 0 ? 1 : -1; rem += rem > 0 ? -1 : 1 }
      answers[q.id] = Math.max(-3, Math.min(3, q.direction === 1 ? val : -val))
    })
  }
  return answers
}

export function answersToResult(answers: AnswerMap, persistable = true): MabtiResult {
  const scores = axisDefinitions.reduce((res, axis) => {
    res[axis.key] = questions.filter(q => q.axis === axis.key)
      .reduce((sum, q) => sum + (answers[q.id] ?? 0) * q.direction, 0)
    return res
  }, {} as Record<AxisKey, number>)

  const typeCode = axisDefinitions.map(axis => scores[axis.key] >= 0 ? axis.right.letter : axis.left.letter).join('')
  const seed = encodeAnswersToSeed(answers)
  const persona = personas[getPersonaKey(typeCode)]

  return {
    id: persistable ? `mabti-${Math.random().toString(36).slice(2, 10)}` : `seed-${seed.slice(0, 12)}`,
    seed,
    typeCode,
    title: persona.title,
    subtitle: persona.roleTag,
    roleTag: persona.roleTag,
    description: persona.opening,
    catchphrase: persona.catchphrase,
    quote: persona.quote,
    coreStyle: persona.tags.join(' / '),
    keywords: persona.tags,
    quickFacts: [persona.title, persona.roleTag],
    strengths: persona.strengths,
    pitfalls: persona.pitfalls,
    growthTips: persona.growthTips,
    metrics: axisDefinitions.map(axis => ({
      label: axis.shortLabel,
      value: `${Math.round(((scores[axis.key] + 12) / 24) * 100)}%`,
      helper: axis.description
    })),
    tableHabits: [],
    sceneCards: [],
    funTags: persona.tags,
    compatibility: {
      ideal: { code: 'XXXX', label: 'TBD', reason: 'TBD' },
      mirror: { code: 'XXXX', label: 'TBD', reason: 'TBD' },
      chaos: { code: 'XXXX', label: 'TBD', reason: 'TBD' }
    },
    axes: axisDefinitions.map(axis => ({
      key: axis.key,
      label: axis.label,
      percentage: Math.round(((scores[axis.key] + 12) / 24) * 100),
      dominantLabel: scores[axis.key] >= 0 ? axis.right.label : axis.left.label,
      narrative: '',
      color: scores[axis.key] >= 0 ? axis.right.color : axis.left.color
    })),
    radar: axisDefinitions.map(axis => ({
      label: axis.shortLabel,
      value: Math.round(((scores[axis.key] + 12) / 24) * 100)
    })),
    visual: {
      accent: scores.attack >= 0 ? '#ff4d00' : '#00e099',
      secondary: '#884dff',
      surface: '#fff',
      halo: '#ffcc00',
      outfit: 'kimono',
      prop: 'tile',
      pose: 'forward',
      mood: 'calm'
    },
    createdAt: new Date().toISOString()
  }
}

export function buildSampleResults() {
  return sampleProfiles.map(p => answersToResult(buildSampleAnswers(p.targets), false))
}

export function encodeAnswersToSeed(answers: AnswerMap) {
  return btoa(JSON.stringify({ v: 1, answers })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function decodeSeedToAnswers(seed: string): AnswerMap | null {
  try {
    const payload = JSON.parse(atob(seed.replace(/-/g, '+').replace(/_/g, '/')))
    return payload.answers
  } catch { return null }
}

export function resultFromSeed(seed: string) {
  const ans = decodeSeedToAnswers(seed)
  return ans ? answersToResult(ans, false) : null
}

export function persistResult(res: MabtiResult) {
  if (typeof window === 'undefined') return
  const current = getStoredResults()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([res, ...current].slice(0, 10)))
}

export function getStoredResults(): MabtiResult[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function getLatestStoredResult() {
  return getStoredResults()[0] ?? null
}
