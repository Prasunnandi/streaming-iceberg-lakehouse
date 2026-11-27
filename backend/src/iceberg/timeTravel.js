/**
 * Apache Iceberg Time-Travel Query Engine
 * Enables point-in-time table state resolution via historical snapshot IDs,
 * millisecond timestamps (AS OF TIMESTAMP), and snapshot differential delta calculations.
 */

export class IcebergTimeTravelEngine {
  /**
   * @param {Object} metadata - Iceberg Table Metadata v2 document or IcebergMetadataWriter instance
   * @param {Map<number, Array<Object>>|Object} [snapshotDataStore] - Optional map of snapshotId -> records
   */
  constructor(metadata, snapshotDataStore = {}) {
    this.metadata = metadata && typeof metadata.buildMetadataJson === 'function'
      ? metadata.buildMetadataJson()
      : metadata;

    this.dataStore = snapshotDataStore instanceof Map
      ? snapshotDataStore
      : new Map(Object.entries(snapshotDataStore).map(([k, v]) => [Number(k), v]));
  }

  /**
   * Get all snapshots in chronological order
   */
  getSnapshotHistory() {
    const snapshots = this.metadata.snapshots || [];
    return [...snapshots].sort((a, b) => (a['timestamp-ms'] || 0) - (b['timestamp-ms'] || 0));
  }

  /**
   * Resolve table state at a specific snapshot ID (VERSION AS OF <snapshot_id>)
   * @param {number|string} snapshotId - Iceberg 64-bit snapshot ID
   * @returns {Object} Snapshot metadata and associated dataset state
   */
  asOfSnapshotId(snapshotId) {
    const targetId = Number(snapshotId);
    const snapshots = this.metadata.snapshots || [];
    const matched = snapshots.find((s) => Number(s['snapshot-id']) === targetId);

    if (!matched) {
      const validIds = snapshots.map((s) => s['snapshot-id']).join(', ');
      throw new Error(
        `Snapshot ID ${snapshotId} not found in table history. Available snapshots: [${validIds}]`
      );
    }

    const records = this.dataStore.get(targetId) || [];

    return {
      snapshotId: targetId,
      timestampMs: matched['timestamp-ms'],
      timestampIso: new Date(matched['timestamp-ms']).toISOString(),
      parentSnapshotId: matched['parent-snapshot-id'] || null,
      operation: matched.summary ? matched.summary.operation : 'unknown',
      summary: matched.summary || {},
      manifestList: matched['manifest-list'] || null,
      recordCount: records.length,
      records: [...records]
    };
  }

  /**
   * Resolve table state at a specific point in time (TIMESTAMP AS OF <timestamp>)
   * Finds the latest snapshot committed at or before the requested timestamp.
   * @param {string|number|Date} timestamp - ISO string or epoch milliseconds
   * @returns {Object} Resolved snapshot and dataset state
   */
  asOfTimestamp(timestamp) {
    const targetMs = typeof timestamp === 'number'
      ? timestamp
      : timestamp instanceof Date
      ? timestamp.getTime()
      : new Date(timestamp).getTime();

    if (isNaN(targetMs)) {
      throw new Error(`Invalid timestamp format: "${timestamp}"`);
    }

    const history = this.getSnapshotHistory();
    if (history.length === 0) {
      throw new Error('Table has no committed snapshots.');
    }

    const earliestMs = history[0]['timestamp-ms'];
    if (targetMs < earliestMs) {
      throw new Error(
        `Requested timestamp ${new Date(targetMs).toISOString()} precedes earliest table snapshot at ${new Date(earliestMs).toISOString()}`
      );
    }

    // Find the latest snapshot where timestamp-ms <= targetMs
    let resolvedSnapshot = null;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i]['timestamp-ms'] <= targetMs) {
        resolvedSnapshot = history[i];
        break;
      }
    }

    if (!resolvedSnapshot) {
      resolvedSnapshot = history[0];
    }

    return this.asOfSnapshotId(resolvedSnapshot['snapshot-id']);
  }

  /**
   * Compute changes between two snapshots (Incremental Query / CDC Delta)
   * @param {number|string} fromSnapshotId
   * @param {number|string} toSnapshotId
   */
  timeTravelDiff(fromSnapshotId, toSnapshotId) {
    const fromState = this.asOfSnapshotId(fromSnapshotId);
    const toState = this.asOfSnapshotId(toSnapshotId);

    const fromRecords = fromState.records;
    const toRecords = toState.records;

    const fromMap = new Map(fromRecords.map((r) => [r.id || JSON.stringify(r), r]));
    const toMap = new Map(toRecords.map((r) => [r.id || JSON.stringify(r), r]));

    const inserted = [];
    const updated = [];
    const deleted = [];

    // Check records in toState
    for (const [key, record] of toMap.entries()) {
      if (!fromMap.has(key)) {
        inserted.push(record);
      } else {
        const oldRecord = fromMap.get(key);
        if (JSON.stringify(oldRecord) !== JSON.stringify(record)) {
          updated.push({ previous: oldRecord, current: record });
        }
      }
    }

    // Check deleted records
    for (const [key, oldRecord] of fromMap.entries()) {
      if (!toMap.has(key)) {
        deleted.push(oldRecord);
      }
    }

    return {
      fromSnapshotId: Number(fromSnapshotId),
      toSnapshotId: Number(toSnapshotId),
      fromTimestamp: fromState.timestampIso,
      toTimestamp: toState.timestampIso,
      netRecordChange: toRecords.length - fromRecords.length,
      metrics: {
        insertedCount: inserted.length,
        updatedCount: updated.length,
        deletedCount: deleted.length
      },
      changes: {
        inserted,
        updated,
        deleted
      }
    };
  }

  /**
   * Execute query with filter predicate against historical table state
   * @param {Object} options
   * @param {number} [options.snapshotId]
   * @param {string|number} [options.timestamp]
   * @param {Function} [options.predicate] - Filtering predicate (record => boolean)
   */
  queryAsOf(options = {}) {
    const { snapshotId, timestamp, predicate = () => true } = options;

    let snapshotState;
    if (snapshotId !== undefined) {
      snapshotState = this.asOfSnapshotId(snapshotId);
    } else if (timestamp !== undefined) {
      snapshotState = this.asOfTimestamp(timestamp);
    } else {
      // Default to latest current snapshot
      const currentId = this.metadata['current-snapshot-id'];
      if (!currentId) throw new Error('No current snapshot available in table metadata');
      snapshotState = this.asOfSnapshotId(currentId);
    }

    const matchingRecords = snapshotState.records.filter(predicate);

    return {
      resolvedSnapshotId: snapshotState.snapshotId,
      timestampIso: snapshotState.timestampIso,
      totalRecordsInSnapshot: snapshotState.records.length,
      matchedRecordsCount: matchingRecords.length,
      results: matchingRecords
    };
  }
}

// Dual ESM & CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IcebergTimeTravelEngine
  };
}

export default IcebergTimeTravelEngine;
