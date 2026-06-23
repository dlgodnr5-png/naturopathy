# PayPal 이해욱 개인계정 연동 가이드

이 문서는 Naturopathy 결제 페이지에서 **이해욱 개인계정**으로 PayPal 결제를 수취하기 위한
설정 방법을 정리한 것입니다. (코드 연동은 이미 구현되어 있으며, 아래는 계정/키 설정 단계입니다.)

---

## 1. PayPal 개인계정 생성

> ⚠️ 실제 계정 생성은 사람이 직접 진행해야 합니다 (이메일 인증·본인 확인 필요).

1. https://www.paypal.com/kr/welcome/signup 접속
2. **개인(Personal) 계정** 선택
3. 이해욱님의 이메일 / 휴대폰 / 본인 정보 입력 후 가입
4. 이메일 인증 및 계좌(또는 카드) 연결 완료

## 2. ⚠️ 결제 "수취"에는 비즈니스 업그레이드가 필요

PayPal **개인계정**은 송금/소액 수취는 가능하지만,
**웹사이트에서 REST API(Smart Buttons)로 결제를 받으려면 Business 계정**이 필요합니다.
Business 업그레이드는 **무료**이며 기존 개인계정 정보를 그대로 승계합니다.

- 대시보드 로그인 → 설정 → "비즈니스 계정으로 업그레이드(Upgrade to a Business account)"
- 상호명에 개인 이름(이해욱)을 그대로 사용할 수 있습니다.

> 순수 개인계정만 유지하려는 경우, REST 결제 대신 **PayPal.Me 링크** 또는
> **개인 간 송금(Friends & Family)** 방식만 사용할 수 있습니다. (자동 주문 처리 불가)

## 3. REST 앱 자격 증명 발급

1. https://developer.paypal.com/dashboard/applications 접속 (이해욱 계정으로 로그인)
2. **Apps & Credentials** → Sandbox / Live 탭 선택
3. **Create App** → 앱 이름 입력 (예: `naturopathy`)
4. 생성된 **Client ID** 와 **Secret** 복사

## 4. 환경 변수 설정

`.env.example` 를 복사해 `.env.local` (또는 운영 환경 변수)을 만들고 값을 채웁니다.

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|------|------|
| `PAYPAL_MODE` | `sandbox`(테스트) 또는 `live`(실거래) |
| `PAYPAL_CLIENT_ID` | 발급받은 Client ID (서버용) |
| `PAYPAL_CLIENT_SECRET` | 발급받은 Secret (서버 전용, 노출 금지) |
| `PAYPAL_CURRENCY` | 결제 통화 (기본 `USD`) |
| `PAYPAL_RECEIVER_EMAIL` | 이해욱 개인계정 이메일 (참고용) |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | 브라우저 Smart Buttons용 (Client ID와 동일) |
| `NEXT_PUBLIC_PAYPAL_CURRENCY` | 브라우저 표시 통화 |
| `NEXT_PUBLIC_PAYPAL_KRW_RATE` | KRW→USD 환산 환율 |

> 💡 PayPal은 **KRW(원화) 결제를 지원하지 않습니다.** 장바구니 금액(원화)을
> `NEXT_PUBLIC_PAYPAL_KRW_RATE` 환율로 USD로 환산해 청구합니다.

## 5. 동작 흐름 (구현 완료)

```
체크아웃 페이지 (src/app/checkout/page.tsx)
  └─ <PayPalCheckout> (src/app/checkout/PayPalCheckout.tsx)  ← Smart Buttons 렌더링
       ├─ createOrder  → POST /api/paypal/orders            (src/app/api/paypal/orders/route.ts)
       └─ onApprove    → POST /api/paypal/orders/{id}/capture
                                                             (.../[orderID]/capture/route.ts)
              └─ 서버: src/lib/paypal.ts  (PayPal REST v2 호출)
```

## 6. 테스트 방법 (Sandbox)

1. `PAYPAL_MODE=sandbox` 로 설정하고 Sandbox Client ID/Secret 입력
2. https://developer.paypal.com/dashboard/accounts 의 **Sandbox 테스트 구매자 계정**으로 로그인해 결제
3. 결제 완료 시 체크아웃 화면에 ✅ 주문번호가 표시되면 정상

## 7. 운영 전환 체크리스트

- [ ] 개인계정 → Business 업그레이드 완료
- [ ] Live 앱 Client ID/Secret 발급 및 `PAYPAL_MODE=live` 설정
- [ ] `/api/paypal/orders` 에서 **금액을 DB 가격으로 재계산** (클라이언트 금액 신뢰 금지)
- [ ] 결제 캡처 후 주문 저장 및 세금계산서 발행(`/api/legal/invoice`) 연동
