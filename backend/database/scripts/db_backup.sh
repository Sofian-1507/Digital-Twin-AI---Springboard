#!/usr/bin/env bash
# ==============================================================================
# Digital Twin AI — Automated MongoDB Atlas Backup Script
# Requires: mongodb-database-tools (mongodump)
# ==============================================================================

set -e

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="./backups/atlas_backup_${TIMESTAMP}"

if [ -z "$MONGODB_URI" ]; then
  echo "❌ Error: MONGODB_URI environment variable is not set."
  echo "Usage: export MONGODB_URI='mongodb+srv://user:pass@cluster.mongodb.net' && ./db_backup.sh"
  exit 1
fi

echo "⏳ Starting mongodump backup from Atlas Cluster to ${BACKUP_DIR}..."
mkdir -p "${BACKUP_DIR}"

mongodump --uri="${MONGODB_URI}" --out="${BACKUP_DIR}" --gzip

echo "✅ Backup completed successfully! Archive saved at: ${BACKUP_DIR}"
