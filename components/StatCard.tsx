import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color?: 'purple' | 'green' | 'blue' | 'orange';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, icon, color = 'purple' }) => {
  const colorStyles = {
    purple: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20',
    green: 'text-brand-green bg-brand-green/10 border-brand-green/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className="bg-brand-surface border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
      </div>
      {subValue && (
        <div className="flex items-center gap-2 mt-2">
            {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-brand-green" />}
            {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-400" />}
            {trend === 'neutral' && <Minus className="w-4 h-4 text-zinc-500" />}
            <span className={`text-sm ${trend === 'up' ? 'text-brand-green' : trend === 'down' ? 'text-red-400' : 'text-zinc-500'}`}>
                {subValue}
            </span>
        </div>
      )}
    </div>
  );
};
