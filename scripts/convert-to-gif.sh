#!/bin/bash

# Convert Remotion MP4 videos to GitHub-ready GIFs
# Usage: ./scripts/convert-to-gif.sh

set -e

# Create assets directory
mkdir -p docs/assets

# GIF settings
FPS=12           # Lower FPS = smaller file
SCALE=480        # Width in pixels (-1 maintains aspect ratio)

echo "Converting MP4 videos to GIFs..."

for video in out/*.mp4; do
    if [ -f "$video" ]; then
        filename=$(basename "$video" .mp4)
        output="docs/assets/${filename}.gif"

        echo "Converting: $filename"

        # Two-pass conversion for better quality and smaller size
        ffmpeg -y -i "$video" \
            -vf "fps=${FPS},scale=${SCALE}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" \
            -loop 0 \
            "$output"

        # Get file size
        size=$(ls -lh "$output" | awk '{print $5}')
        echo "  Created: $output ($size)"
    fi
done

echo ""
echo "All conversions complete! GIFs saved to docs/assets/"
echo ""
echo "Add to README.md:"
echo ""
for gif in docs/assets/*.gif; do
    if [ -f "$gif" ]; then
        filename=$(basename "$gif" .gif)
        title=$(echo "$filename" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
        echo "### $title"
        echo "![${title}](${gif})"
        echo ""
    fi
done
