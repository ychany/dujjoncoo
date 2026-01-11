import { useEffect, useState, useRef } from 'react'
import { db, ref, onValue, onDisconnect } from '../lib/firebase'
import { runTransaction, set, remove } from 'firebase/database'

// 오늘 날짜 키 (YYYY-MM-DD)
const getTodayKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// 고유 세션 ID (모듈 레벨에서 한 번만 생성)
const SESSION_ID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function useStats() {
  const [activeUsers, setActiveUsers] = useState(0)
  const [todayCookies, setTodayCookies] = useState(0)
  const [totalCookies, setTotalCookies] = useState(0)
  const isRegistered = useRef(false)

  useEffect(() => {
    const todayKey = getTodayKey()
    const todayCookiesRef = ref(db, `stats/cookies/${todayKey}`)
    const totalCookiesRef = ref(db, 'stats/totalCookies')
    const presenceRef = ref(db, 'presence')
    const connectedRef = ref(db, '.info/connected')
    const myPresenceRef = ref(db, `presence/${SESSION_ID}`)

    // 동접자 수 구독 (presence 노드의 자식 수)
    const unsubActive = onValue(presenceRef, (snapshot) => {
      const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0
      setActiveUsers(count)
    })

    // 오늘 쿠키 수 구독
    const unsubCookies = onValue(todayCookiesRef, (snapshot) => {
      setTodayCookies(snapshot.val() || 0)
    })

    // 누적 쿠키 수 구독
    const unsubTotal = onValue(totalCookiesRef, (snapshot) => {
      setTotalCookies(snapshot.val() || 0)
    })

    // Firebase 연결 상태 감지
    const unsubConnected = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true && !isRegistered.current) {
        isRegistered.current = true
        // 먼저 disconnect 핸들러 등록
        onDisconnect(myPresenceRef).remove()
        // 그 다음 presence 등록
        set(myPresenceRef, { online: true, timestamp: Date.now() })
      }
    })

    return () => {
      unsubActive()
      unsubCookies()
      unsubTotal()
      unsubConnected()
      // 컴포넌트 언마운트 시 presence 삭제
      if (isRegistered.current) {
        remove(myPresenceRef)
        isRegistered.current = false
      }
    }
  }, [])

  // 쿠키 완식 시 호출
  const addCookie = () => {
    const todayKey = getTodayKey()
    const todayCookiesRef = ref(db, `stats/cookies/${todayKey}`)
    const totalCookiesRef = ref(db, 'stats/totalCookies')
    runTransaction(todayCookiesRef, (current) => (current || 0) + 1)
    runTransaction(totalCookiesRef, (current) => (current || 0) + 1)
  }

  return { activeUsers, todayCookies, totalCookies, addCookie }
}
