import { BOARD_LABELS, PRIORITY_LABELS } from '../types'
import type { FeedbackAction, MailListItem } from '../types'

type MailCardProps = {
  item: MailListItem
  feedbackAction?: FeedbackAction
  onOpenMail: (messageId: string) => void
  onMarkDone?: (messageId: string) => void
  onFeedbackImportant?: (messageId: string) => void
  onFeedbackLess?: (messageId: string) => void
}

export function MailCard({
  item,
  feedbackAction,
  onOpenMail,
  onMarkDone,
  onFeedbackImportant,
  onFeedbackLess,
}: MailCardProps) {
  const visibleTags = item.reasonTags.slice(0, 3)
  const score = Math.round(item.priorityScore * 100)

  return (
    <article className={`mail-card ${item.itemStatus === 'done' ? 'done' : ''}`}>
      <div className="mail-card-header">
        <div className="mail-card-title-group">
          <span
            className={`priority-score priority-${item.priorityLevel}`}
            title="本地 Priority Model 分数"
          >
            {score}
          </span>
          <div className="mail-card-title-copy">
            <div className="mail-source-row">
              <strong>{item.senderName}</strong>
              <span>{item.receivedAt}</span>
            </div>
            <h4>{item.subject}</h4>
          </div>
        </div>
      </div>

      <p className="mail-card-summary">{item.shortSummary}</p>

      <div className="mail-dimensions" aria-label="板块与优先级">
        <span className="dimension-pill board-pill">
          <small>板块</small>
          {BOARD_LABELS[item.boardType]}
        </span>
        <span className={`dimension-pill priority-pill priority-${item.priorityLevel}`}>
          <small>优先级</small>
          {PRIORITY_LABELS[item.priorityLevel]}
        </span>
      </div>

      <p className="board-reason">{item.boardReasonText}</p>

      <div className="mail-card-tags">
        {item.actionLabel ? <span className="action-chip">{item.actionLabel}</span> : null}
        {item.deadlineText ? <span className="deadline-chip">{item.deadlineText}</span> : null}
        {visibleTags.map((tag) => (
          <span className="tag-chip" key={`${item.messageId}-${tag}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="card-actions">
        <button className="primary-button" type="button" onClick={() => onOpenMail(item.messageId)}>
          查看邮件解读
        </button>

        {onMarkDone && item.actionRequired ? (
          <button className="secondary-button" type="button" onClick={() => onMarkDone(item.messageId)}>
            标记已处理
          </button>
        ) : null}

        <div className="feedback-actions" aria-label="调整个性化优先级">
          <span>反馈</span>
          {onFeedbackImportant ? (
            <button
              className={`feedback-button ${feedbackAction === 'more_important' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onFeedbackImportant(item.messageId)}
            >
              更重要
            </button>
          ) : null}
          {onFeedbackLess ? (
            <button
              className={`feedback-button ${feedbackAction === 'show_less' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onFeedbackLess(item.messageId)}
            >
              少显示
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
