/**
 * PayPal REST API helper (이해욱 개인계정 수취용)
 *
 * 이 모듈은 서버 측에서만 사용해야 합니다. (Client Secret 노출 금지)
 * PayPal 공식 REST v2 API를 직접 호출하므로 SDK 버전에 의존하지 않습니다.
 *
 * 필요한 환경 변수:
 *   PAYPAL_MODE          sandbox | live   (기본값: sandbox)
 *   PAYPAL_CLIENT_ID     앱(REST API) Client ID
 *   PAYPAL_CLIENT_SECRET 앱(REST API) Secret
 *   PAYPAL_CURRENCY      결제 통화 (기본값: USD — PayPal은 KRW 결제를 지원하지 않음)
 *   PAYPAL_RECEIVER_EMAIL 이해욱 개인계정 이메일 (참고/검증용)
 */

const PAYPAL_MODE = process.env.PAYPAL_MODE ?? "sandbox";

const PAYPAL_BASE =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET ?? "";

export const PAYPAL_CURRENCY = process.env.PAYPAL_CURRENCY ?? "USD";
export const PAYPAL_RECEIVER_EMAIL = process.env.PAYPAL_RECEIVER_EMAIL ?? "";

async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "PayPal 자격 증명이 없습니다. PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET 환경 변수를 설정하세요."
    );
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal 인증 실패 (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export interface CreateOrderInput {
  /** "100.00" 형식의 금액 문자열 */
  amount: string;
  /** ISO 통화 코드. 미지정 시 PAYPAL_CURRENCY 사용 */
  currency?: string;
  /** 주문 설명 (PayPal 결제창에 노출) */
  description?: string;
}

/** PayPal 주문 생성 (intent: CAPTURE). 수취 계정은 앱 자격 증명(이해욱 개인계정)으로 결정됩니다. */
export async function createOrder(input: CreateOrderInput) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: input.currency ?? PAYPAL_CURRENCY,
            value: input.amount,
          },
          description: input.description,
        },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`PayPal 주문 생성 실패 (${res.status}): ${JSON.stringify(data)}`);
  }
  return data as { id: string; status: string };
}

/** 승인된 PayPal 주문을 캡처(결제 확정)합니다. */
export async function captureOrder(orderId: string) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`PayPal 결제 캡처 실패 (${res.status}): ${JSON.stringify(data)}`);
  }
  return data as { id: string; status: string };
}
