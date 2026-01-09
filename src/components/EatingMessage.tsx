import { useEffect, useState } from 'react'

const MESSAGES = [
  "와... 겉은 바삭 속은 쫀득하네",
  "이게 그 중동 감성...",
  "피스타치오가 입안 가득...",
  "내 월급이면 8개밖에 못 먹음",
  "카다이프가 쭈욱 늘어나네",
  "이 맛에 12,000원...",
  "씹을수록 고소해...",
  "진짜 두바이 간 기분",
  "엄마한텐 비밀로 해야지",
  "한입만 더... 한입만...",
  "이게 그 틱톡에서 본 그거?",
  "쫀득쫀득 바삭바삭",
  "돈 없어도 맛은 알아야지",
]

interface EatingMessageProps {
  biteCount: number
  show: boolean
}

export default function EatingMessage({ biteCount, show }: EatingMessageProps) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show && biteCount > 0 && biteCount % 3 === 0) {
      const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      setMessage(randomMessage)
      setVisible(true)

      const timer = setTimeout(() => {
        setVisible(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [biteCount, show])

  if (!visible || !message) return null

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
      <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-center animate-bounce whitespace-nowrap">
        {message}
      </div>
    </div>
  )
}
