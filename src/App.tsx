import { useState } from 'react'
import './App.css'
import { DemoDashboard } from './components/DemoDashboard'
import { LandingPage } from './components/LandingPage'
import { buildPanelData, getInboxItems, initialStatusMap } from './data/mockData'

type PageState = 'landing' | 'demo'

const landingPanelData = buildPanelData(initialStatusMap, 'priority_content')
const landingPreviewIds = new Set(['q3-review', 'finance-report', 'visa-check'])
const landingPreviewItems = getInboxItems(initialStatusMap).filter((item) =>
  landingPreviewIds.has(item.messageId),
)

function App() {
  const [page, setPage] = useState<PageState>('landing')
  const [connectNotice, setConnectNotice] = useState('')

  const navigate = (nextPage: PageState) => {
    setPage(nextPage)
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (page === 'demo') {
    return <DemoDashboard onBackToLanding={() => navigate('landing')} />
  }

  return (
    <LandingPage
      overview={landingPanelData.overview}
      previewItems={landingPreviewItems}
      connectNotice={connectNotice}
      onStartDemo={() => navigate('demo')}
      onConnectGmail={() =>
        setConnectNotice('真实 Gmail 连接功能即将开放，当前可以先体验 Demo。')
      }
    />
  )
}

export default App
