import { useEffect, useState } from 'react'
import { db, ref, onValue, increment, onDisconnect } from '../lib/firebase'
import { runTransaction } from 'firebase/database'

// 오늘 날짜 키 (YYYY-MM-DD)
const getTodayKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function useStats() {
  const [activeUsers, setActiveUsers] = useState(0)
  const [todayCookies, setTodayCookies] = useState(0)

  useEffect(() => {
    const todayKey = getTodayKey()
    const todayCookiesRef = ref(db, `stats/cookies/${todayKey}`)
    const activeRef = ref(db, 'stats/activeUsers')

    // 동접자 수 구독
    const unsubActive = onValue(activeRef, (snapshot) => {
      setActiveUsers(snapshot.val() || 0)
    })

    // 오늘 쿠키 수 구독
    const unsubCookies = onValue(todayCookiesRef, (snapshot) => {
      setTodayCookies(snapshot.val() || 0)
    })

    // 접속 시 activeUsers +1
    runTransaction(activeRef, (current) => (current || 0) + 1)

    // 접속 종료 시 activeUsers -1
    onDisconnect(activeRef).set(increment(-1))

    return () => {
      unsubActive()
      unsubCookies()
    }
  }, [])

  // 쿠키 완식 시 호출
  const addCookie = () => {
    const todayKey = getTodayKey()
    const todayCookiesRef = ref(db, `stats/cookies/${todayKey}`)
    runTransaction(todayCookiesRef, (current) => (current || 0) + 1)
  }

  return { activeUsers, todayCookies, addCookie }
}
