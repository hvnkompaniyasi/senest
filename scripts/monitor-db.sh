#!/bin/bash
# Monitoring script for Senest (every 6 hours via cron)
# Checks: site (curl), DB connection (node), Telegram alert on error

SITE_URL="https://www.senest.uz"
API_URL="https://www.senest.uz/api/listings"
DB_CHECK_CMD="DATABASE_URL=postgresql://postgres:NdNBDwZvDiTHKXdTDuxsWnjOgwUevcHw@metro.proxy.rlwy.net:29091/railway?pgbouncer=true&connection_limit=1&sslmode=require node -e 'const p=require(\"@prisma/client\").PrismaClient; const pr=new p({datasources:{db:{url:process.env.DATABASE_URL}}}); pr.listing.count().then(c=>{console.log(\"DB COUNT:\",c);process.exit(0);}).catch(e=>{console.error(\"DB ERROR:\",e.message);process.exit(1);});'"

TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHAT_ID="${TELEGRAM_CHAT_ID:-7897925720}"

LOG_FILE="/opt/data/backups/monitor-log.log"
ERRORS=0
MESSAGES=()

# Site check
SITE_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$SITE_URL")
if [ "$SITE_CODE" != "200" ]; then
  ERRORS=$((ERRORS + 1))
  MESSAGES+=("❌ Site $SITE_URL: HTTP $SITE_CODE")
else
  MESSAGES+=("✅ Site $SITE_URL: HTTP 200")
fi

# API check
API_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$API_URL")
if [ "$API_CODE" != "200" ]; then
  ERRORS=$((ERRORS + 1))
  MESSAGES+=("❌ API $API_URL: HTTP $API_CODE")
else
  MESSAGES+=("✅ API $API_URL: HTTP 200")
fi

# DB check
DB_RESULT=$(eval "$DB_CHECK_CMD" 2>/dev/null)
if echo "$DB_RESULT" | grep -q "DB ERROR"; then
  ERRORS=$((ERRORS + 1))
  MESSAGES+=("❌ Railway DB connection failed")
else
  DB_COUNT=$(echo "$DB_RESULT" | grep "DB COUNT" | awk '{print $NF}')
  MESSAGES+=("✅ DB connection OK (count: $DB_COUNT)")
fi

# Log
{
  echo "--- Monitor $(date '+%Y-%m-%d %H:%M:%S') ---"
  for msg in "${MESSAGES[@]}"; do echo "$msg"; done
  echo "Errors: $ERRORS"
} >> "$LOG_FILE"

# Telegram notification only on errors (to avoid spam)
if [ "$ERRORS" -gt 0 ]; then
  MSG_TEXT="❌ Senest Monitor Alert ($SITE_URL) — Errors: $ERRORS\n$(printf '%s\n' "${MESSAGES[@]}")"
  if [ -n "$TELEGRAM_TOKEN" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
      -d "chat_id=${CHAT_ID}" \
      -d "text=${MSG_TEXT}" >/dev/null || true
  fi
  echo "ALERT SENT (errors: $ERRORS)" >> "$LOG_FILE"
else
  echo "ALERT NOT NEEDED (all OK)" >> "$LOG_FILE"
fi

echo "Monitor complete. Errors: $ERRORS"
