#!/usr/bin/env bash
# ==============================================================================
# Digital Twin AI — Automated MongoDB Atlas Restore Script
# Requires: mongodb-database-tools (mongorestore)
# ==============================================================================

set -e

BACKUP_DIR=$1

if [ -z "${BACKUP_DIR}" ]; then
  echo "❌ Error: Please specify the backup directory to restore."
  echo "Usage: ./db_restore.sh ./backups/atlas_backup_YYYY-MM-DD_HH-MM-SS"
  exit 1
fi

if [ -z "$MONGODB_URI" ]; then
  echo "❌ Error: MONGODB_URI environment variable is not set."
  exit 1
fi

echo "⚠️  WARNING: You are about to restore archive '${BACKUP_DIR}' to destination cluster!"
read -p "Are you sure you want to proceed? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
  echo "Aborted restore operation."
  exit 0
fi

echo "⏳ Starting mongorestore to MongoDB Atlas..."
mongorestore --uri="${MONGODB_URI}" --dir="${BACKUP_DIR}" --gzip --drop

echo "✅ Database restore completed successfully!"
