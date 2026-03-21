#!/bin/bash

# Navigate to the assets dir
ASSETS_DIR="public/assets"

# Array of videos
VIDEOS=(
  "ceremony2.mp4"
  "VID_20260320_205834_999.mp4"
  "Coffee_trees_in_202603191502.mp4"
  "Flow_202603191504.mp4"
  "Coffee_poured_from_202603191557.mp4"
  "ceremony.mp4"
)

echo "Starting FFmpeg thumbnail extraction..."

for vid in "${VIDEOS[@]}"; do
  if [ -f "$ASSETS_DIR/$vid" ]; then
    # Extract filename without extension
    name="${vid%.*}"
    poster="$ASSETS_DIR/${name}-poster.jpg"
    
    echo "Processing: $vid -> $poster"
    
    # Run ffmpeg to extract frame at 0.1s, high compression (q:v 5), -y overwrites existing
    ffmpeg -i "$ASSETS_DIR/$vid" -ss 00:00:00.100 -vframes 1 -q:v 5 "$poster" -y -loglevel error
    
    echo "    Saved $poster"
  else
    echo "Warning: $ASSETS_DIR/$vid not found!"
  fi
done

echo "Extraction complete."
