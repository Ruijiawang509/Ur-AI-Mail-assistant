import { BOARD_LABELS, PRIORITY_LABELS } from '../types'
import type { FeedbackAction, MailInsightDetail } from '../types'

type MailInsightViewProps = {
  detail: MailInsightDetail
  feedbackAction?: FeedbackAction
  onBack: () => void
  onMarkDone: (messageId: string) => void
  onFeedbackImportant: (messageId: string) => void
  onFeedbackLess: (messageId: string) => void
}

export function MailInsightView({
  detail,
  feedbackAction,
  onBack,
  onMarkDone,
  onFeedbackImportant,
  onFeedbackLess,
}: MailInsightViewProps) {
  return (
    <div className="insight-view">
      <button className="back-link" type="button" onClick={onBack}>
        ← 返回邮件列表
      </button>

      <section className="insight-hero">
        <div className="insight-title-row">
          <div>
            <p className="eyebrow quiet">AI 邮件解读</p>
            <h3>{detail.subject}</h3>
          </div>
          <span className={`priority-score detail-score priority-${detail.priorityLevel}`}>
            {Math.round(detail.priorityScore * 100)}
          </span>
        </div>
        <p className="insight-sender">
          {detail.senderName}
          {detail.senderEmail ? ` · ${detail.senderEmail}` : ''}
        </p>
        <div className="mail-dimensions">
          <span className="dimension-pill board-pill">
            <small>展示板块</small>
            {BOARD_LABELS[detail.boardType]}
          </span>
          <span className={`dimension-pill priority-pill priority-${detail.priorityLevel}`}>
            <small>重要程度</small>
            {PRIORITY_LABELS[detail.priorityLevel]}
          </span>
        </div>
      </section>

      <section className="insight-block emphasis">
        <span>一句话重点</span>
        <p>{detail.focusText}</p>
      </section>

      <section className="insight-block split">
        <div>
          <span>建议动作</span>
          <p>{detail.suggestedAction ?? '当前无需立即处理。'}</p>
        </div>
        <div>
          <span>截止时间</span>
          <p>{detail.deadlineDisplay ?? '暂未识别到明确截止时间。'}</p>
        </div>
      </section>

      <section className="insight-block">
        <span>为什么进入「{BOARD_LABELS[detail.boardType]}」</span>
        <p>{detail.boardReasonText}</p>
      </section>

      <section className="insight-block">
        <span>优先级判断依据</span>
        <ul className="reason-list">
          {detail.reasonBullets.map((reason) => (
            <li key={`${detail.messageId}-${reason}`}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="insight-block feedback-block">
        <div>
          <span>让优先级更懂你</span>
          <p>Demo 只在当前页面调整分数，不会发送或保存任何真实数据。</p>
        </div>
        <div className="card-actions compact">
          <button className="secondary-button" type="button" onClick={() => onMarkDone(detail.messageId)}>
            标记已处理
          </button>
          <button
            className={`feedback-button ${feedbackAction === 'more_important' ? 'is-active' : ''}`}
            type="button"
            onClick={() => onFeedbackImportant(detail.messageId)}
          >
            更重要
          </button>
          <button
            className={`feedback-button ${feedbackAction === 'show_less' ? 'is-active' : ''}`}
            type="button"
            onClick={() => onFeedbackLess(detail.messageId)}
          >
            少显示
          </button>
        </div>
      </section>
    </div>
  )
}
