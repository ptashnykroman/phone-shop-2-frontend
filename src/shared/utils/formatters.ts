import type {
  DeliveryType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/shared/api/api-types";

export function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return "Дата недоступна";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Дата недоступна";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatOrderStatus(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Нове",
    AWAITING_PAYMENT: "Очікує оплату",
    PROCESSING: "Обробляється",
    SHIPPED: "Відправлено",
    DELIVERED: "Доставлено",
    CANCELLED: "Скасовано",
  };

  return labels[status];
}

export function formatPaymentStatus(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    PENDING: "Очікує оплату",
    PAID: "Оплачено",
    FAILED: "Помилка оплати",
    REFUNDED: "Повернено",
  };

  return labels[status];
}

export function formatPaymentMethod(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    MOCK: "Mock payment",
    CARD: "Картка",
    CASH_ON_DELIVERY: "Оплата при отриманні",
  };

  return labels[method];
}

export function formatDeliveryType(type: DeliveryType) {
  return type === "COURIER" ? "Кур'єр" : "Самовивіз";
}

export function formatAlternativeGroup(key: string) {
  const labels: Record<string, string> = {
    cheaperSimilar: "Схоже, але дешевше",
    slightlyMoreExpensiveBetter: "Трохи дорожче, але краще",
    betterCamera: "Краща камера",
    betterBattery: "Краща автономність",
    betterPerformance: "Краща продуктивність",
    bestValue: "Найкраща цінність",
  };

  return labels[key] ?? key;
}

export function formatPerformanceCategory(key: string) {
  const labels: Record<string, string> = {
    everydayUseScore: "Щоденне використання",
    gamingScore: "Ігри",
    cameraScore: "Камера",
    multitaskingScore: "Багатозадачність",
    batteryScore: "Автономність",
    displayScore: "Екран",
    longTermUseScore: "Довгострокове використання",
    overallScore: "Загальна оцінка",
  };

  return labels[key] ?? key;
}
