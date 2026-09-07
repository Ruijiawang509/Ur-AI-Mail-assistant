export type BoardType = 'priority_content' | 'within_48h' | 'todo' | 'ignore'
export type PriorityLevel = 'high' | 'medium' | 'low' | 'ignore'
export type FeedbackAction = 'more_important' | 'show_less'
export type ItemStatus = 'pending' | 'done'

export type PanelMeta = {
  assistantName: string
  lastSyncedText: string
  lastSyncedAt?: string
}

export type OverviewCounts = {
  priorityContentCount: number
  within48hCount: number
  todoCount: number
  ignoreCount: number
}

export type MailListItem = {
  messageId: string
  threadId: string
  senderName: string
  senderEmail?: string
  subject: string
  shortSummary: string
  actionRequired: boolean
  actionLabel?: string
  deadlineText?: string
  deadlineTs?: string | null
  boardType: BoardType
  boardReasonText: string
  priorityLevel: PriorityLevel
  priorityScore: number
  reasonTags: string[]
  itemStatus: ItemStatus
  receivedAt: string
  aggregationKey?: string
  aggregationLabel?: string
}

export type ExpandedPanelData = {
  meta: PanelMeta
  overview: OverviewCounts
  activeBoard: BoardType
  boards: Record<BoardType, MailListItem[]>
}

export type MailInsightDetail = {
  messageId: string
  threadId: string
  senderName: string
  senderEmail?: string
  subject: string
  category?: string
  boardType: BoardType
  boardReasonText: string
  priorityLevel: PriorityLevel
  priorityScore: number
  focusText: string
  suggestedAction?: string
  deadlineDisplay?: string
  reasonBullets: string[]
}

export type MailRecord = MailListItem & {
  category?: string
  focusAreas: string[]
  focusText: string
  suggestedAction?: string
  deadlineDisplay?: string
  reasonBullets: string[]
  previewLines: string[]
  bodyParagraphs: string[]
}

export type SenderOption = {
  value: string
  label: string
  count: number
}

export type HistoryEntry = {
  senderName: string
  count: number
}

export type FeedbackMap = Record<string, FeedbackAction>

export const BOARD_LABELS: Record<BoardType, string> = {
  priority_content: '优先内容',
  within_48h: '48h',
  todo: '待处理',
  ignore: '可忽略',
}

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
  ignore: '可忽略级',
}
