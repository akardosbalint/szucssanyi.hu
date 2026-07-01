#!/usr/bin/env bash
# Workaround for sandboxes where Node's proxy client resets mid-download for
# large binaries but plain curl through the same proxy works fine.
# Only needed if `npx prisma generate` / `npx prisma migrate dev` fails with
# ECONNRESET while fetching the query/schema engine.
set -euo pipefail

HASH=$(node -e "console.log(require('@prisma/engines-version/package.json').prisma.enginesVersion)")
TARGET=debian-openssl-3.0.x
BASE_URL="https://binaries.prisma.sh/all_commits/${HASH}/${TARGET}"
TMP_DIR=$(mktemp -d)

curl_opts=(-sS -o)
if [ -n "${HTTPS_PROXY:-}" ] && [ -f /root/.ccr/ca-bundle.crt ]; then
  curl_opts=(-sS --cacert /root/.ccr/ca-bundle.crt -x "$HTTPS_PROXY" -o)
fi

echo "Fetching engines for ${HASH} (${TARGET})..."
curl "${curl_opts[@]}" "${TMP_DIR}/schema-engine.gz" "${BASE_URL}/schema-engine.gz"
curl "${curl_opts[@]}" "${TMP_DIR}/libquery_engine.so.node.gz" "${BASE_URL}/libquery_engine.so.node.gz"

gunzip -c "${TMP_DIR}/schema-engine.gz" > "node_modules/@prisma/engines/schema-engine-${TARGET}"
chmod +x "node_modules/@prisma/engines/schema-engine-${TARGET}"
gunzip -c "${TMP_DIR}/libquery_engine.so.node.gz" > "node_modules/@prisma/engines/libquery_engine-${TARGET}.so.node"
gunzip -c "${TMP_DIR}/libquery_engine.so.node.gz" > "node_modules/prisma/libquery_engine-${TARGET}.so.node"

rm -rf "${TMP_DIR}"
echo "Done. You can now run: npx prisma generate"
