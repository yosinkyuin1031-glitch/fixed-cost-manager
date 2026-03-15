import { FixedCost, CategorySummary, CATEGORIES } from './types';

const STORAGE_KEY = 'fixed-costs-data';

export function loadCosts(): FixedCost[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCosts(costs: FixedCost[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function toMonthlyAmount(cost: FixedCost): number {
  switch (cost.paymentCycle) {
    case '毎月': return cost.amount;
    case '年1回': return Math.round(cost.amount / 12);
    case '半年1回': return Math.round(cost.amount / 6);
    case '四半期1回': return Math.round(cost.amount / 3);
    default: return cost.amount;
  }
}

export function toYearlyAmount(cost: FixedCost): number {
  switch (cost.paymentCycle) {
    case '毎月': return cost.amount * 12;
    case '年1回': return cost.amount;
    case '半年1回': return cost.amount * 2;
    case '四半期1回': return cost.amount * 4;
    default: return cost.amount * 12;
  }
}

export function getCategorySummaries(costs: FixedCost[]): CategorySummary[] {
  const activeCosts = costs.filter(c => c.isActive);
  return CATEGORIES.map(category => {
    const items = activeCosts.filter(c => c.category === category);
    const monthlyTotal = items.reduce((sum, c) => sum + toMonthlyAmount(c), 0);
    const yearlyTotal = items.reduce((sum, c) => sum + toYearlyAmount(c), 0);
    return { category, monthlyTotal, yearlyTotal, count: items.length, items };
  });
}

export function getTotalMonthly(costs: FixedCost[]): number {
  return costs.filter(c => c.isActive).reduce((sum, c) => sum + toMonthlyAmount(c), 0);
}

export function getTotalYearly(costs: FixedCost[]): number {
  return costs.filter(c => c.isActive).reduce((sum, c) => sum + toYearlyAmount(c), 0);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP') + '円';
}

export function getUpcomingPayments(costs: FixedCost[], daysAhead: number = 7): FixedCost[] {
  const today = new Date();
  const currentDay = today.getDate();
  return costs
    .filter(c => c.isActive && c.paymentCycle === '毎月')
    .filter(c => {
      const diff = c.paymentDay - currentDay;
      return diff >= 0 && diff <= daysAhead;
    })
    .sort((a, b) => a.paymentDay - b.paymentDay);
}

export function exportToCSV(costs: FixedCost[]): string {
  const header = 'カテゴリ,項目名,金額,支払サイクル,支払日,支払方法,月額換算,年額換算,メモ,有効\n';
  const rows = costs.map(c =>
    `${c.category},${c.name},${c.amount},${c.paymentCycle},${c.paymentDay}日,${c.paymentMethod},${toMonthlyAmount(c)},${toYearlyAmount(c)},${c.memo},${c.isActive ? '有効' : '停止'}`
  ).join('\n');
  return '\uFEFF' + header + rows;
}
