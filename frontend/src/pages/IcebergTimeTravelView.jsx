import React, { useState } from 'react';
import { History, Play, Terminal, CheckCircle2, RefreshCw, HardDrive, Cpu } from 'lucide-react';
import { runTimeTravelQuery } from '../services/api';

export default function IcebergTimeTravelView({ snapshots }) {
  const [selectedSnapshot, setSelectedSnapshot] = useState(snapshots?.[0]?.snapshotId || '849204918204928190');
  const [queryResult, setQueryResult] = useState({
    query: `SELECT COUNT(*), AVG(fare_amount) FROM lakehouse.nyc_taxi.silver_trips FOR SYSTEM_VERSION AS OF 849204918204928190`,
    snapshotId: '849204918204928190',
    timestamp: '2026-02-20T14:30:00Z',
    operation: 'replace (Compaction)',
    historicalRecordCount: 41250800,
    historicalAvgFare: 14.82,
    queryExecutionTimeMs: 38
  });
  const [executing, setExecuting] = useState(false);

  const handleRunQuery = async (snapId) => {
    setSelectedSnapshot(snapId);
    setExecuting(true);
    const res = await runTimeTravelQuery(snapId);
    if (res) {
      setQueryResult(res);
    } else {
      const snap = snapshots?.find(s => s.snapshotId === snapId) || snapshots?.[0];
      setQueryResult({
        query: `SELECT COUNT(*), AVG(fare_amount) FROM lakehouse.nyc_taxi.silver_trips FOR SYSTEM_VERSION AS OF ${snap.snapshotId}`,
        snapshotId: snap.snapshotId,
        timestamp: snap.timestamp,
        operation: snap.operation,
        historicalRecordCount: snap.recordsCount,
        historicalAvgFare: 14.82,
        queryExecutionTimeMs: 42
      });
    }
    setExecuting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <History className="w-5 h-5 text-cyan-400" />
          <span>Apache Iceberg ACID Snapshots & Time Travel</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Iceberg maintains atomic snapshot trees. Run SQL queries against any historical table state using <code className="text-cyan-300 font-mono">FOR SYSTEM_VERSION AS OF</code> without duplicating underlying Parquet data files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Snapshot History Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
            Table Snapshot Manifest Ledger
          </h3>

          <div className="space-y-3">
            {snapshots?.map((snap) => {
              const isSelected = selectedSnapshot === snap.snapshotId;
              return (
                <div
                  key={snap.snapshotId}
                  onClick={() => handleRunQuery(snap.snapshotId)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500/50 shadow-sm shadow-blue-950'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-cyan-300">Snapshot ID: {snap.snapshotId}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Committed: {snap.timestamp}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {snap.operation}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 my-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Added Files:</span>
                      <span className="font-mono text-emerald-400">+{snap.addedFiles} Parquet</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Deleted Files:</span>
                      <span className="font-mono text-rose-400">-{snap.deletedFiles} Parquet</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Total Records:</span>
                      <span className="font-mono text-slate-200">{snap.recordsCount.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    {snap.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Travel Query Runner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-xs text-slate-200">Interactive Time Travel Query</h3>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed break-all">
              {queryResult.query}
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target Snapshot:</span>
                <span className="font-mono text-slate-200">{queryResult.snapshotId.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Snapshot Timestamp:</span>
                <span className="font-mono text-slate-200">{queryResult.timestamp}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Historical Row Count:</span>
                <span className="font-mono text-emerald-400 font-bold">{queryResult.historicalRecordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Historical Avg Fare:</span>
                <span className="font-mono text-slate-200 font-bold">${queryResult.historicalAvgFare}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Engine Query Latency:</span>
                <span className="font-mono text-cyan-300">{queryResult.queryExecutionTimeMs} ms</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRunQuery(selectedSnapshot)}
            disabled={executing}
            className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{executing ? 'Executing Query...' : 'Execute Time Travel Query'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
