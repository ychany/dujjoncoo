import { getTossShareLink, share } from '@apps-in-toss/web-framework'

interface EndingScreenProps {
  cookiesEaten: number
  onReset: () => void
  onHome: () => void
}

const COMPLETION_MESSAGES = [
  '벌써 다 먹었어?',
  '한 개 더 먹어야겠다',
  '어 벌써 없어졌네',
  '이거 중독성 있다',
  '손이 멈추질 않아',
  '진짜 맛있긴 하네',
  '6천원 아깝지 않다',
  '또 먹고 싶다...',
]

export default function EndingScreen({ onReset, onHome }: EndingScreenProps) {
  const COOKIE_PRICE = 6000
  const completionMessage = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]

  const handleShare = async () => {
    const shareText = `🍪 두쫀쿠 완식!\n나는 두바이 쫀득쿠키를 먹고\n₩${COOKIE_PRICE.toLocaleString()}을 아꼈다!\n\n너도 먹어볼래? 👉`

    try {
      const tossLink = await getTossShareLink('intoss://dubaiprince')
      await share({ message: `${shareText}\n${tossLink}` })
    } catch {
      // 토스 환경이 아닌 경우 (웹 브라우저 등)
      if (navigator.share) {
        try {
          await navigator.share({
            title: '두쫀쿠 - 두바이 쫀득쿠키 체험',
            text: shareText,
            url: window.location.href,
          })
        } catch {
          // 사용자가 공유 취소
        }
      } else {
        await navigator.clipboard.writeText(shareText + ' ' + window.location.href)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        {/* 축하 이모지 */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>

        {/* 완식 메시지 */}
        <h2 className="text-3xl font-black text-amber-800 mb-2">
          {completionMessage}
        </h2>

        {/* 통계 */}
        <div className="bg-green-100 rounded-xl p-4 my-6">
          <div className="text-green-700 text-sm mb-1">당신이 아낀 금액</div>
          <div className="text-green-600 text-4xl font-black">
            ₩{COOKIE_PRICE.toLocaleString()}
          </div>
        </div>

        {/* 한마디 */}
        <p className="text-amber-600 mb-6 text-sm">
          "와... 이게 {(COOKIE_PRICE).toLocaleString()}원짜리 맛..."
        </p>

        {/* 메인 버튼 */}
        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          🍪 한 개 더 먹기
        </button>

        {/* 서브 버튼들 */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={onHome}
            className="bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-bold hover:bg-gray-300 transition-all active:scale-95"
          >
            🏠 홈으로
          </button>
          <button
            onClick={handleShare}
            className="bg-green-500 text-white py-2.5 px-4 rounded-xl font-bold hover:bg-green-600 transition-all active:scale-95"
          >
            📤 공유하기
          </button>
        </div>

        {/* 쿠팡 파트너스 - Vercel 배포에서만 표시 (VITE_SHOW_COUPANG=true) */}
        {import.meta.env.VITE_SHOW_COUPANG === 'true' && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <button
              onClick={() => window.open('https://link.coupang.com/a/dpV3lE', '_blank')}
              className="w-full bg-amber-100 text-amber-700 py-3 px-6 rounded-xl font-bold text-lg hover:bg-amber-200 transition-all active:scale-95"
            >
              🛒 진짜 두쫀쿠 사러가기
            </button>
            <p className="text-gray-400 text-xs mt-2">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br />
              이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
