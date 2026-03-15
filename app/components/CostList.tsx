'use client';

import { FixedCost, CATEGORY_BADGE_COLORS } from '../types';
import { toMonthlyAmount, formatCurrency } from '../utils';

interface Props {
  costs: FixedCost[];
  onEdit: (cost: FixedCost) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CostList({ costs, onEdit, onToggle, onDelete }: Props) {
  if (costs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-gray-500 text-sm">固定費がまだ登録されていません</p>
        <p className="text-gray-400 text-xs mt-1">下の「＋追加」ボタンから登録しましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {costs.map(cost => (
        <div
          key={cost.id}
          className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${
            !cost.isActive ? 'opacity-50' : ''
          }`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_BADGE_COLORS[cost.category]}`}>
                    {cost.category}
                  </span>
                  {!cost.isActive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">停止中</span>
                  )}
                </div>
                <p className="font-bold text-gray-800 text-sm truncate">{cost.name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{cost.paymentCycle}</span>
                  <span>{cost.paymentDay}日</span>
                  <span>{cost.paymentMethod}</span>
                </div>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <p className="font-bold text-gray-800">{formatCurrency(cost.amount)}</p>
                {cost.paymentCycle !== '毎月' && (
                  <p className="text-xs text-gray-400">月額 {formatCurrency(toMonthlyAmount(cost))}</p>
                )}
              </div>
            </div>
            {cost.memo && (
              <p className="text-xs text-gray-400 mt-2 truncate">💬 {cost.memo}</p>
            )}
          </div>

          {/* アクションボタン */}
          <div className="flex border-t border-gray-50 divide-x divide-gray-50">
            <button
              onClick={() => onEdit(cost)}
              className="flex-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              編集
            </button>
            <button
              onClick={() => onToggle(cost.id)}
              className="flex-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {cost.isActive ? '停止' : '再開'}
            </button>
            <button
              onClick={() => onDelete(cost.id)}
              className="flex-1 py-2.5 text-xs text-red-400 hover:bg-red-50 transition-colors"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
