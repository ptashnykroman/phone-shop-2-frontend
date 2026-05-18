export type Role = "GUEST" | "USER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "MOCK" | "CARD" | "CASH_ON_DELIVERY";

export type DeliveryType = "COURIER" | "PICKUP";

export type AlternativeReasonType =
  | "CHEAPER_SIMILAR"
  | "SLIGHTLY_MORE_EXPENSIVE_BETTER"
  | "BETTER_CAMERA"
  | "BETTER_BATTERY"
  | "BETTER_PERFORMANCE"
  | "BEST_VALUE";

export type ProductSortBy = "price" | "popularity" | "newest" | "rating";
export type SortOrder = "asc" | "desc";

export interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  errorCode: string;
  details?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  id: string;
  productId: string;
  groupName: string;
  key: string;
  label: string;
  value: string;
  numericValue: number | null;
  unit: string | null;
  importance: number;
  isComparable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductEmbeddedReview {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ProductPublicReview extends ProductEmbeddedReview {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface PerformanceScore {
  id: string;
  productId: string;
  everydayUseScore: number;
  gamingScore: number;
  cameraScore: number;
  multitaskingScore: number;
  batteryScore: number;
  displayScore: number;
  longTermUseScore: number;
  overallScore: number;
  explanation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  sku: string;
  color: string | null;
  images: string[];
  isActive: boolean;
  deletedAt: string | null;
  ratingAverage: number;
  reviewCount: number;
  brandId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
  specifications: ProductSpecification[];
  performanceScore: PerformanceScore | null;
  reviews: ProductEmbeddedReview[];
}

export interface CharacteristicExplanation {
  id: string;
  specificationKey: string;
  label: string;
  shortExplanation: string;
  detailedExplanation: string;
  practicalImpact: string;
  example: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExplainedSpecificationGroup {
  groupName: string;
  items: Array<{
    key: string;
    label: string;
    value: string;
    unit?: string | null;
    simpleExplanation: string | null;
    practicalImpact: string | null;
    importance: number;
  }>;
}

export interface AlternativeRecommendation {
  product: Product;
  reasonType: AlternativeReasonType;
  score: number;
  title: string;
  explanation: string;
  priceDifference: number;
  mainAdvantages: string[];
}

export interface AlternativesResponse {
  sourceProduct: Product;
  alternativesByType: {
    cheaperSimilar: AlternativeRecommendation[];
    slightlyMoreExpensiveBetter: AlternativeRecommendation[];
    betterCamera: AlternativeRecommendation[];
    betterBattery: AlternativeRecommendation[];
    betterPerformance: AlternativeRecommendation[];
    bestValue: AlternativeRecommendation[];
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
  lineTotal: string;
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  createdAt: string;
}

export interface OrderUserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: OrderUserSummary;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface ComparisonGroupedSpecification {
  groupName: string;
  items: Array<{
    groupName: string;
    key: string;
    label: string;
    importance: number;
    values: Array<{
      productId: string;
      productName: string;
      value: string;
      numericValue: number | null;
      unit: string | null;
    }>;
  }>;
}

export interface ComparisonDifference {
  groupName: string;
  key: string;
  label: string;
  type: "numeric" | "boolean" | "text";
  values: Array<{
    productId: string;
    value: string | number;
    unit: string | null;
    isBest: boolean;
  }>;
  explanation: string;
  importance: number;
}

export interface ComparisonWinner {
  category: string;
  winnerProductIds: string[];
  score: number;
}

export interface ComparisonSummary {
  significantDifferencesCount: number;
  standoutWinners: string[];
  conclusion: string;
}

export interface ComparisonResponse {
  products: Array<Product & { performanceScore: PerformanceScore }>;
  comparableSpecifications: Array<{
    productId: string;
    specifications: ProductSpecification[];
  }>;
  groupedSpecifications: ComparisonGroupedSpecification[];
  highlightedDifferences: ComparisonDifference[];
  winnerByCategory: ComparisonWinner[];
  summary: ComparisonSummary;
}

export interface AdminOverview {
  users: number;
  products: number;
  orders: number;
  reviews: number;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  sessionId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  brandIds?: string[];
  categoryIds?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  specifications?: string;
}

export interface ProductSpecificationInput {
  groupName: string;
  key: string;
  label: string;
  value: string;
  numericValue?: number;
  unit?: string;
  importance?: number;
  isComparable?: boolean;
}

export interface ProductPayload {
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  color?: string;
  images?: string[];
  isActive?: boolean;
  brandId: string;
  categoryId: string;
  specifications?: ProductSpecificationInput[];
}

export interface BrandPayload {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  description?: string;
}

export interface CharacteristicExplanationPayload {
  specificationKey: string;
  label: string;
  shortExplanation: string;
  detailedExplanation: string;
  practicalImpact: string;
  example?: string;
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface MergeCartRequest {
  sessionId: string;
}

export interface CreateOrderRequest {
  deliveryType: DeliveryType;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface ToggleFavoriteRequest {
  productId: string;
}

export interface CreateReviewRequest {
  rating: number;
  text: string;
}

export interface ModerateReviewRequest {
  isApproved: boolean;
}

export interface CompareProductsRequest {
  productIds: string[];
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  role?: Role;
  isActive?: boolean;
}

export interface HealthStatus {
  status: "ok";
  database: "up";
  cache: "redis" | "memory";
  timestamp: string;
}
