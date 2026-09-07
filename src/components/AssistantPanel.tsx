import { MailBundleCard } from './MailBundleCard'
import { MailCard } from './MailCard'
import { MailInsightView } from './MailInsightView'
import { SectionBlock } from './SectionBlock'
import { BOARD_LABELS } from '../types'
import type {
  BoardType,
  ExpandedPanelData,
  FeedbackMap,
  HistoryEntry,
  MailInsightDetail,
  MailListItem,
  SenderOption,
} from '../types'

const CUSTOM_SENDER = '__custom_sender__'
const CUSTOM_FOCUS = '__custom_focus__'
const BOARD_ORDER: BoardType[] = ['priority_content', 'within_48h', 'todo', 'ignore']

const BOARD_META: Record<BoardType, { description: string; marker: string }> = {
  priority_content: {
    description: '值得优先阅读、但未必需要立即行动的内容',
    marker: '↑',
  },
  within_48h: {
    description: '未来 48 小时内需要查看或处理的邮件',
    marker: '◷',
  },
  todo: {
    description: '包含回复、确认、提交等后续动作',
    marker: '✓',
  },
  ignore: {
    description: '当前可后置的订阅、推广与低价值通知',
    marker: '−',
  },
}

type AssistantPanelProps = {
  panelData: ExpandedPanelData
  detail?: MailInsightDetail
  feedbackMap: FeedbackMap
  commonSenderOptions: SenderOption[]
  customSenderEntries: string[]
  selectedSenders: string[]
  customSenderValue: string
  senderHistory: HistoryEntry[]
  selectedFocuses: string[]
  customFocusValue: string
  focusOptions: string[]
  onBackToList: () => void
  onBoardChange: (board: BoardType) => void
  onOpenMail: (messageId: string) => void
  onMarkDone: (messageId: string) => void
  onToggleSender: (sender: string) => void
  onCustomSenderChange: (value: string) => void
  onAddCustomSender: () => void
  onRemoveCustomSender: (value: string) => void
  onToggleFocus: (focus: string) => void
  onCustomFocusChange: (value: string) => void
  onFeedbackImportant: (messageId: string) => void
  onFeedbackLess: (messageId: string) => void
}

type RenderCard =
  | { kind: 'single'; item: MailListItem }
  | { kind: 'bundle'; key: string; label: string; items: MailListItem[] }

const buildVisibleCards = (items: MailListItem[]): RenderCard[] => {
  const groupedItems = new Map<string, MailListItem[]>()

  for (const item of items) {
    if (!item.aggregationKey) continue
    groupedItems.set(item.aggregationKey, [
      ...(groupedItems.get(item.aggregationKey) ?? []),
      item,
    ])
  }

  const cards: RenderCard[] = []
  const seenBundleKeys = new Set<string>()

  for (const item of items) {
    if (!item.aggregationKey) {
      cards.push({ kind: 'single', item })
      continue
    }

    if (seenBundleKeys.has(item.aggregationKey)) continue
    seenBundleKeys.add(item.aggregationKey)
    const bundleItems = groupedItems.get(item.aggregationKey) ?? [item]

    cards.push(
      bundleItems.length > 1
        ? {
            kind: 'bundle',
            key: item.aggregationKey,
            label: item.aggregationLabel ?? '相似邮件',
            items: bundleItems,
          }
        : { kind: 'single', item },
    )
  }

  return cards
}

export function AssistantPanel({
  panelData,
  detail,
  feedbackMap,
  commonSenderOptions,
  customSenderEntries,
  selectedSenders,
  customSenderValue,
  senderHistory,
  selectedFocuses,
  customFocusValue,
  focusOptions,
  onBackToList,
  onBoardChange,
  onOpenMail,
  onMarkDone,
  onToggleSender,
  onCustomSenderChange,
  onAddCustomSender,
  onRemoveCustomSender,
  onToggleFocus,
  onCustomFocusChange,
  onFeedbackImportant,
  onFeedbackLess,
}: AssistantPanelProps) {
  const counts: Record<BoardType, number> = {
    priority_content: panelData.overview.priorityContentCount,
    within_48h: panelData.overview.within48hCount,
    todo: panelData.overview.todoCount,
    ignore: panelData.overview.ignoreCount,
  }

  const activeItems = panelData.boards[panelData.activeBoard]
  const visibleCards = buildVisibleCards(activeItems)
  const configuredSenderCount = selectedSenders.filter((value) => value !== CUSTOM_SENDER).length
  const configuredFocusCount = selectedFocuses.filter((value) => value !== CUSTOM_FOCUS).length

  const renderMailStack = () => {
    if (visibleCards.length === 0) {
      return (
        <div className="empty-state">
          <strong>这个板块已经清空</strong>
          <p>你可以切换到其他板块，或重置 Demo 恢复全部邮件。</p>
        </div>
      )
    }

    return (
      <div className="card-stack">
        {visibleCards.map((card) =>
          card.kind === 'single' ? (
            <MailCard
              item={card.item}
              feedbackAction={feedbackMap[card.item.messageId]}
              key={card.item.messageId}
              onOpenMail={onOpenMail}
              onMarkDone={onMarkDone}
              onFeedbackImportant={onFeedbackImportant}
              onFeedbackLess={onFeedbackLess}
            />
          ) : (
            <MailBundleCard
              items={card.items}
              key={card.key}
              label={card.label}
              feedbackAction={feedbackMap[card.items[0].messageId]}
              onOpenMail={onOpenMail}
              onFeedbackImportant={onFeedbackImportant}
              onFeedbackLess={onFeedbackLess}
            />
          ),
        )}
      </div>
    )
  }

  return (
    <div className="assistant-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow quiet">AI 整理结果</p>
          <h2>先处理真正重要的邮件</h2>
          <p className="panel-sync">{panelData.meta.lastSyncedText} · 15 封 Mock 邮件</p>
        </div>
        <div className="dimension-key" aria-label="信息维度说明">
          <span><i className="key-board" />板块 = 展示位置</span>
          <span><i className="key-priority" />优先级 = 重要程度</span>
        </div>
      </header>

      <div className="overview-grid" aria-label="邮箱概览">
        {BOARD_ORDER.map((board) => (
          <button
            className={`overview-card board-${board} ${panelData.activeBoard === board ? 'is-active' : ''}`}
            key={board}
            type="button"
            onClick={() => onBoardChange(board)}
          >
            <span className="overview-icon" aria-hidden="true">{BOARD_META[board].marker}</span>
            <span className="overview-label">{BOARD_LABELS[board]}</span>
            <strong>{counts[board]}</strong>
          </button>
        ))}
      </div>

      <div className="dashboard-content-grid">
        <main className="mail-feed">
          <nav className="board-tabs" aria-label="邮件板块">
            {BOARD_ORDER.map((board) => (
              <button
                aria-current={panelData.activeBoard === board ? 'page' : undefined}
                className={panelData.activeBoard === board ? 'is-active' : ''}
                key={board}
                type="button"
                onClick={() => {
                  onBackToList()
                  onBoardChange(board)
                }}
              >
                {BOARD_LABELS[board]}
                <span>{counts[board]}</span>
              </button>
            ))}
          </nav>

          {detail ? (
            <MailInsightView
              detail={detail}
              feedbackAction={feedbackMap[detail.messageId]}
              onBack={onBackToList}
              onMarkDone={onMarkDone}
              onFeedbackImportant={onFeedbackImportant}
              onFeedbackLess={onFeedbackLess}
            />
          ) : (
            <SectionBlock
              title={BOARD_LABELS[panelData.activeBoard]}
              subtitle={BOARD_META[panelData.activeBoard].description}
              count={activeItems.length}
            >
              {renderMailStack()}
            </SectionBlock>
          )}
        </main>

        <aside className="preference-panel">
          <div className="preference-heading">
            <div>
              <p className="eyebrow quiet">Personalization</p>
              <h3>我的偏好</h3>
            </div>
            <span>仅本地</span>
          </div>
          <p className="preference-intro">这些设置保存在本次 Demo 状态中，用来演示个性化输入。</p>

          <details className="preference-card" open>
            <summary>
              <span>重点寄件人</span>
              <small>{configuredSenderCount} 位</small>
            </summary>
            <div className="preference-card-body">
              <div className="filter-choice-row">
                {commonSenderOptions.map((option) => (
                  <label
                    className={`filter-check ${selectedSenders.includes(option.value) ? 'is-active' : ''}`}
                    key={option.value}
                  >
                    <input
                      checked={selectedSenders.includes(option.value)}
                      onChange={() => onToggleSender(option.value)}
                      type="checkbox"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
                <label className={`filter-check ${selectedSenders.includes(CUSTOM_SENDER) ? 'is-active' : ''}`}>
                  <input
                    checked={selectedSenders.includes(CUSTOM_SENDER)}
                    onChange={() => onToggleSender(CUSTOM_SENDER)}
                    type="checkbox"
                  />
                  <span>自定义</span>
                </label>
              </div>
              {selectedSenders.includes(CUSTOM_SENDER) ? (
                <div className="filter-input-row">
                  <input
                    className="filter-input"
                    onChange={(event) => onCustomSenderChange(event.target.value)}
                    placeholder="寄件人或邮箱"
                    type="text"
                    value={customSenderValue}
                  />
                  <button className="secondary-button small" type="button" onClick={onAddCustomSender}>添加</button>
                </div>
              ) : null}
              {customSenderEntries.map((entry) => (
                <div className="custom-entry" key={entry}>
                  <label>
                    <input
                      checked={selectedSenders.includes(entry)}
                      onChange={() => onToggleSender(entry)}
                      type="checkbox"
                    />
                    {entry}
                  </label>
                  <button type="button" onClick={() => onRemoveCustomSender(entry)} aria-label={`删除 ${entry}`}>×</button>
                </div>
              ))}
            </div>
          </details>

          <details className="preference-card" open>
            <summary>
              <span>关注主题</span>
              <small>{configuredFocusCount} 项</small>
            </summary>
            <div className="preference-card-body">
              <div className="filter-choice-row">
                {focusOptions.map((focus) => (
                  <label className={`filter-check ${selectedFocuses.includes(focus) ? 'is-active' : ''}`} key={focus}>
                    <input
                      checked={selectedFocuses.includes(focus)}
                      onChange={() => onToggleFocus(focus)}
                      type="checkbox"
                    />
                    <span>{focus}</span>
                  </label>
                ))}
                <label className={`filter-check ${selectedFocuses.includes(CUSTOM_FOCUS) ? 'is-active' : ''}`}>
                  <input
                    checked={selectedFocuses.includes(CUSTOM_FOCUS)}
                    onChange={() => onToggleFocus(CUSTOM_FOCUS)}
                    type="checkbox"
                  />
                  <span>自定义</span>
                </label>
              </div>
              {selectedFocuses.includes(CUSTOM_FOCUS) ? (
                <input
                  className="filter-input"
                  onChange={(event) => onCustomFocusChange(event.target.value)}
                  placeholder="例如：CPT、RA 申请"
                  type="text"
                  value={customFocusValue}
                />
              ) : null}
            </div>
          </details>

          <details className="preference-card">
            <summary>
              <span>历史数据追踪</span>
              <small>{senderHistory.length} 位</small>
            </summary>
            <div className="preference-card-body">
              {senderHistory.length ? (
                <div className="history-list">
                  {senderHistory.map((entry, index) => (
                    <div className="history-item" key={entry.senderName}>
                      <span>#{index + 1}</span>
                      <strong>{entry.senderName}</strong>
                      <small>{entry.count} 次</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="history-empty">查看几封邮件后，这里会出现来源偏好。</p>
              )}
            </div>
          </details>

          <div className="learning-note">
            <span aria-hidden="true">↗</span>
            <p><strong>反馈不会移动板块</strong>“更重要 / 少显示”只调整 Priority 分数，Board 仍由邮件语义决定。</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
