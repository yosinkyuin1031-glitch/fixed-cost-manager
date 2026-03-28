'use client';

import { useState } from 'react';
import { FixedCost, CATEGORY_BADGE_COLORS } from '../types';
import { toMonthlyAmount, formatCurrency } from '../utils';

interface Props {
  costs: FixedCost[];
  onEdit: (cost: FixedCost) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CostList({ costs, onEdit, onToggle, onDelete }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<FixedCost | null>(null);

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
    <>
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
                aria-label={`${cost.name}を編集`}
                className="flex-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
              >
                編集
              </button>
              <button
                onClick={() => onToggle(cost.id)}
                aria-label={cost.isActive ? `${cost.name}を停止` : `${cost.name}を再開`}
                className="flex-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {cost.isActive ? '停止' : '再開'}
              </button>
              <button
                onClick={() => setDeleteTarget(cost)}
                aria-label={`${cost.name}を削除`}
                className="flex-1 py-2.5 text-xs text-red-400 hover:bg-red-50 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">削除の確認</h3>
            <p className="text-sm text-gray-500 mb-5">
              「{deleteTarget.name}」を削除しますか？<br />
              この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                aria-label="キャンセル"
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  onDelete(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                aria-label="削除する"
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
