# AI 고객 서비스 챗봇 데모

자연어 처리를 통해 고객 문의를 자동으로 처리하는 AI 챗봇 시스템입니다.

## 🚀 주요 기능

- **자연어 처리 (NLP)**: 고객의 질문을 정확히 이해하고 적절한 답변 제공
- **다국어 지원**: 한국어, 영어 등 다양한 언어로 대화 가능
- **대화 맥락 유지**: 이전 대화 내용을 기억하여 연속적인 대화 지원
- **실시간 응답**: 빠르고 정확한 고객 서비스 응답

## 🛠 기술 스택

- **Frontend**: SvelteKit, TypeScript
- **Backend**: Node.js, OpenAI API
- **배포**: Vercel

## 📦 설치 및 실행

### 로컬 개발

1. 저장소 클론
```bash
git clone <repository-url>
cd ai-chatbot-demo
```

2. 의존성 설치
```bash
npm install
```

3. 환경변수 설정 (선택사항)
```bash
cp env.example .env
# .env 파일에서 OPENAI_API_KEY 설정
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 브라우저에서 `http://localhost:5173` 접속

### Vercel 배포

1. Vercel CLI 설치
```bash
npm i -g vercel
```

2. Vercel에 로그인
```bash
vercel login
```

3. 프로젝트 배포
```bash
vercel
```

4. 환경변수 설정 (Vercel 대시보드에서)
   - `OPENAI_API_KEY`: OpenAI API 키

## 🔧 API 사용법

### 채팅 API

**엔드포인트**: `POST /api/chat`

**요청 본문**:
```json
{
  "message": "사용자 메시지",
  "history": [
    {
      "role": "user",
      "content": "이전 사용자 메시지"
    },
    {
      "role": "assistant", 
      "content": "이전 챗봇 응답"
    }
  ]
}
```

**응답**:
```json
{
  "response": "챗봇 응답 메시지"
}
```

## 🎯 데모 기능

### 지원하는 질문 유형

- **주문 관련**: "주문 번호 확인", "주문 상태 조회"
- **배송 관련**: "배송 현황", "배송 일정"
- **환불 관련**: "환불 신청", "환불 절차"
- **가격 관련**: "상품 가격", "할인 정보"
- **일반 문의**: "도움말", "고객 지원"

### 다국어 지원

- 한국어: "안녕하세요", "주문 확인", "배송 문의"
- 영어: "Hello", "Order status", "Delivery inquiry"

## 🔒 보안

- OpenAI API 키는 환경변수로 관리
- 클라이언트 사이드에서 직접 API 키 노출 방지
- 입력 검증 및 에러 처리

## 📝 라이선스

MIT License

## 🤝 기여

버그 리포트나 기능 제안은 이슈를 통해 제출해주세요.

---

**참고**: 이 데모는 OpenAI API 키가 설정되지 않은 경우 기본 응답을 제공합니다. 실제 사용을 위해서는 OpenAI API 키를 설정해주세요.
