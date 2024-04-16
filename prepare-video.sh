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
  exit 1;
fi

VIDEO_PATH=$(realpath "$1")
VIDEO_PATH_WITHOUT_EXTENSION=$(basename "${VIDEO_PATH%.*}")

cd "$DIR"
ffmpeg -i "$VIDEO_PATH"  -frames:v 1 -q:v 2 ./public/"$VIDEO_PATH_WITHOUT_EXTENSION"-poster.jpg ;

ffmpeg -i "$VIDEO_PATH" -an -vf scale=376:668 -movflags faststart -vcodec libx264 -g 1 -pix_fmt yuv420p ./public/"$VIDEO_PATH_WITHOUT_EXTENSION".mp4;

open ./public/
