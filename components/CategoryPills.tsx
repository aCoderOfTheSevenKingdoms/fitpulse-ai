import React from 'react';
import { Category } from '../types';

interface CategoryPillsProps {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            selected === cat
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
