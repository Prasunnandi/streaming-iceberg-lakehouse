import React from 'react';
import { Activity, Layers, History, Database, Cpu, HardDrive, Terminal } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const items = [
    { id: 'stream', label: 'Kafka Realtime Stream', icon: Activity, badge: '14.2k evt/s' },
    { id: 'medallion', label: 'Medallion Lakehouse', icon: Layers, badge: 'Bronze/Silver/Gold' },
    { id: 'timetravel', label: 'Iceberg ACID Time Travel', icon: History, badge: 'v2 Spec' },
    { id: 'dataset', label: 'NYC Taxi TLC Dataset', icon: Database, badge: 'Yellow Cab' }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/20 text-white">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide">Iceberg Lakehouse</h1>
            <p className="text-xs text-cyan-400 font-mono">Kafka + Spark Streaming</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Storage Engine
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 m-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>Iceberg v2 Catalog</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          ACID transactions, hidden partitioning, and metadata-only compaction on AWS S3 storage.
        </p>
      </div>
    </aside>
  );
}
