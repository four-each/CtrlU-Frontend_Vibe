# 우당탕탕 - 친구들과 함께하는 할 일 관리 앱

친구들과 함께 할 일을 관리하고 공유할 수 있는 React Native 앱입니다.

## 주요 기능

### 🏠 메인 화면
- **24시간 활동 스토리**: 친구들과 내가 최근 24시간 동안 올린 할 일들을 인스타그램 스토리처럼 상단에 표시
- **진행중인 할 일 목록**: 나와 친구들의 진행중인 할 일들을 섹션별로 구분하여 표시
- **업로드 버튼**: 진행중인 할 일이 없을 때만 표시되는 할 일 생성 버튼

### 📱 상세 화면
- **진행중인 할 일**: 실시간 타이머, 시간 초과 시 빨간색 표시, 완료/포기 버튼
- **완료된 할 일**: 소요 시간 표시, 시작/완료 사진 전환, 삭제 기능
- **스와이프 네비게이션**: 좌우 스와이프로 다른 할 일로 이동

### 📸 할 일 생성
- **카메라 접근**: 시작 사진 필수 촬영
- **할 일 정보 입력**: 제목, 설명, 목표 시간 설정
- **폼 검증**: 필수 항목 입력 확인

### 📷 카메라 기능
- **시작 사진 촬영**: 할 일 시작 전 필수 사진
- **완료 사진 촬영**: 할 일 완료 시 필수 사진
- **사진 재촬영**: 촬영 후 다시 찍기 가능

## 기술 스택

- **React Native** 0.72.6
- **TypeScript** 4.8.4
- **React Navigation** 6.x
- **React Native Gesture Handler** 2.12.1
- **React Native Reanimated** 3.5.4
- **React Native Linear Gradient** 2.8.3
- **React Native Vector Icons** 10.0.0

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 2. iOS 실행
```bash
cd ios && pod install && cd ..
npm run ios
# 또는
yarn ios
```

### 3. Android 실행
```bash
npm run android
# 또는
yarn android
```

### 4. Metro 서버 시작
```bash
npm start
# 또는
yarn start
```

## 프로젝트 구조

```
src/
├── App.tsx                 # 메인 앱 컴포넌트
├── types/
│   └── index.ts           # 타입 정의
├── utils/
│   └── helpers.ts         # 유틸리티 함수
└── screens/
    ├── MainScreen.tsx     # 메인 화면
    ├── DetailScreen.tsx   # 상세 화면
    ├── CreateTaskScreen.tsx # 할 일 생성 화면
    └── CameraScreen.tsx   # 카메라 화면
```

## 주요 컴포넌트

### MainScreen
- 스토리 형태의 24시간 활동 표시
- 진행중인 할 일 목록
- 조건부 업로드 버튼

### DetailScreen
- 할 일 상세 정보 표시
- 실시간 타이머 (진행중인 할 일)
- 완료/포기/삭제 기능
- 스와이프 네비게이션

### CreateTaskScreen
- 카메라 접근 및 사진 촬영
- 할 일 정보 입력 폼
- 폼 검증 및 제출

### CameraScreen
- 시작/완료 사진 촬영
- 사진 재촬영 기능
- 촬영 확인 및 저장

## 데이터 구조

### Task
```typescript
interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetTime: number; // 목표 시간 (분)
  startTime: Date;
  endTime?: Date;
  startImage: string;
  endImage?: string;
  isCompleted: boolean;
  isAbandoned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
```typescript
interface User {
  id: string;
  username: string;
  nickname: string;
  profileImage?: string;
}
```

## 주요 기능 설명

### 스토리 시스템
- 24시간 내 활동을 시간순으로 정렬
- 친구 할 일은 안 본 것부터 표시
- 내 할 일은 진행중인 것부터 표시
- 색상으로 상태 구분 (초록: 새로움, 회색: 봤음)

### 시간 관리
- 실시간 타이머로 경과 시간 표시
- 목표 시간 초과 시 빨간색으로 경고
- 완료 시 소요 시간 계산 및 표시

### 사진 시스템
- 할 일 시작 시 필수 시작 사진
- 할 일 완료 시 필수 완료 사진
- 완료된 할 일에서 시작/완료 사진 전환 가능

### 네비게이션
- 스와이프로 할 일 간 이동
- 진행중 ↔ 완료된 할 일 간 자연스러운 전환
- 직관적인 뒤로가기 및 홈 이동

## 개발 환경 설정

### 필수 도구
- Node.js 16+
- React Native CLI
- Xcode (iOS 개발용)
- Android Studio (Android 개발용)

### 권한 설정
- 카메라 접근 권한
- 사진 저장 권한
- 네트워크 접근 권한

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 연락처

프로젝트 링크: [https://github.com/your-username/todo-friends-app](https://github.com/your-username/todo-friends-app)
