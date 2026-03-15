export type Category = '治療院' | '家計' | '保険・投資' | 'その他';

export type PaymentCycle = '毎月' | '年1回' | '半年1回' | '四半期1回';

export type PaymentMethod = '口座引落' | 'クレジットカード' | '振込' | '現金' | 'その他';

export interface FixedCost {
  id: string;
  name: string;
  category: Category;
  amount: number;
  paymentCycle: PaymentCycle;
  paymentDay: number; // 支払日（1〜31）
  paymentMethod: PaymentMethod;
  memo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySummary {
  category: Category;
  monthlyTotal: number;
  yearlyTotal: number;
  count: number;
  items: FixedCost[];
}

export const CATEGORIES: Category[] = ['治療院', '家計', '保険・投資', 'その他'];

export const PAYMENT_CYCLES: PaymentCycle[] = ['毎月', '年1回', '半年1回', '四半期1回'];

export const PAYMENT_METHODS: PaymentMethod[] = ['口座引落', 'クレジットカード', '振込', '現金', 'その他'];

export const CATEGORY_COLORS: Record<Category, string> = {
  '治療院': '#3B82F6',
  '家計': '#10B981',
  '保険・投資': '#8B5CF6',
  'その他': '#F59E0B',
};

export const CATEGORY_BG_COLORS: Record<Category, string> = {
  '治療院': 'bg-blue-50 border-blue-200',
  '家計': 'bg-emerald-50 border-emerald-200',
  '保険・投資': 'bg-purple-50 border-purple-200',
  'その他': 'bg-amber-50 border-amber-200',
};

export const CATEGORY_TEXT_COLORS: Record<Category, string> = {
  '治療院': 'text-blue-700',
  '家計': 'text-emerald-700',
  '保険・投資': 'text-purple-700',
  'その他': 'text-amber-700',
};

export const CATEGORY_BADGE_COLORS: Record<Category, string> = {
  '治療院': 'bg-blue-100 text-blue-800',
  '家計': 'bg-emerald-100 text-emerald-800',
  '保険・投資': 'bg-purple-100 text-purple-800',
  'その他': 'bg-amber-100 text-amber-800',
};
