'use client';

import { useState, useEffect } from 'react';
import { FixedCost, Category, PaymentCycle, PaymentMethod, CATEGORIES, PAYMENT_CYCLES, PAYMENT_METHODS } from '../types';
import { generateId } from '../utils';

interface Props {
  onSave: (cost: FixedCost) => void;
  onCancel: () => void;
  editCost?: FixedCost | null;
}

export default function CostForm({ onSave, onCancel, editCost }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('治療院');
  const [amount, setAmount] = useState('');
  const [paymentCycle, setPaymentCycle] = useState<PaymentCycle>('毎月');
  const [paymentDay, setPaymentDay] = useState('27');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('口座引落');
  const [memo, setMemo] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editCost) {
      setName(editCost.name);
      setCategory(editCost.category);
      setAmount(editCost.amount.toString());
      setPaymentCycle(editCost.paymentCycle);
      setPaymentDay(editCost.paymentDay.toString());
      setPaymentMethod(editCost.paymentMethod);
      setMemo(editCost.memo);
    }
  }, [editCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = '項目名は必須です';
    if (!amount || parseInt(amount) <= 0) newErrors.amount = '正しい金額を入力してください';
    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const cost: FixedCost = {
      id: editCost?.id || generateId(),
      name,
      category,
      amount: parseInt(amount),
      paymentCycle,
      paymentDay: parseInt(paymentDay),
      paymentMethod,
      memo,
      isActive: editCost?.isActive ?? true,
      createdAt: editCost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(cost);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">
            {editCost ? '固定費を編集' : '固定費を追加'}
          </h2>
          <button onClick={onCancel} aria-label="閉じる" className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* カテゴリ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    category === c
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 項目名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">項目名</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="例: 家賃、電気代、生命保険"
              aria-label="項目名"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none text-sm ${fieldErrors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'}`}
              required
            />
            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
          </div>

          {/* 金額 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => { setAmount(e.target.value); setFieldErrors(prev => ({ ...prev, amount: '' })); }}
                placeholder="0"
                aria-label="金額"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none text-sm pr-10 ${fieldErrors.amount ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'}`}
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">円</span>
            </div>
            {fieldErrors.amount && <p className="text-xs text-red-500 mt-1">{fieldErrors.amount}</p>}
          </div>

          {/* 支払サイクル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">支払サイクル</label>
            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_CYCLES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPaymentCycle(c)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    paymentCycle === c
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 支払日 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">支払日</label>
            <div className="relative">
              <select
                value={paymentDay}
                onChange={e => setPaymentDay(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-400 focus:outline-none text-sm appearance-none"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>

          {/* 支払方法 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">支払方法</label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    paymentMethod === m
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="メモがあれば入力"
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-400 focus:outline-none text-sm resize-none"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700"
            >
              {editCost ? '更新する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
