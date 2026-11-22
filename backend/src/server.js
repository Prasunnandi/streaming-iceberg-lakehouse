import express from 'express';
import cors from 'cors';
import { streamingMetrics, medallionLayers, icebergSnapshots } from './data.js';

const app = express();
const PORT = process.env.PORT || 8005;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'streaming-iceberg-lakehouse', timestamp: new Date().toISOString() });
});

app.get('/api/stream-status', (req, res) => {
  res.json({
    metrics: streamingMetrics
  });
});

app.get('/api/medallion', (req, res) => {
  res.json({
    layers: medallionLayers,
    totalLakehouseStorageGb: Number(medallionLayers.reduce((acc, l) => acc + l.storageSizeGb, 0).toFixed(2))
  });
});

app.get('/api/snapshots', (req, res) => {
  res.json({
    snapshots: icebergSnapshots,
    currentSnapshotId: icebergSnapshots[0].snapshotId
  });
});

// Time Travel Simulation Query
app.post('/api/time-travel', (req, res) => {
  const { snapshotId = '718291029381920192' } = req.body;
  const snapshot = icebergSnapshots.find(s => s.snapshotId === snapshotId) || icebergSnapshots[1];

  res.json({
    query: `SELECT COUNT(*), AVG(fare_amount) FROM lakehouse.nyc_taxi.silver_trips FOR SYSTEM_VERSION AS OF ${snapshot.snapshotId}`,
    snapshotId: snapshot.snapshotId,
    timestamp: snapshot.timestamp,
    operation: snapshot.operation,
    historicalRecordCount: snapshot.recordsCount,
    historicalAvgFare: 14.82,
    queryExecutionTimeMs: 42
  });
});

app.listen(PORT, () => {
  console.log(`Streaming Iceberg Lakehouse API running on port ${PORT}`);
});
