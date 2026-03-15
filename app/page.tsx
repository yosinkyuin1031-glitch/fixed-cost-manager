'use client';

import { useState, useEffect, useMemo } from 'react';
import { FixedCost, Category, CATEGORIES } from './types';
import { loadCosts, saveCosts, exportToCSV, getUpcomingPayments, formatCurrency } from './utils';
import Summary from './components/Summary';
import CostForm from './components/CostForm';
import CostList from './components/CostList';

type Tab = 'summary' | 'list';
type FilterCategory = Category | 'すべて';

export default function Home() {
  const [costs, setCosts] = useState<FixedCost[]>([]);
  const [tab, setTab] = useState<Tab>('summary');
  const [showForm, setShowForm] = useState(false);
  const [editCost, setEditCost] = useState<FixedCost | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('すべて');
  const [showUpcoming, setShowUpcoming] = useState(false);

  useEffect(() => {
    setCosts(loadCosts());
  }, []);

  const upcoming = useMemo(() => getUpcomingPayments(costs), [costs]);

  const filteredCosts = useMemo(() => {
    if (filterCategory === 'すべて') return costs;
    return costs.filter(c => c.category === filterCategory);
  }, [costs, filterCategory]);

  const handleSave = (cost: FixedCost) => {
    const updated = costs.some(c => c.id === cost.id)
      ? costs.map(c => c.id === cost.id ? cost : c)
      : [...costs, cost];
    setCosts(updated);
    saveCosts(updated);
    setShowForm(false);
    setEditCost(null);
  };

  const handleToggle = (id: string) => {
    const updated = costs.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c
    );
    setCosts(updated);
    saveCosts(updated);
  };

  const handleDelete = (id: string) => {
    const updated = costs.filter(c => c.id !== id);
    setCosts(updated);
    saveCosts(updated);
  };

  const handleEdit = (cost: FixedCost) => {
    setEditCost(cost);
    setShowForm(true);
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(costs);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `固定費一覧_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">固定費管理</h1>
          <div className="flex items-center gap-2">
            {upcoming.length > 0 && (
              <button
                onClick={() => setShowUpcoming(!showUpcoming)}
                className="relative p-2 text-gray-500 hover:text-gray-700"
              >
                🔔
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {upcoming.length}
                </span>
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="p-2 text-gray-400 hover:text-gray-600 text-sm"
              title="CSV出力"
            >
              📥
            </button>
          </div>
        </div>
      </header>

      {/* 支払予定通知 */}
      {showUpcoming && upcoming.length > 0 && (
        <div className="max-w-lg mx-auto px-4 pt-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-800 mb-2">📅 今後7日間の支払予定</p>
            {upcoming.map(cost => (
              <div key={cost.id} className="flex justify-between text-sm py-1">
                <span className="text-amber-700">{cost.paymentDay}日 - {cost.name}</span>
                <span className="font-medium text-amber-800">{formatCurrency(cost.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* タブ */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setTab('summary')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'summary' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            サマリー
          </button>
          <button
            onClick={() => setTab('list')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            一覧
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-lg mx-auto px-4 pb-24">
        {tab === 'summary' ? (
          <Summary costs={costs} />
        ) : (
          <>
            {/* カテゴリフィルター */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
              {(['すべて', ...CATEGORIES] as FilterCategory[]).map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    filterCategory === c
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <CostList
              costs={filteredCosts}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      {/* 追加ボタン（フローティング） */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => { setEditCost(null); setShowForm(true); }}
          className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 transition-all text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg">＋</span> 固定費を追加
        </button>
      </div>

      {/* フォームモーダル */}
      {showForm && (
        <CostForm
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditCost(null); }}
          editCost={editCost}
        />
      )}
    </div>
  );
}
