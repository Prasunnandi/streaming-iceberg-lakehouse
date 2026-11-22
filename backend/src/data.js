// Streaming Kafka, Apache Iceberg Medallion, and ACID Snapshot Data

export const streamingMetrics = {
  kafkaCluster: 'msk-prod-lakehouse-east1',
  topic: 'nyc_taxi.telemetry.events',
  currentThroughputEventsSec: 14250,
  p99ConsumerLagMs: 18.4,
  watermarkDelaySec: 10,
  totalEventsProcessed24h: 42890120,
  activeSparkExecutors: 24,
  clusterState: 'HEALTHY_STREAMING'
};

export const medallionLayers = [
  {
    layer: 'Bronze (Raw Append-Only)',
    table: 'lakehouse.nyc_taxi.bronze_trips',
    format: 'Apache Iceberg v2 / Parquet',
    recordsCount: 42890120,
    storageSizeGb: 8.42,
    filesCount: 184,
    partitioning: 'date(pickup_datetime)',
    description: 'Raw streaming event log from Kafka. Schema-on-read with exact original wire payload.'
  },
  {
    layer: 'Silver (Cleaned & De-duplicated)',
    table: 'lakehouse.nyc_taxi.silver_trips',
    format: 'Apache Iceberg v2 / Parquet (ZSTD)',
    recordsCount: 41250800,
    storageSizeGb: 5.14,
    filesCount: 48,
    partitioning: 'pickup_date, vendor_id',
    description: 'Enforced schemas, GPS bounding-box filters, outliers dropped (fare > $500), duplicate trip IDs pruned via MERGE INTO.'
  },
  {
    layer: 'Gold (Aggregated Analytics Data Mart)',
    table: 'lakehouse.nyc_taxi.gold_hourly_zone_metrics',
    format: 'Apache Iceberg v2 / Parquet',
    recordsCount: 1248000,
    storageSizeGb: 0.18,
    filesCount: 6,
    partitioning: 'date, pickup_borough',
    description: 'Pre-aggregated hourly trip counts, average tip percentage, revenue per mile, and congestion charge yields.'
  }
];

export const icebergSnapshots = [
  {
    snapshotId: '849204918204928190',
    timestamp: '2026-02-20T14:30:00Z',
    operation: 'replace (Compaction)',
    addedFiles: 6,
    deletedFiles: 42,
    recordsCount: 41250800,
    manifestFile: 'snap-849204918204928190-2-manifest.avro',
    details: 'Small file compaction rewritten into 128MB Parquet chunks. Query speedup: 4.8x.'
  },
  {
    snapshotId: '718291029381920192',
    timestamp: '2026-02-20T12:00:00Z',
    operation: 'append (Stream Batch)',
    addedFiles: 14,
    deletedFiles: 0,
    recordsCount: 40120000,
    manifestFile: 'snap-718291029381920192-1-manifest.avro',
    details: 'Structured streaming micro-batch commit from Spark streaming interval.'
  },
  {
    snapshotId: '601928401928401928',
    timestamp: '2026-02-20T06:00:00Z',
    operation: 'overwrite (Late Arriving Fix)',
    addedFiles: 4,
    deletedFiles: 2,
    recordsCount: 38900000,
    manifestFile: 'snap-601928401928401928-1-manifest.avro',
    details: 'Late-arriving JFK airport GPS telemetry reconciled with idempotency lock.'
  }
];
