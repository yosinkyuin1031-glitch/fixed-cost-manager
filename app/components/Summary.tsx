'use client';

import { FixedCost, CATEGORY_COLORS } from '../types';
import { getCategorySummaries, getTotalMonthly, getTotalYearly, formatCurrency } from '../utils';

interface Props {
  costs: FixedCost[];
}

export default function Summary({ costs }: Props) {
  const summaries = getCategorySummaries(costs);
  const totalMonthly = getTotalMonthly(costs);
  const totalYearly = getTotalYearly(costs);
  const activeCosts = costs.filter(c => c.isActive);

  return (
    <div className="space-y-4">
      {/* 合計カード */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 text-white">
        <p className="text-sm text-gray-300 mb-1">固定費合計</p>
        <p className="text-3xl font-bold">{formatCurrency(totalMonthly)}<span className="text-base font-normal text-gray-400">/月</span></p>
        <p className="text-sm text-gray-400 mt-1">年間 {formatCurrency(totalYearly)} ｜ {activeCosts.length}件</p>
      </div>

      {/* カテゴリ別カード */}
      <div className="grid grid-cols-2 gap-3">
        {summaries.map(s => (
          <div key={s.category} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[s.category] }} />
              <p className="text-xs text-gray-500">{s.category}</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(s.monthlyTotal)}</p>
            <p className="text-xs text-gray-400">{s.count}件 ｜ 年{formatCurrency(s.yearlyTotal)}</p>
          </div>
        ))}
      </div>

      {/* 円グラフ（シンプルなバー表示） */}
      {totalMonthly > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">カテゴリ別割合</p>
          <div className="flex rounded-full overflow-hidden h-4 mb-3">
            {summaries.filter(s => s.monthlyTotal > 0).map(s => (
              <div
                key={s.category}
                className="h-full transition-all duration-500"
                style={{
                  width: `${(s.monthlyTotal / totalMonthly) * 100}%`,
                  backgroundColor: CATEGORY_COLORS[s.category],
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {summaries.filter(s => s.monthlyTotal > 0).map(s => (
              <div key={s.category} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[s.category] }} />
                <span className="text-gray-600">{s.category}</span>
                <span className="text-gray-400 ml-auto">{Math.round((s.monthlyTotal / totalMonthly) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
