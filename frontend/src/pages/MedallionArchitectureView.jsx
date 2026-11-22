import React from 'react';
import { Layers, HardDrive, Database, CheckCircle2, ShieldCheck, ArrowDown } from 'lucide-react';

export default function MedallionArchitectureView({ layers }) {
  const getLayerBorder = (index) => {
    if (index === 0) return 'border-amber-700/50 bg-amber-950/10';
    if (index === 1) return 'border-slate-700 bg-slate-900/60';
    return 'border-emerald-600/50 bg-emerald-950/15';
  };

  const getLayerBadge = (index) => {
    if (index === 0) return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    if (index === 1) return 'bg-slate-700 text-slate-200 border border-slate-600';
    return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Apache Iceberg Medallion Lakehouse Tiers</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Multi-hop lakehouse pattern enforcing data quality, idempotency, and partition pruning across Bronze, Silver, and Gold Parquet layers on object storage.
        </p>
      </div>

      {/* Layer Cards */}
      <div className="space-y-4">
        {layers?.map((layer, idx) => (
          <div key={layer.layer} className={`border rounded-xl p-5 ${getLayerBorder(idx)}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${getLayerBadge(idx)}`}>
                    {layer.layer.split(' ')[0]}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm">{layer.layer}</h3>
                </div>
                <div className="text-xs text-cyan-400 font-mono mt-1">{layer.table}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 bg-slate-950 text-slate-300 rounded font-mono border border-slate-800">
                  {layer.format}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Row Count:</span>
                <span className="font-mono text-base font-bold text-slate-200 mt-0.5 block">
                  {layer.recordsCount.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Storage Footprint:</span>
                <span className="font-mono text-base font-bold text-emerald-400 mt-0.5 block">
                  {layer.storageSizeGb} GB
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Data Files:</span>
                <span className="font-mono text-base font-bold text-cyan-300 mt-0.5 block">
                  {layer.filesCount} Parquet
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Partition Spec:</span>
                <span className="font-mono text-xs font-semibold text-violet-300 mt-0.5 block truncate">
                  {layer.partitioning}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
              {layer.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
