import { useState, useCallback, useEffect } from 'react'
import Cookie from './components/Cookie'
import ProgressBar from './components/ProgressBar'
import PriceTag from './components/PriceTag'
import EatingMessage from './components/EatingMessage'
import EndingScreen from './components/EndingScreen'
import Crumbs from './components/Crumbs'
import { useSound } from './hooks/useSound'
import { useStats } from './hooks/useStats'

const BITES_TO_FINISH = 23 // 쿠키 하나 먹는데 필요한 클릭 수
const COOKIE_PRICE = 6000
const COOLDOWN_MS = 200 // 연타 쿨타임

function App() {
  const [biteCount, setBiteCount] = useState(0)
  const [cookiesEaten, setCookiesEaten] = useState(0)
  const [isEating, setIsEating] = useState(false)
  const [lastBiteTime, setLastBiteTime] = useState(0)
  const [showEnding, setShowEnding] = useState(false)
  const [started, setStarted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPatchNotes, setShowPatchNotes] = useState(false)

  const { playBiteSound, playCompleteSound } = useSound()
  const { activeUsers, todayCookies, totalCookies, addCookie } = useStats()

  const handleShare = async () => {
    const shareText = `🍪 두쫀쿠 - 두바이 쫀득쿠키 먹방 체험\n6,000원짜리 쿠키를 무료로 먹어보세요!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: '두쫀쿠 - 두바이 쫀득쿠키 체험',
          text: shareText,
          url: window.location.href,
        })
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`)
      alert('링크가 복사되었습니다!')
    }
  }

  const progress = (biteCount / BITES_TO_FINISH) * 100
  const stage = Math.floor((biteCount / BITES_TO_FINISH) * 5)
  const savedAmount = Math.floor((biteCount / BITES_TO_FINISH) * COOKIE_PRICE)

  const handleBite = useCallback(() => {
    const now = Date.now()
    if (now - lastBiteTime < COOLDOWN_MS) return
    if (biteCount >= BITES_TO_FINISH) return // 이미 다 먹었으면 무시

    setLastBiteTime(now)
    setIsEating(true)
    playBiteSound()

    setTimeout(() => setIsEating(false), 100)

    const newCount = biteCount + 1
    setBiteCount(newCount)

    if (newCount >= BITES_TO_FINISH) {
      // 쿠키 완식!
      setTimeout(() => {
        playCompleteSound()
        setCookiesEaten(c => c + 1)
        addCookie() // Firebase에 기록
        setShowEnding(true)
      }, 300)
    }
  }, [lastBiteTime, biteCount, playBiteSound, playCompleteSound, addCookie])

  const handleReset = useCallback(() => {
    setBiteCount(0)
    setShowEnding(false)
  }, [])

  // 키보드 지원
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && started && !showEnding) {
        e.preventDefault()
        handleBite()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleBite, started, showEnding])

  // 시작 화면
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-center p-4 relative">
        {/* 좌측 상단 버튼들 */}
        <div className="absolute top-4 left-4 flex gap-2">
          {/* 메뉴 버튼 */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-95"
              aria-label="메뉴"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute left-0 mt-2 w-44 bg-gray-900/95 rounded-xl shadow-xl z-20 overflow-hidden">
                  <a
                    href="https://github.com/ychany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                  <button
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors w-full"
                    onClick={() => { setMenuOpen(false); setShowPatchNotes(true); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm">패치노트</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 공유 버튼 */}
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-95"
            aria-label="공유"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-amber-800 mb-1">
            두쫀쿠
          </h1>
          <p className="text-amber-600 text-sm mb-4">
            두바이 쫀득쿠키 먹방 체험
          </p>

          {/* 쿠키 미리보기 - 실제 Cookie 컴포넌트 사용 */}
          <div className="mb-4 pointer-events-none scale-75">
            <Cookie stage={0} onClick={() => {}} isEating={false} />
          </div>

          <div className="bg-amber-50 rounded-xl p-3 mb-4 max-w-xs mx-auto">
            <div className="text-amber-700 font-bold text-sm">실제 가격</div>
            <div className="text-2xl font-black text-amber-800">₩6,000</div>
            <div className="text-amber-500 text-xs">(여기선 무료)</div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-10 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            🍪 먹으러 가기
          </button>

          <p className="text-amber-600 text-xs mt-4">
            {activeUsers}명 먹는 중 | 오늘 {todayCookies}개 (누적 {totalCookies.toLocaleString()}개)
          </p>
        </div>

        {/* 저작권 */}
        <p className="absolute bottom-4 text-amber-500/60 text-xs">
          © 2025 JO YEONG CHAN. All rights reserved.
        </p>

        {/* 패치노트 모달 */}
        {showPatchNotes && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPatchNotes(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="bg-amber-500 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">패치노트</h2>
                <button onClick={() => setShowPatchNotes(false)} className="text-white/80 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                <div>
                  <div className="text-amber-600 font-bold text-sm mb-2">2026.01.11</div>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>- 누적 쿠키 수 표시 추가</li>
                    <li>- 패치노트 기능 추가</li>
                    <li>- 저작권 표시 추가</li>
                    <li>- 실시간 동접자 수 기능 추가</li>
                    <li>- 메뉴 버튼 및 공유 기능 추가</li>
                    <li>- 카다이프 면발 시각화 개선</li>
                    <li>- 가격, 대사 수정</li>
                    <li>- 홈화면 개선</li>
                    <li>- Firebase 연동</li>
                  </ul>
                </div>
                <div>
                  <div className="text-amber-600 font-bold text-sm mb-2">2026.01.10</div>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>- 두쫀쿠 최초 출시</li>
                    <li>- 쿠키 먹기 기능</li>
                    <li>- 쿠키 단면 개선</li>
                    <li>- 부스러기 애니메이션</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* 좌측 상단 버튼들 */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {/* 메뉴 버튼 */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-95"
            aria-label="메뉴"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </button>

          {/* 드롭다운 메뉴 */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute left-0 mt-2 w-44 bg-gray-900/95 rounded-xl shadow-xl z-20 overflow-hidden">
                <a
                  href="https://github.com/ychany"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm">GitHub</span>
                </a>
                <button
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors w-full"
                  onClick={() => { setMenuOpen(false); setShowPatchNotes(true); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">패치노트</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* 공유 버튼 */}
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-95"
          aria-label="공유"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* 상단: 가격 표시 */}
      <div className="pt-4">
        <PriceTag saved={savedAmount} />
      </div>

      {/* 중앙: 쿠키 */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <Cookie stage={stage} onClick={handleBite} isEating={isEating} />

        <Crumbs biteCount={biteCount} />

        {/* 대사 */}
        <div className="h-8 mt-4">
          <EatingMessage biteCount={biteCount} show={!showEnding} progress={progress} />
        </div>

        {/* 먹기 힌트 */}
        <p className="text-amber-600 mt-6 text-sm animate-pulse">
          {stage < 5 ? '👆 터치해서 먹기' : ''}
        </p>
      </div>

      {/* 하단: 진행도 */}
      <div className="pb-4 w-full flex flex-col items-center gap-2">
        <ProgressBar progress={Math.min(progress, 100)} />
        <p className="text-amber-600 text-xs">
          {activeUsers}명 먹는 중 | 오늘 두쫀쿠 {todayCookies}개 (누적 {totalCookies.toLocaleString()}개)
        </p>
        <p className="text-amber-500/60 text-xs mt-1">
          © 2025 JO YEONG CHAN
        </p>
      </div>

      {/* 엔딩 화면 */}
      {showEnding && (
        <EndingScreen cookiesEaten={cookiesEaten} onReset={handleReset} />
      )}

      {/* 패치노트 모달 */}
      {showPatchNotes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPatchNotes(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-amber-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">패치노트</h2>
              <button onClick={() => setShowPatchNotes(false)} className="text-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              <div>
                <div className="text-amber-600 font-bold text-sm mb-2">2026.01.11</div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>- 누적 쿠키 수 표시 추가</li>
                  <li>- 패치노트 기능 추가</li>
                  <li>- 저작권 표시 추가</li>
                  <li>- 실시간 동접자 수 기능 추가</li>
                  <li>- 메뉴 버튼 및 공유 기능 추가</li>
                  <li>- 카다이프 면발 시각화 개선</li>
                  <li>- 가격, 대사 수정</li>
                  <li>- 홈화면 개선</li>
                  <li>- Firebase 연동</li>
                </ul>
              </div>
              <div>
                <div className="text-amber-600 font-bold text-sm mb-2">2026.01.10</div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>- 두쫀쿠 최초 출시</li>
                  <li>- 쿠키 먹기 기능</li>
                  <li>- 쿠키 단면 개선</li>
                  <li>- 부스러기 애니메이션</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
