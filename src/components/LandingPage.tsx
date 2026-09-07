import { BOARD_LABELS } from '../types'
import type { BoardType, MailListItem, OverviewCounts } from '../types'

type LandingPageProps = {
  overview: OverviewCounts
  previewItems: MailListItem[]
  connectNotice: string
  onStartDemo: () => void
  onConnectGmail: () => void
}

const BOARD_ORDER: BoardType[] = ['priority_content', 'within_48h', 'todo', 'ignore']

const boardCounts = (overview: OverviewCounts): Record<BoardType, number> => ({
  priority_content: overview.priorityContentCount,
  within_48h: overview.within48hCount,
  todo: overview.todoCount,
  ignore: overview.ignoreCount,
})

export function LandingPage({
  overview,
  previewItems,
  connectNotice,
  onStartDemo,
  onConnectGmail,
}: LandingPageProps) {
  const counts = boardCounts(overview)

  return (
    <div className="landing-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mail Assistant 首页">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Mail Assistant</span>
        </a>
        <nav aria-label="主导航">
          <a href="#how-it-works">工作方式</a>
          <a href="#product">产品能力</a>
          <button className="header-demo-button" type="button" onClick={onStartDemo}>体验 Demo</button>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="hero-kicker"><span />Gmail AI priority assistant</div>
            <h1>Your inbox,<br />prioritized for you.</h1>
            <p className="hero-lead">
              AI 驱动的 Gmail 智能优先级助手。理解邮件内容、行动要求与时间窗口，
              让你先看到真正需要阅读和处理的事。
            </p>
            <div className="hero-actions">
              <button className="primary-cta" type="button" onClick={onStartDemo}>
                体验 Demo <span aria-hidden="true">→</span>
              </button>
              <button className="secondary-cta" type="button" onClick={onConnectGmail}>
                Connect Gmail
              </button>
            </div>
            <p className="demo-disclaimer">无需登录 · 使用 Mock Data · 不会读取你的邮箱</p>
            {connectNotice ? <div className="connect-notice" role="status">{connectNotice}</div> : null}
          </div>

          <div className="hero-product" aria-label="Mail Assistant 产品预览">
            <div className="product-window">
              <div className="product-window-top">
                <div>
                  <span className="product-dot" />
                  <strong>Today&apos;s inbox</strong>
                </div>
                <span>AI analyzed · just now</span>
              </div>
              <div className="landing-overview">
                {BOARD_ORDER.map((board) => (
                  <div className={`landing-stat stat-${board}`} key={board}>
                    <span>{BOARD_LABELS[board]}</span>
                    <strong>{counts[board]}</strong>
                  </div>
                ))}
              </div>
              <div className="landing-mail-list">
                {previewItems.slice(0, 3).map((item) => (
                  <article className="landing-mail" key={item.messageId}>
                    <span className={`landing-score priority-${item.priorityLevel}`}>
                      {Math.round(item.priorityScore * 100)}
                    </span>
                    <div>
                      <div className="landing-mail-meta">
                        <strong>{item.senderName}</strong>
                        <span>{item.receivedAt}</span>
                      </div>
                      <h3>{item.subject}</h3>
                      <p>{item.shortSummary}</p>
                      <div className="landing-mail-tags">
                        <span>{BOARD_LABELS[item.boardType]}</span>
                        <span>{item.actionLabel ?? item.reasonTags[0]}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="floating-rule-card">
              <span>Board</span>
              <strong>放在哪里</strong>
              <i aria-hidden="true">≠</i>
              <span>Priority</span>
              <strong>有多重要</strong>
            </div>
          </div>
        </section>

        <section className="principle-section" id="how-it-works">
          <div className="section-label">核心方法</div>
          <div className="principle-copy">
            <h2>不只是分类。<br />它在帮你分配注意力。</h2>
            <p>
              普通规则往往把“高优先级”直接等同于某个文件夹。Mail Assistant 把邮件的展示位置和重要程度拆成两个独立判断，保留更多真实语义。
            </p>
          </div>
          <div className="dimension-comparison">
            <article>
              <span className="comparison-number">01</span>
              <div>
                <small>Board Assignment</small>
                <h3>这封邮件应该出现在哪里？</h3>
                <p>优先内容、48h、待处理、可忽略，表达的是阅读和行动场景。</p>
              </div>
            </article>
            <article>
              <span className="comparison-number">02</span>
              <div>
                <small>Priority Model</small>
                <h3>它对你到底有多重要？</h3>
                <p>高、中、低优先级独立评分，并可在同一板块内帮助排序。</p>
              </div>
            </article>
          </div>
        </section>

        <section className="feature-section" id="product">
          <div className="feature-heading">
            <div className="section-label">产品能力</div>
            <h2>让每一封邮件<br />都有清楚的下一步。</h2>
          </div>
          <div className="feature-grid">
            <article>
              <span className="feature-icon">◎</span>
              <h3>理解语义，而非关键词</h3>
              <p>结合寄件人、正文、截止时间与动作要求，生成简短主题和 AI 概述。</p>
            </article>
            <article>
              <span className="feature-icon">↗</span>
              <h3>识别时间与行动</h3>
              <p>把 48 小时内事项和需要回复、确认、提交的待办快速区分。</p>
            </article>
            <article>
              <span className="feature-icon">＋</span>
              <h3>根据反馈持续适配</h3>
              <p>“更重要 / 少显示”反馈影响个性化 Priority，而不粗暴改写邮件语义。</p>
            </article>
          </div>
        </section>

        <section className="bottom-cta">
          <div>
            <div className="section-label">Interactive demo</div>
            <h2>用一分钟，重新认识你的收件箱。</h2>
          </div>
          <button className="primary-cta" type="button" onClick={onStartDemo}>
            开始体验 <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Mail Assistant</span>
        </a>
        <p>Portfolio Demo · Mock data only</p>
      </footer>
    </div>
  )
}
