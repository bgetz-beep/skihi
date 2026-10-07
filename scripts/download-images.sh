#!/usr/bin/env bash
# Download every image URL in /tmp/image-urls.txt to public/images/raw/
# Uses the filename segment after /media/ as the output filename (preserves
# the Wix content hash so cross-referencing is deterministic).
set -euo pipefail

mkdir -p public/images/raw
count=0
failed=0
while IFS= read -r url; do
  [ -z "$url" ] && continue
  filename="${url##*/}"
  out="public/images/raw/${filename}"
  if [ -f "$out" ]; then
    continue
  fi
  if curl -sfL "$url" -o "$out"; then
    count=$((count + 1))
  else
    echo "FAILED: $url" >&2
    rm -f "$out"
    failed=$((failed + 1))
  fi
done < /tmp/image-urls.txt
echo "Downloaded: $count"
echo "Failed: $failed"
