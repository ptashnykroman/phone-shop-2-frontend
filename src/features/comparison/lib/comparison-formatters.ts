import type {
  ComparisonDifference,
  ComparisonResponse,
} from "@/shared/api/api-types";

const comparisonGroupLabels: Record<string, string> = {
  Battery: "Акумулятор",
  Camera: "Камера",
  Display: "Екран",
  General: "Загальне",
  Longevity: "Довговічність",
  Memory: "Пам'ять",
  Performance: "Продуктивність",
  Storage: "Сховище",
};

const comparisonSpecificationLabels: Record<string, string> = {
  battery_mah: "Ємність акумулятора",
  camera_main_mp: "Основна камера",
  camera_ultrawide_mp: "Надширококутна камера",
  camera_zoom_optical: "Оптичний зум",
  charging_watts: "Потужність заряджання",
  display_brightness_nits: "Пікова яскравість",
  display_resolution_score: "Чіткість екрана",
  display_type: "Тип екрана",
  ois: "Оптична стабілізація",
  processor_score: "Оцінка процесора",
  ram_gb: "Оперативна пам'ять",
  refresh_rate: "Частота оновлення",
  sensor_size: "Розмір сенсора",
  software_support_years: "Термін оновлень",
  storage_gb: "Обсяг пам'яті",
  storage_type: "Тип накопичувача",
};

const comparisonCategoryLabels: Record<string, string> = {
  battery: "Автономність",
  camera: "Камера",
  display: "Екран",
  performance: "Продуктивність",
  storage: "Сховище",
};

const comparisonDifferenceTypeLabels: Record<
  ComparisonDifference["type"],
  string
> = {
  boolean: "Функція",
  numeric: "Число",
  text: "Текст",
};

const comparisonImpactHints: Record<string, string> = {
  battery_mah: "це може означати довшу автономність",
  camera_main_mp: "це може покращити деталізацію фото",
  camera_ultrawide_mp: "це може покращити якість надширококутних фото",
  camera_zoom_optical: "це дає кращий зум без втрати якості",
  charging_watts: "це може скоротити час заряджання",
  display_brightness_nits: "це покращує читабельність екрана на яскравому світлі",
  display_resolution_score: "це впливає на чіткість зображення",
  display_type: "це впливає на контрастність і сприйняття картинки",
  ois: "це допомагає зменшити змазування кадрів",
  processor_score: "це може дати відчутно кращу швидкодію",
  ram_gb: "це допомагає тримати більше задач активними одночасно",
  refresh_rate: "це робить прокрутку та анімації плавнішими",
  sensor_size: "це допомагає камері в складному освітленні",
  software_support_years: "це означає довшу актуальність телефона",
  storage_gb: "це дає більше місця для застосунків, фото й відео",
  storage_type: "це впливає на швидкість читання й запису даних",
};

const truthyValues = new Set(["true", "tak", "yes"]);
const falsyValues = new Set(["false", "ni", "no"]);
const missingValues = new Set(["n/a", "na", "-", ""]);

function pluralizeUk(
  value: number,
  [one, few, many]: [string, string, string],
) {
  const normalized = Math.abs(value);
  const lastDigit = normalized % 10;
  const lastTwoDigits = normalized % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return one;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return few;
  }

  return many;
}

function joinNames(names: string[]) {
  const uniqueNames = Array.from(new Set(names.filter(Boolean)));

  if (uniqueNames.length === 0) {
    return "";
  }

  if (uniqueNames.length === 1) {
    return uniqueNames[0];
  }

  if (uniqueNames.length === 2) {
    return `${uniqueNames[0]} та ${uniqueNames[1]}`;
  }

  return `${uniqueNames.slice(0, -1).join(", ")} та ${uniqueNames.at(-1)}`;
}

function formatComparisonUnit(unit: string, value: string | number) {
  switch (unit.toLowerCase()) {
    case "gb":
      return "ГБ";
    case "hz":
      return "Гц";
    case "mah":
      return "мА·год";
    case "mp":
      return "Мп";
    case "nits":
      return "ніт";
    case "pts":
      return "бал.";
    case "w":
      return "Вт";
    case "years": {
      const numericValue =
        typeof value === "number" ? value : Number.parseFloat(value);
      return Number.isNaN(numericValue)
        ? "років"
        : pluralizeUk(numericValue, ["рік", "роки", "років"]);
    }
    default:
      return unit;
  }
}

function getProductNameMap(products: ComparisonResponse["products"]) {
  return new Map(products.map((product) => [product.id, product.name]));
}

function isTruthyValue(value: string) {
  return truthyValues.has(value.trim().toLowerCase());
}

function isFalsyValue(value: string) {
  return falsyValues.has(value.trim().toLowerCase());
}

export function formatComparisonGroupName(groupName: string) {
  return comparisonGroupLabels[groupName] ?? groupName;
}

export function formatComparisonSpecificationLabel(
  key: string,
  fallbackLabel: string,
) {
  return comparisonSpecificationLabels[key] ?? fallbackLabel;
}

export function formatComparisonCategory(category: string) {
  return comparisonCategoryLabels[category] ?? category;
}

export function formatComparisonDifferenceType(type: ComparisonDifference["type"]) {
  return comparisonDifferenceTypeLabels[type];
}

export function formatComparisonValue(
  value: string | number,
  unit?: string | null,
) {
  const rawValue = String(value).trim();
  const normalizedValue = rawValue.toLowerCase();

  if (isTruthyValue(rawValue)) {
    return "Так";
  }

  if (isFalsyValue(rawValue)) {
    return "Ні";
  }

  if (missingValues.has(normalizedValue)) {
    return "Немає даних";
  }

  if (!unit) {
    return rawValue;
  }

  return `${rawValue} ${formatComparisonUnit(unit, value)}`;
}

export function buildComparisonConclusion(significantDifferencesCount: number) {
  if (significantDifferencesCount === 0) {
    return "Загалом моделі дуже близькі, тому вирішальними можуть стати ціна, дизайн або особисті вподобання.";
  }

  return `Виявлено ${significantDifferencesCount} ${pluralizeUk(
    significantDifferencesCount,
    ["суттєву відмінність", "суттєві відмінності", "суттєвих відмінностей"],
  )}. Насамперед зверніть увагу на категорії, де є явний лідер.`;
}

export function buildComparisonStandoutWinners(
  comparison: Pick<ComparisonResponse, "products" | "winnerByCategory">,
) {
  const productNameMap = getProductNameMap(comparison.products);

  return comparison.winnerByCategory
    .filter((winner) => winner.winnerProductIds.length === 1)
    .map((winner) => {
      const productName = productNameMap.get(winner.winnerProductIds[0]);

      if (!productName) {
        return null;
      }

      return `${productName} лідирує в категорії «${formatComparisonCategory(
        winner.category,
      )}».`;
    })
    .filter((winner): winner is string => Boolean(winner));
}

export function buildComparisonDifferenceExplanation(
  difference: ComparisonDifference,
  products: ComparisonResponse["products"],
) {
  const label = formatComparisonSpecificationLabel(
    difference.key,
    difference.label,
  );
  const productNameMap = getProductNameMap(products);

  if (difference.type === "numeric") {
    const bestProductNames = difference.values
      .filter((value) => value.isBest)
      .map((value) => productNameMap.get(value.productId))
      .filter((productName): productName is string => Boolean(productName));
    const leadText =
      bestProductNames.length === 0
        ? `За характеристикою «${label}» є помітна різниця`
        : bestProductNames.length === 1
          ? `${bestProductNames[0]} має кращий показник «${label}»`
          : `Найкращий показник «${label}» мають ${joinNames(bestProductNames)}`;

    return `${leadText}, і ${
      comparisonImpactHints[difference.key] ??
      "це може відчутно впливати на щоденне користування"
    }.`;
  }

  if (difference.type === "boolean") {
    const enabledProductNames = difference.values
      .filter((value) => isTruthyValue(String(value.value)))
      .map((value) => productNameMap.get(value.productId))
      .filter((productName): productName is string => Boolean(productName));

    if (enabledProductNames.length === 1) {
      return `${enabledProductNames[0]} має «${label}», тоді як не всі конкуренти пропонують цю можливість.`;
    }

    if (enabledProductNames.length > 1) {
      return `Функція «${label}» доступна не в усіх моделей, тому це варто врахувати перед покупкою.`;
    }

    return `За характеристикою «${label}» між моделями є практична різниця.`;
  }

  const involvedProducts = joinNames(
    difference.values
      .map((value) => productNameMap.get(value.productId))
      .filter((productName): productName is string => Boolean(productName)),
  );
  const uniqueValues = Array.from(
    new Set(
      difference.values.map((value) =>
        formatComparisonValue(value.value, value.unit),
      ),
    ),
  );

  if (!involvedProducts) {
    return `За характеристикою «${label}» моделі відрізняються: ${uniqueValues.join(
      ", ",
    )}.`;
  }

  return `За характеристикою «${label}» моделі ${involvedProducts} відрізняються: ${uniqueValues.join(
    ", ",
  )}.`;
}
