"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    paypal?: any;
  }
}

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready" }
  | { state: "success"; orderId: string }
  | { state: "error"; message: string };

interface LineItem {
  id: string;
  quantity: number;
}

interface PayPalCheckoutProps {
  /** 결제할 상품 목록 (가격은 서버 카탈로그에서 계산하므로 id/quantity만 전달) */
  items: LineItem[];
  currency: string;
  description?: string;
}

const SDK_SCRIPT_ID = "paypal-sdk";

export default function PayPalCheckout({ items, currency, description }: PayPalCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [amount, setAmount] = useState<string | null>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // 객체 prop을 원시값으로 직렬화해 effect 의존성을 안정화합니다.
  const itemsJson = JSON.stringify(items);

  useEffect(() => {
    if (!clientId) return;

    let cancelled = false;
    let buttonsInstance: any = null;

    const loadSdk = (): Promise<void> =>
      new Promise((resolve, reject) => {
        if (window.paypal) return resolve();
        const existing = document.getElementById(SDK_SCRIPT_ID) as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject(new Error("PayPal SDK 로드 실패")));
          return;
        }
        const script = document.createElement("script");
        script.id = SDK_SCRIPT_ID;
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
          clientId
        )}&currency=${encodeURIComponent(currency)}`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("PayPal SDK 로드 실패"));
        document.body.appendChild(script);
      });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus({ state: "loading" });

    loadSdk()
      .then(() => {
        if (cancelled || !window.paypal || !containerRef.current) return;
        containerRef.current.innerHTML = "";

        buttonsInstance = window.paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },

          createOrder: async () => {
            const res = await fetch("/api/paypal/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: JSON.parse(itemsJson), description }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "주문 생성 실패");
            if (data.amount) setAmount(data.amount);
            return data.id;
          },

          onApprove: async (data: { orderID: string }) => {
            const res = await fetch(`/api/paypal/orders/${data.orderID}/capture`, {
              method: "POST",
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error ?? "결제 캡처 실패");
            setStatus({ state: "success", orderId: result.id ?? data.orderID });
          },

          onError: (err: unknown) => {
            setStatus({
              state: "error",
              message: err instanceof Error ? err.message : "결제 중 오류가 발생했습니다.",
            });
          },
        });

        buttonsInstance.render(containerRef.current);
        setStatus({ state: "ready" });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setStatus({
          state: "error",
          message: err instanceof Error ? err.message : "PayPal 초기화 실패",
        });
      });

    return () => {
      cancelled = true;
      // 언마운트/재렌더 시 버튼 인스턴스를 정리해 메모리 누수와 중복 렌더를 방지합니다.
      if (buttonsInstance && typeof buttonsInstance.close === "function") {
        Promise.resolve(buttonsInstance.close()).catch(() => {});
      }
    };
  }, [clientId, currency, description, itemsJson]);

  if (!clientId) {
    return (
      <div className="placeholder-box">
        PayPal이 아직 설정되지 않았습니다. <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> 환경 변수를
        설정하세요. (이해욱 개인계정 연동 가이드: <code>docs/paypal-personal-account-setup.md</code>)
      </div>
    );
  }

  if (status.state === "success") {
    return (
      <div className="placeholder-box" style={{ borderStyle: "solid", color: "#a7f3d0" }}>
        ✅ 결제가 완료되었습니다. 주문번호: <strong>{status.orderId}</strong>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1rem" }}>
        PayPal 결제 (이해욱 개인계정으로 수취)
        {amount ? ` · 청구액 ${currency} ${amount}` : ""}
      </p>
      <div ref={containerRef} />
      {status.state === "loading" && (
        <div className="placeholder-box">PayPal 결제창을 불러오는 중…</div>
      )}
      {status.state === "error" && (
        <div className="placeholder-box" style={{ color: "#fca5a5" }}>
          ⚠️ {status.message}
        </div>
      )}
    </div>
  );
}
