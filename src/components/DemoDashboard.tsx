import { useState } from 'react'
import { AssistantPanel } from './AssistantPanel'
import {
  buildPanelData,
  getFrequentSenderOptions,
  getMailDetail,
  getMailRecord,
  getSenderHistoryEntries,
  initialStatusMap,
} from '../data/mockData'
import type { BoardType, FeedbackAction, FeedbackMap, ItemStatus } from '../types'

const DEFAULT_BOARD: BoardType = 'priority_content'
const CUSTOM_SENDER = '__custom_sender__'
const FOCUS_OPTIONS = ['学业', '招聘', '工作', '财务']

type DemoDashboardProps = {
  onBackToLanding: () => void
}

export function DemoDashboard({ onBackToLanding }: DemoDashboardProps) {
  const [activeBoard, setActiveBoard] = useState<BoardType>(DEFAULT_BOARD)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [statusMap, setStatusMap] = useState<Record<string, ItemStatus>>({ ...initialStatusMap })
  const [feedbackMap, setFeedbackMap] = useState<FeedbackMap>({})
  const [notice, setNotice] = useState('')
  const [senderClickCounts, setSenderClickCounts] = useState<Record<string, number>>({})
  const [selectedSenders, setSelectedSenders] = useState<string[]>(['Amazon Recruiter'])
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>(['招聘', '工作'])
  const [customSender, setCustomSender] = useState('')
  const [customFocus, setCustomFocus] = useState('')
  const [customSenderEntries, setCustomSenderEntries] = useState<string[]>([])

  const panelData = buildPanelData(statusMap, activeBoard, feedbackMap)
  const selectedDetail = selectedMessageId
    ? getMailDetail(selectedMessageId, statusMap, feedbackMap)
    : undefined
  const senderOptions = getFrequentSenderOptions(senderClickCounts)
  const senderHistory = getSenderHistoryEntries(senderClickCounts)
  const feedbackCount = Object.keys(feedbackMap).length

  const describeMail = (messageId: string) =>
    getMailRecord(messageId, statusMap, feedbackMap)?.subject ?? messageId

  const toggleSelection = (
    value: string,
    currentValues: string[],
    update: (values: string[]) => void,
  ) => {
    update(
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    )
    setNotice('偏好已更新。真实版本会在重新分析后影响个性化排序。')
  }

  const handleOpenMail = (messageId: string) => {
    const record = getMailRecord(messageId, statusMap, feedbackMap)
    if (record) {
      setSenderClickCounts((current) => ({
        ...current,
        [record.senderName]: (current[record.senderName] ?? 0) + 1,
      }))
    }
    setSelectedMessageId(messageId)
    setNotice('')
  }

  const handleBoardChange = (board: BoardType) => {
    setActiveBoard(board)
    setSelectedMessageId(null)
  }

  const handleMarkDone = (messageId: string) => {
    setStatusMap((current) => ({ ...current, [messageId]: 'done' }))
    setSelectedMessageId(null)
    setNotice(`已将“${describeMail(messageId)}”标记为已处理。`)
  }

  const handleFeedback = (messageId: string, action: FeedbackAction) => {
    setFeedbackMap((current) => ({ ...current, [messageId]: action }))
    setNotice(
      action === 'more_important'
        ? `已提高“${describeMail(messageId)}”的 Demo 优先级分数；所属板块保持不变。`
        : `已降低“${describeMail(messageId)}”的 Demo 优先级分数；所属板块保持不变。`,
    )
  }

  const handleAddCustomSender = () => {
    const value = customSender.trim()
    if (!value) return

    setCustomSenderEntries((current) => current.includes(value) ? current : [...current, value])
    setSelectedSenders((current) => [
      ...current.filter((item) => item !== CUSTOM_SENDER && item !== value),
      value,
    ])
    setCustomSender('')
    setNotice('自定义重点寄件人已加入本次 Demo。')
  }

  const handleResetDemo = () => {
    setActiveBoard(DEFAULT_BOARD)
    setSelectedMessageId(null)
    setStatusMap({ ...initialStatusMap })
    setFeedbackMap({})
    setNotice('Demo 已重置。')
    setSenderClickCounts({})
    setSelectedSenders(['Amazon Recruiter'])
    setSelectedFocuses(['招聘', '工作'])
    setCustomSender('')
    setCustomFocus('')
    setCustomSenderEntries([])
  }

  return (
    <div className="demo-page">
      <header className="demo-header">
        <button className="brand brand-button" type="button" onClick={onBackToLanding}>
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Mail Assistant</span>
        </button>
        <div className="demo-header-actions">
          <span className="demo-mode"><i />Demo mode · Mock data</span>
          <button className="ghost-button" type="button" onClick={handleResetDemo}>重置 Demo</button>
          <button className="outline-button" type="button" onClick={onBackToLanding}>返回首页</button>
        </div>
      </header>

      <main className="demo-main">
        <div className="demo-intro">
          <div>
            <p className="eyebrow">Interactive workspace</p>
            <h1>你的 AI 邮件工作台</h1>
            <p>切换 Board、查看 AI 解读，再用反馈调整 Priority。全部交互仅存在于当前页面。</p>
          </div>
          <div className="demo-session-stats">
            <span><strong>{feedbackCount}</strong> 条本地反馈</span>
            <span><strong>{Object.values(statusMap).filter((status) => status === 'done').length}</strong> 封已处理</span>
          </div>
        </div>

        {notice ? <div className="notice-banner" role="status"><span>✓</span>{notice}</div> : null}

        <section className="dashboard-shell">
          <AssistantPanel
            panelData={panelData}
            detail={selectedDetail}
            feedbackMap={feedbackMap}
            commonSenderOptions={senderOptions}
            customSenderEntries={customSenderEntries}
            selectedSenders={selectedSenders}
            customSenderValue={customSender}
            senderHistory={senderHistory}
            selectedFocuses={selectedFocuses}
            customFocusValue={customFocus}
            focusOptions={FOCUS_OPTIONS}
            onBackToList={() => setSelectedMessageId(null)}
            onBoardChange={handleBoardChange}
            onOpenMail={handleOpenMail}
            onMarkDone={handleMarkDone}
            onToggleSender={(sender) => toggleSelection(sender, selectedSenders, setSelectedSenders)}
            onCustomSenderChange={setCustomSender}
            onAddCustomSender={handleAddCustomSender}
            onRemoveCustomSender={(value) => {
              setCustomSenderEntries((current) => current.filter((entry) => entry !== value))
              setSelectedSenders((current) => current.filter((entry) => entry !== value))
            }}
            onToggleFocus={(focus) => toggleSelection(focus, selectedFocuses, setSelectedFocuses)}
            onCustomFocusChange={(value) => {
              setCustomFocus(value)
              setNotice('自定义关注方向已保存在本次 Demo。')
            }}
            onFeedbackImportant={(messageId) => handleFeedback(messageId, 'more_important')}
            onFeedbackLess={(messageId) => handleFeedback(messageId, 'show_less')}
          />
        </section>
      </main>
    </div>
  )
}
