import React from 'react';
import { Activity, Zap, Cpu, Clock, CheckCircle2, Server, ArrowRight } from 'lucide-react';

export default function LiveStreamView({ metrics }) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900 border border-blue-800/40 p-6 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-medium mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Kafka + Spark Structured Streaming Realtime Ingestion</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Streaming Lakehouse Ingestion Engine
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Consuming real-time NYC Yellow Taxi GPS and fare event streams at <span className="text-cyan-400 font-semibold font-mono">14,250 events/sec</span> with micro-batch checkpointing directly into Apache Iceberg ACID tables. Consumer lag is maintained under <span className="text-emerald-400 font-semibold font-mono">18.4 milliseconds</span>.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Stream Ingestion Rate</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">
            {metrics?.currentThroughputEventsSec?.toLocaleString()} <span className="text-xs font-normal text-slate-400">evt/sec</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Zero backpressure detected</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">P99 Consumer Lag</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {metrics?.p99ConsumerLagMs} ms
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sub-second streaming SLA</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">24-Hour Processed Volume</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {(metrics?.totalEventsProcessed24h / 1000000)?.toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 16 Kafka partitions</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Active Spark Executors</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">
            {metrics?.activeSparkExecutors} Nodes
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Dynamic auto-scaling enabled</div>
        </div>
      </div>

      {/* Realtime Stream Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
          Event Pipeline Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">1. Source Fleet</span>
            <div className="font-bold text-slate-100 text-sm">NYC Taxi GPS Fleets</div>
            <div className="text-xs text-cyan-400 font-mono">13,500 Active Cabs</div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-blue-900/40 text-center space-y-1">
            <span className="text-[10px] text-blue-400 uppercase tracking-wider font-mono">2. Ingestion Topic</span>
            <div className="font-bold text-blue-200 text-sm">Kafka Cluster (MSK)</div>
            <div className="text-xs text-slate-400 font-mono">16 Partitions • 3x Replica</div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-900/40 text-center space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono">3. Stream Processing</span>
            <div className="font-bold text-cyan-200 text-sm">Spark Structured Stream</div>
            <div className="text-xs text-slate-400 font-mono">10s Watermark Window</div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-900/40 text-center space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono">4. S3 Lakehouse</span>
            <div className="font-bold text-emerald-200 text-sm">Apache Iceberg v2</div>
            <div className="text-xs text-slate-400 font-mono">Parquet ZSTD + Metastore</div>
          </div>
        </div>
      </div>
    </div>
  );
}
