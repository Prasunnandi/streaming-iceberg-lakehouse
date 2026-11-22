import React from 'react';
import { Database, Table, ExternalLink } from 'lucide-react';

export default function NycTaxiDatasetView() {
  const sampleTrips = [
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:13:10', pass: 1, dist: '1.26 mi', fare: '$6.50', tip: '$1.56', total: '$9.36' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:36:10', pass: 1, dist: '7.39 mi', fare: '$26.00', tip: '$1.00', total: '$28.30' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:23:23', pass: 1, dist: '3.10 mi', fare: '$13.50', tip: '$2.96', total: '$17.76' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:17:34', pass: 1, dist: '2.17 mi', fare: '$10.00', tip: '$2.26', total: '$13.56' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:16:02', pass: 1, dist: '1.60 mi', fare: '$8.50', tip: '$0.00', total: '$9.80' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:11:08', pass: 1, dist: '0.90 mi', fare: '$5.50', tip: '$0.00', total: '$6.80' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:39:27', pass: 5, dist: '12.80 mi', fare: '$36.50', tip: '$2.00', total: '$41.80' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:28:42', pass: 1, dist: '4.24 mi', fare: '$17.50', tip: '$3.76', total: '$22.56' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:49:25', pass: 1, dist: '8.40 mi', fare: '$32.00', tip: '$6.76', total: '$40.56' },
    { vendor: 2, pickup: '2016-06-09 21:06:36', dropoff: '2016-06-09 21:15:43', pass: 1, dist: '1.47 mi', fare: '$8.00', tip: '$1.86', total: '$11.16' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Official NYC TLC Open Data</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">NYC Yellow Taxi Streaming Trip Benchmark</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real GPS coordinate tracking, timestamps, passenger loads, trip distances, and toll/fare amounts streaming into Apache Iceberg storage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Sample Stream Rows</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">999</div>
          <div className="text-[11px] text-slate-500 mt-1">In data/ directory</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Stream Telemetry Features</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">19 Fields</div>
          <div className="text-[11px] text-slate-500 mt-1">Coordinates, distance, fare</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Iceberg Table Format</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">v2 Spec</div>
          <div className="text-[11px] text-slate-500 mt-1">Parquet ZSTD storage</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Dataset File Footprint</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">157 KB</div>
          <div className="text-[11px] text-slate-500 mt-1">Raw telemetry sample</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-xs text-slate-200">Sample Records (First 10 of 999)</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">nyc_yellow_taxi_streaming_sample.csv</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-4">Vendor</th>
                <th className="py-2.5 px-4">Pickup Time</th>
                <th className="py-2.5 px-4">Dropoff Time</th>
                <th className="py-2.5 px-4 text-center">Pass</th>
                <th className="py-2.5 px-4 text-right">Trip Distance</th>
                <th className="py-2.5 px-4 text-right">Fare</th>
                <th className="py-2.5 px-4 text-right">Tip</th>
                <th className="py-2.5 px-4 text-right font-bold text-white">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              {sampleTrips.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 text-slate-400">Vendor #{t.vendor}</td>
                  <td className="py-2 px-4 text-slate-300">{t.pickup}</td>
                  <td className="py-2 px-4 text-slate-300">{t.dropoff}</td>
                  <td className="py-2 px-4 text-center">{t.pass}</td>
                  <td className="py-2 px-4 text-right text-cyan-300">{t.dist}</td>
                  <td className="py-2 px-4 text-right">{t.fare}</td>
                  <td className="py-2 px-4 text-right text-emerald-400">{t.tip}</td>
                  <td className="py-2 px-4 text-right font-bold text-white">{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
