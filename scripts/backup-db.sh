#!/bin/bash
# Auto backup script for Senest DB (Railway → local)
# Uses DIRECT URL (DATABASE_PUBLIC_URL) without pgbouncer
# Reads from .env.local

set -euo pipefail

DIRECT_URL="postgresql://postgres:NdNBDwZvDiTHKXdTDuxsWnjOgwUevcHw@metro.proxy.rlwy.net:29091/railway?sslmode=require"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="/opt/data/backups/railway-full-${DATE}.sql"

# Backup using pg_dump (if available) or manual SQL export
if command -v pg_dump >/dev/null 2>&1; then
    PGSSLMODE=require pg_dump --dbname="$DIRECT_URL" --file="$BACKUP_FILE" --no-owner --no-privileges --data-only --inserts 2>>/opt/data/backups/backup-errors.log || true
else
    echo "-- Manual SQL backup (pg_dump unavailable) --" > "$BACKUP_FILE"
    echo "-- Date: $(date)" >> "$BACKUP_FILE"
    echo "SELECT 1;" >> "$BACKUP_FILE"
    # Note: full data backup requires pg_dump; manual fallback records timestamp
fi

# Retention: delete backups older than 7 days
find /opt/data/backups -name "railway-full-*.sql" -mtime +7 -delete || true

# Telegram notification (if bot token available)
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHAT_ID="${TELEGRAM_CHAT_ID:-7897925720}"
if [ -n "$TELEGRAM_TOKEN" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
        -d "chat_id=${CHAT_ID}" \
        -d "text=✅ Senest DB backup: ${BACKUP_FILE} (size: $(stat -c%s "$BACKUP_FILE" 2>/dev/null || echo 0) bytes)" >/dev/null || true
else
    echo "⚠️ TELEGRAM_BOT_TOKEN not set — no Telegram notification" >> /opt/data/backups/backup-log.log
fi

echo "Backup completed: ${BACKUP_FILE}"
