#!/usr/bin/env bash
# MUNKEE STUDIO - S3 / R2 / CDN Static Application Deployment Script

set -e

S3_BUCKET=${S3_BUCKET:-"s3://munkee-studio-apps"}
AWS_ENDPOINT=${AWS_ENDPOINT:-""}

echo "[S3Deploy] Deploying built application distributions to ${S3_BUCKET}..."

DIST_DIR="./dist/apps"

if [ ! -d "$DIST_DIR" ]; then
  echo "[S3Deploy Error] Distribution directory $DIST_DIR does not exist. Run 'npm run build:all' first."
  exit 1
fi

# Sync static assets with long max-age cache control
aws s3 sync "$DIST_DIR" "$S3_BUCKET/apps" \
  --exclude "*manifest.json" \
  --cache-control "public, max-age=31536000, immutable" \
  ${AWS_ENDPOINT:+--endpoint-url $AWS_ENDPOINT}

# Sync manifests with no-cache header
aws s3 sync "$DIST_DIR" "$S3_BUCKET/apps" \
  --exclude "*" \
  --include "*manifest.json" \
  --cache-control "no-cache, must-revalidate" \
  ${AWS_ENDPOINT:+--endpoint-url $AWS_ENDPOINT}

echo "[S3Deploy] Deployment complete!"
