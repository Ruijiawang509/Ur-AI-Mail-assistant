import { useState } from 'react'
import { BOARD_LABELS, PRIORITY_LABELS } from '../types'
import type { FeedbackAction, MailListItem } from '../types'

type MailBundleCardProps = {
  items: MailListItem[]
  label: string
  feedbackAction?: FeedbackAction
  onOpenMail: (messageId: string) => void
  onFeedbackImportant?: (messageId: string) => void
  onFeedbackLess?: (messageId: string) => void
}

export function MailBundleCard({
  items,
  label,
  feedbackAction,
  onOpenMail,
  onFeedbackImportant,
  onFeedbackLess,
}: MailBundleCardProps) {
  const [expanded, setExpanded] = useState(false)
  const leadItem = items[0]
  const previewItems = expanded ? items : items.slice(0, 3)

  return (
    <article className="mail-card mail-bundle-card">
      <div className="mail-card-header">
        <div className="mail-card-title-group">
          <span className={`priority-score priority-${leadItem.priorityLevel}`}>
            {Math.round(leadItem.priorityScore * 100)}
          </span>
          <div className="mail-card-title-copy">
            <div className="mail-source-row">
              <strong>{leadItem.senderName}</strong>
              <span>{leadItem.receivedAt}</span>
            </div>
            <h4>{items.length} 封{label}已合并</h4>
          </div>
        </div>
      </div>

      <p className="mail-card-summary">同一来源的相似邮件被收拢展示，需要时仍可逐封查看。</p>

      <div className="mail-dimensions">
        <span className="dimension-pill board-pill">
          <small>板块</small>
          {BOARD_LABELS[leadItem.boardType]}
        </span>
        <span className={`dimension-pill priority-pill priority-${leadItem.priorityLevel}`}>
          <small>优先级</small>
          {PRIORITY_LABELS[leadItem.priorityLevel]}
        </span>
      </div>

      <div className="bundle-preview">
        {previewItems.map((item) => (
          <div className="bundle-preview-row" key={item.messageId}>
            <span className="bundle-preview-subject">{item.subject}</span>
            <button className="text-button" type="button" onClick={() => onOpenMail(item.messageId)}>
              查看
            </button>
          </div>
        ))}
        {!expanded && items.length > previewItems.length ? (
          <span className="bundle-more">还有 {items.length - previewItems.length} 封相似邮件</span>
        ) : null}
      </div>

      <div className="card-actions">
        <button className="secondary-button" type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? '收起列表' : `展开 ${items.length} 封`}
        </button>
        <div className="feedback-actions" aria-label="调整此类邮件的个性化优先级">
          <span>反馈</span>
          {onFeedbackImportant ? (
            <button
              className={`feedback-button ${feedbackAction === 'more_important' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onFeedbackImportant(leadItem.messageId)}
            >
              更重要
            </button>
          ) : null}
          {onFeedbackLess ? (
            <button
              className={`feedback-button ${feedbackAction === 'show_less' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onFeedbackLess(leadItem.messageId)}
            >
              少显示
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
