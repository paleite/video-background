#!/usr/bin/env bash

# This script converts PNG-images to JPG-images. It requires ImageMagick and
# jpegoptim. Internal testing yielded the best results using SD resolution and
# HQ quality.
# Usage:
#   convert-png-sequence-to-jpg-sequence.sh [--hd|--sd] [--hq|--lq] <path-to-directory>
# Examples:
#   convert-png-sequence-to-jpg-sequence.sh --sd ~/Downloads
#   convert-png-sequence-to-jpg-sequence.sh --hd ~/Downloads

set -o errexit
set -o pipefail
set -o nounset
readonly DEBUG=${DEBUG:-false}
[[ "${DEBUG}" == 'true' ]] && set -o xtrace

readonly GIT_REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$GIT_REPO_ROOT"

echo "$(tput bold)$(basename $GIT_REPO_ROOT) $(basename "${BASH_SOURCE[0]%.*}")$(tput sgr0)"

# Defaults
RESOLUTION="sd"
QUALITY="hq"

# Parse command-line options
while [[ $# -gt 0 ]]; do
  KEY="$1"
  case $KEY in
  --hd)
    RESOLUTION="hd"
    shift
    ;;
  --sd)
    RESOLUTION="sd"
    shift
    ;;
  --hq)
    quality="hq"
    shift
    ;;
  --lq)
    quality="lq"
    shift
    ;;
  *)
    WORKING_DIR="$1"
    shift
    ;;
  esac
done

# If no working directory was supplied
if [[ -z "${WORKING_DIR:-}" ]]; then
  echo "No argument supplied. Usage: $0 [--hd/--sd] [--hq/--lq] <path-to-directory>"
  exit 1
fi

# If the path doesn't exist
if [[ ! -e "$WORKING_DIR" ]]; then
  echo "Invalid path: $WORKING_DIR"
  exit 1
fi

# If the path was given as a file, use the parent directory
WORKING_DIR="$(realpath "$WORKING_DIR")"
if [[ ! -d "$WORKING_DIR" ]]; then
  WORKING_DIR="$(dirname "$WORKING_DIR")"
fi

readonly WORKING_DIR

echo "Using settings: Resolution=$RESOLUTION, Quality=$QUALITY"
echo "Processing images in directory: $WORKING_DIR"

# echo "Preparing JPG files..."
for IMAGE_INPUT_PATH in "$WORKING_DIR"/*.png; do
  if [[ -f "$IMAGE_INPUT_PATH" ]]; then
    IMAGE_INPUT_PATH_WITHOUT_EXTENSION=$(basename "${IMAGE_INPUT_PATH%.*}")
    IMAGE_OUTPUT_PATH="$WORKING_DIR/$IMAGE_INPUT_PATH_WITHOUT_EXTENSION.jpg"

    if [[ "$RESOLUTION" == "hd" ]]; then
      convert "$IMAGE_INPUT_PATH" "$IMAGE_OUTPUT_PATH"
    else
      convert -resize '891660@>' "$IMAGE_INPUT_PATH" "$IMAGE_OUTPUT_PATH"
    fi
  fi
done

# echo "Optimizing JPG files..."
if [[ "$QUALITY" == "hq" ]]; then
  jpegoptim --quiet --strip-all --all-progressive --size=100 "$IMAGE_OUTPUT_PATH"
else
  jpegoptim --quiet --strip-all --all-progressive --size=50 "$IMAGE_OUTPUT_PATH"
fi
