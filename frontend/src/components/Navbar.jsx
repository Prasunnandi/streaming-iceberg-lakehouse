import React from 'react';
import { RefreshCw, Download, Activity, Cpu, HardDrive } from 'lucide-react';

export default function Navbar({ onRefresh }) {
  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Kafka Topic:</span>
          <span className="text-cyan-300 font-mono font-semibold">nyc_taxi.telemetry.events (14.2k evt/s)</span>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>P99 Lag: 18.4ms (Watermark: 10s)</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Refresh Offsets</span>
        </button>

        <a
          href="/data/nyc_yellow_taxi_streaming_sample.csv"
          download
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Taxi Data</span>
        </a>
      </div>
    </header>
  );
}
