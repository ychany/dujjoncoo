import { useState, useCallback, useEffect } from 'react'
import Cookie from './components/Cookie'
import ProgressBar from './components/ProgressBar'
import PriceTag from './components/PriceTag'
import EatingMessage from './components/EatingMessage'
import EndingScreen from './components/EndingScreen'
import Crumbs from './components/Crumbs'
import { useSound } from './hooks/useSound'

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

  const { playBiteSound, playCompleteSound } = useSound()

  const progress = (biteCount / BITES_TO_FINISH) * 100
  const stage = Math.floor((biteCount / BITES_TO_FINISH) * 5)
  const savedAmount = Math.floor((biteCount / BITES_TO_FINISH) * COOKIE_PRICE) + cookiesEaten * COOKIE_PRICE

  const handleBite = useCallback(() => {
    const now = Date.now()
    if (now - lastBiteTime < COOLDOWN_MS) return

    setLastBiteTime(now)
    setIsEating(true)
    playBiteSound()

    setTimeout(() => setIsEating(false), 100)

    setBiteCount(prev => {
      const newCount = prev + 1
      if (newCount >= BITES_TO_FINISH) {
        // 쿠키 완식!
        setTimeout(() => {
          playCompleteSound()
          setCookiesEaten(c => c + 1)
          setShowEnding(true)
        }, 300)
      }
      return newCount
    })
  }, [lastBiteTime, playBiteSound, playCompleteSound])

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
      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-black text-amber-800 mb-2">
            두쫀쿠
          </h1>
          <p className="text-amber-600 text-lg mb-8">
            두바이 쫀득쿠키 먹방 체험
          </p>

          {/* 쿠키 미리보기 - 리얼 버전 */}
          <div className="w-52 h-52 mx-auto mb-8 rounded-full relative">
            {/* 그림자 */}
            <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-36 h-8 bg-black/20 rounded-full blur-xl" />

            {/* 쿠키 본체 */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at 30% 30%, #8B6D5C 0%, #5D4037 40%, #4E342E 70%, #3E2723 100%)',
                boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.3), inset 0 10px 20px rgba(255,255,255,0.05)',
              }}
            />

            {/* 코코아 텍스처 */}
            <div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* 하이라이트 */}
            <div
              className="absolute rounded-full opacity-15"
              style={{
                top: '10%',
                left: '15%',
                width: '30%',
                height: '20%',
                background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)',
                filter: 'blur(6px)',
              }}
            />
          </div>

          <div className="bg-amber-50 rounded-xl p-4 mb-8 max-w-xs mx-auto">
            <div className="text-amber-700 font-bold">실제 가격</div>
            <div className="text-3xl font-black text-amber-800">₩6,000</div>
            <div className="text-amber-500 text-sm">(여기선 무료)</div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-12 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            🍪 먹으러 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* 상단: 가격 표시 */}
      <div className="pt-4">
        <PriceTag saved={savedAmount} />
      </div>

      {/* 중앙: 쿠키 */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <EatingMessage biteCount={biteCount} show={!showEnding} />

        <Cookie stage={stage} onClick={handleBite} isEating={isEating} />

        <Crumbs biteCount={biteCount} />

        {/* 먹기 힌트 */}
        <p className="text-amber-600 mt-6 text-sm animate-pulse">
          {stage < 5 ? '👆 터치해서 먹기 (스페이스바도 가능)' : ''}
        </p>
      </div>

      {/* 하단: 진행도 */}
      <div className="pb-8 w-full flex justify-center">
        <ProgressBar progress={Math.min(progress, 100)} />
      </div>

      {/* 엔딩 화면 */}
      {showEnding && (
        <EndingScreen cookiesEaten={cookiesEaten} onReset={handleReset} />
      )}
    </div>
  )
}

export default App
