# 두바이 왕자 (Dubai Prince)

6,000원짜리 두바이 쫀득쿠키를 무료로 먹어보는 가상 먹방 체험 웹앱

<a href="https://minion.toss.im/JesOF8A2"><img src="apps%20in%20toss%20logo.png" alt="Apps in Toss" width="180"></a>

## 플레이하기

- **토스 앱**: [minion.toss.im/JesOF8A2](https://minion.toss.im/JesOF8A2) (미니앱 > 콘텐츠 > 두바이 왕자)
- **웹**: [dujjoncoo.vercel.app](https://dujjoncoo.vercel.app)

## 소개

**두바이 왕자**는 요즘 핫한 두바이 쫀득쿠키(두쫀쿠)를 가상으로 체험해볼 수 있는 인터랙티브 웹앱입니다.
터치/클릭으로 쿠키를 한 입씩 베어먹으며 쿠키가 점점 먹히는 모습을 볼 수 있습니다.

## 주요 기능

- 터치/클릭으로 쿠키 먹기 (스페이스바 지원)
- 실시간 동접자 수 표시 (Firebase Presence)
- 오늘/누적 먹힌 쿠키 수 집계
- 쿠키 단면의 카다이프 면발과 피스타치오 크림 시각화
- 먹는 중 랜덤 대사 표시
- 완식 후 공유 기능
- 반응형 디자인 (모바일/웹)
- 쿠키 부스러기 애니메이션
- 자정 날짜 자동 변경
- 👑 왕관 애니메이션 (홈 화면)

## 기술 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Firebase Realtime Database
  - Presence 시스템 (실시간 동접자)
  - Transaction (쿠키 카운트)
- Apps-in-Toss SDK (토스 미니앱)

## 배포

### 토스 앱인토스
```bash
# 빌드
npx granite build

# 배포
npx ait deploy
```

### Vercel (웹)
GitHub 연동으로 자동 배포

#### 환경 변수 (Vercel)
- `VITE_SHOW_COUPANG`: `true` - 쿠팡 파트너스 버튼 표시 여부

## 프로젝트 구조

```
src/
├── components/
│   ├── Cookie.tsx        # 쿠키 SVG 컴포넌트
│   ├── Crumbs.tsx        # 부스러기 애니메이션
│   ├── EatingMessage.tsx # 먹방 대사
│   ├── EndingScreen.tsx  # 완식 화면
│   ├── PriceTag.tsx      # 가격 표시
│   └── ProgressBar.tsx   # 진행바
├── hooks/
│   ├── useSound.ts       # 효과음
│   └── useStats.ts       # Firebase 통계
├── lib/
│   └── firebase.ts       # Firebase 설정
├── App.tsx               # 메인 앱
└── granite.config.ts     # 앱인토스 설정
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## Firebase 설정

Firebase Realtime Database 규칙:

```json
{
  "rules": {
    "presence": {
      ".read": true,
      "$sessionId": {
        ".write": true
      }
    },
    "stats": {
      "cookies": {
        "$date": {
          ".read": true,
          ".write": true,
          ".validate": "newData.isNumber() && (data.val() == null || newData.val() >= data.val())"
        }
      },
      "totalCookies": {
        ".read": true,
        ".write": true,
        ".validate": "newData.isNumber() && newData.val() >= data.val()"
      }
    }
  }
}
```

## 라이선스

© 2026 JO YEONG CHAN
