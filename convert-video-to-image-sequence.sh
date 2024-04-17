#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
readonly DEBUG=${DEBUG:-false}
[[ "${DEBUG}" == 'true' ]] && set -o xtrace

readonly DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo "$(tput bold)$(basename $DIR) $(basename "${BASH_SOURCE[0]%.*}")$(tput sgr0)"

# shopt -s expand_aliases # Allow user-defined aliases (e.g. from ~/.aliases)

if [ -z "${1:-}" ]; then
  echo "No argument supplied. Usage: $0 <path-to-video-file>"
  exit 1
fi

VIDEO_PATH=$(realpath "$1")
VIDEO_PATH_WITHOUT_EXTENSION=$(basename "${VIDEO_PATH%.*}")

cd "$DIR"
# echo "VIDEO_PATH: $VIDEO_PATH"
# echo "VIDEO_PATH_WITHOUT_EXTENSION: $VIDEO_PATH_WITHOUT_EXTENSION"

GIT_REPO_ROOT=$(git rev-parse --show-toplevel)
OUTPUT_DIR="${GIT_REPO_ROOT}/public/frames/$VIDEO_PATH_WITHOUT_EXTENSION"

# echo "OUTPUT_DIR: $OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# echo "Extracting frames from ${VIDEO_PATH}..."
ffmpeg -loglevel quiet -stats -i "$VIDEO_PATH" -start_number 1 "$OUTPUT_DIR/%04d.png"

# echo "Preparing JPG files..."

for IMAGE_INPUT_PATH in "$OUTPUT_DIR"/*.png; do
  if [[ -f "$IMAGE_INPUT_PATH" ]]; then
    IMAGE_INPUT_PATH_WITHOUT_EXTENSION=$(basename "${IMAGE_INPUT_PATH%.*}")
    IMAGE_OUTPUT_PATH="$OUTPUT_DIR/$IMAGE_INPUT_PATH_WITHOUT_EXTENSION.jpg"

    convert -resize '891660@>' "$IMAGE_INPUT_PATH" "$IMAGE_OUTPUT_PATH"

    rm "$IMAGE_INPUT_PATH"
  fi
done

# echo "Optimizing JPG files..."
jpegoptim --quiet --strip-all --all-progressive --size=50 "$OUTPUT_DIR"/*.jpg

# echo "Done"
