interface EndingScreenProps {
  cookiesEaten: number
  onReset: () => void
}

export default function EndingScreen({ cookiesEaten, onReset }: EndingScreenProps) {
  const COOKIE_PRICE = 6000
  const totalSaved = cookiesEaten * COOKIE_PRICE

  const handleShare = async () => {
    const shareText = `🍪 두쫀쿠 완식!\n나는 두바이 쫀득쿠키 ${cookiesEaten}개를 먹고\n₩${totalSaved.toLocaleString()}을 아꼈다!\n\n너도 먹어볼래? 👉`

    if (navigator.share) {
      try {
        await navigator.share({
          title: '두쫀쿠 - 두바이 쫀득쿠키 체험',
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        // 사용자가 공유 취소
      }
    } else {
      // 클립보드 복사 폴백
      await navigator.clipboard.writeText(shareText + ' ' + window.location.href)
      alert('링크가 복사되었습니다!')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        {/* 축하 이모지 */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>

        {/* 완식 메시지 */}
        <h2 className="text-3xl font-black text-amber-800 mb-2">
          두쫀쿠 완식!
        </h2>

        {/* 통계 */}
        <div className="bg-green-100 rounded-xl p-4 my-6">
          <div className="text-green-700 text-sm mb-1">당신이 아낀 금액</div>
          <div className="text-green-600 text-4xl font-black">
            ₩{totalSaved.toLocaleString()}
          </div>
        </div>

        {/* 한마디 */}
        <p className="text-amber-600 mb-6 text-sm">
          "와... 이게 {(COOKIE_PRICE).toLocaleString()}원짜리 맛..."
        </p>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            📤 친구한테 먹여보기
          </button>

          <button
            onClick={onReset}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            🍪 한 개 더 먹기
          </button>
        </div>
      </div>
    </div>
  )
}
