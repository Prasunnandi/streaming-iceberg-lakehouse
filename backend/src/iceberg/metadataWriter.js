/**
 * Apache Iceberg Table Metadata v2 Specification Generator
 * Emits compliant Iceberg v2 table metadata, tracking schemas, partition specs, snapshots, and manifest lists.
 */

export class IcebergMetadataWriter {
  /**
   * @param {Object} options
   * @param {string} options.tableUuid - Unique table UUID
   * @param {string} options.location - S3/GCS/Warehouse base URI
   * @param {Array<Object>} options.schemaFields - Table schema columns [{ id, name, type, required }]
   */
  constructor(options = {}) {
    this.tableUuid = options.tableUuid || this._generateUuid();
    this.location = options.location || 's3://lakehouse-warehouse/default_db/table_v2';
    this.schemaFields = options.schemaFields || [
      { id: 1, name: 'id', required: true, type: 'string' },
      { id: 2, name: 'created_at', required: true, type: 'timestamptz' }
    ];

    this.snapshots = [];
    this.snapshotLog = [];
    this.lastSequenceNumber = 0;
    this.currentSnapshotId = null;
    this.lastUpdatedMs = Date.now();
  }

  /**
   * Generate current Iceberg Table Metadata v2 JSON document
   * @returns {Object} Compliant Iceberg Table Metadata v2 JSON
   */
  buildMetadataJson() {
    return {
      'format-version': 2,
      'table-uuid': this.tableUuid,
      'location': this.location,
      'last-sequence-number': this.lastSequenceNumber,
      'last-updated-ms': this.lastUpdatedMs,
      'last-column-id': Math.max(...this.schemaFields.map(f => f.id || 1)),
      'current-schema-id': 0,
      'schemas': [
        {
          'type': 'struct',
          'schema-id': 0,
          'fields': this.schemaFields
        }
      ],
      'default-spec-id': 0,
      'partition-specs': [
        {
          'spec-id': 0,
          'fields': []
        }
      ],
      'last-partition-id': 999,
      'default-sort-order-id': 0,
      'sort-orders': [
        {
          'order-id': 0,
          'fields': []
        }
      ],
      'properties': {
        'write.format.default': 'parquet',
        'write.parquet.compression-codec': 'zstd',
        'history.expire.max-snapshot-age-ms': '604800000' // 7 days
      },
      'current-snapshot-id': this.currentSnapshotId,
      'snapshots': this.snapshots,
      'snapshot-log': this.snapshotLog
    };
  }

  /**
   * Commit a new atomic snapshot (e.g. streaming batch append)
   * @param {Object} commitInfo
   * @param {string} [commitInfo.operation='append'] - 'append', 'overwrite', or 'delete'
   * @param {number} commitInfo.addedRecords - Number of data rows inserted
   * @param {number} commitInfo.addedFilesCount - Number of new Parquet files
   * @param {number} commitInfo.addedDataBytes - Total file byte size
   * @returns {Object} Newly committed snapshot metadata
   */
  commitSnapshot(commitInfo) {
    this.lastSequenceNumber++;
    this.lastUpdatedMs = Date.now();
    const snapshotId = Math.floor(Math.random() * 9007199254740991); // 64-bit integer

    const manifestListPath = `${this.location}/metadata/snap-${snapshotId}-${this.lastSequenceNumber}.avro`;

    const snapshot = {
      'sequence-number': this.lastSequenceNumber,
      'snapshot-id': snapshotId,
      'parent-snapshot-id': this.currentSnapshotId,
      'timestamp-ms': this.lastUpdatedMs,
      'summary': {
        'operation': commitInfo.operation || 'append',
        'added-records': String(commitInfo.addedRecords || 0),
        'added-data-files': String(commitInfo.addedFilesCount || 1),
        'added-files-size-bytes': String(commitInfo.addedDataBytes || 0),
        'changed-partition-count': '1',
        'total-records': String(
          (this.currentSnapshot ? Number(this.currentSnapshot.summary['total-records'] || 0) : 0) + (commitInfo.addedRecords || 0)
        )
      },
      'manifest-list': manifestListPath,
      'schema-id': 0
    };

    this.snapshots.push(snapshot);
    this.snapshotLog.push({
      'timestamp-ms': this.lastUpdatedMs,
      'snapshot-id': snapshotId
    });

    this.currentSnapshotId = snapshotId;
    this.currentSnapshot = snapshot;

    return snapshot;
  }

  _generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export default IcebergMetadataWriter;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IcebergMetadataWriter;
  module.exports.IcebergMetadataWriter = IcebergMetadataWriter;
}
