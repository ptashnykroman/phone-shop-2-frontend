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

function parseDateValue(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const directDate = new Date(trimmed);
    if (!Number.isNaN(directDate.getTime())) {
      return directDate;
    }

    const normalizedDate = new Date(trimmed.replace(" ", "T"));
    if (!Number.isNaN(normalizedDate.getTime())) {
      return normalizedDate;
    }

    const timestamp = Number(trimmed);
    if (Number.isFinite(timestamp)) {
      const timestampDate = new Date(timestamp);
      if (!Number.isNaN(timestampDate.getTime())) {
        return timestampDate;
      }
    }

    return null;
  }

  if (typeof value === "object") {
    const candidate =
      "date" in value
        ? value.date
        : "$date" in value
          ? value.$date
          : "iso" in value
            ? value.iso
            : null;

    return candidate ? parseDateValue(candidate) : null;
  }

  return null;
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return "Дата недоступна";
  }

  const date = parseDateValue(value);

  if (!date) {
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
