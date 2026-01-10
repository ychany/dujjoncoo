import { useEffect, useState } from 'react'

const MESSAGES = [
  "와... 겉은 쫀득 속은 바삭하네",
  "이게 그 중동 감성...",
  "피스타치오가 입안 가득...",
  "내 월급이면 8개밖에 못 먹음",
  "이 맛에 6,000원...",
  "씹을수록 고소해...",
  "진짜 두바이 간 기분",
  "한입만 더... 한입만...",
  "쫀득쫀득 바삭바삭",
  "돈 없어도 맛은 알아야지",
  "한 입에 1,500원 느낌",
]

const LATE_MESSAGES = [
  "벌써 다 먹어가네",
  "아껴 먹고 싶다",
  "하나 더 먹을까...",
]

interface EatingMessageProps {
  biteCount: number
  show: boolean
  progress?: number
}

export default function EatingMessage({ biteCount, show, progress = 0 }: EatingMessageProps) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show && biteCount > 0 && biteCount % 3 === 0) {
      const messagePool = progress >= 70 ? LATE_MESSAGES : MESSAGES
      const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)]
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
    <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-center whitespace-nowrap">
      {message}
    </div>
  )
}
