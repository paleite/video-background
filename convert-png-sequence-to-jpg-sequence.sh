#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
readonly DEBUG=${DEBUG:-false}
[[ "${DEBUG}" == 'true' ]] && set -o xtrace

# readonly DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
readonly GIT_REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$GIT_REPO_ROOT"

echo "$(tput bold)$(basename $GIT_REPO_ROOT) $(basename "${BASH_SOURCE[0]%.*}")$(tput sgr0)"

# shopt -s expand_aliases # Allow user-defined aliases (e.g. from ~/.aliases)

if [ -z "${1:-}" ]; then
  echo "No argument supplied. Usage: $0 <path-to-video-file>"
  exit 1
fi

WORKING_DIR=$(dirname "$1")

# echo "Preparing JPG files..."
for IMAGE_INPUT_PATH in "$WORKING_DIR"/*.png; do
  if [[ -f "$IMAGE_INPUT_PATH" ]]; then
    IMAGE_INPUT_PATH_WITHOUT_EXTENSION=$(basename "${IMAGE_INPUT_PATH%.*}")
    IMAGE_OUTPUT_PATH="$WORKING_DIR/$IMAGE_INPUT_PATH_WITHOUT_EXTENSION.jpg"

    convert "$IMAGE_INPUT_PATH" "$IMAGE_OUTPUT_PATH"
    # convert -resize '891660@>' "$IMAGE_INPUT_PATH" "$IMAGE_OUTPUT_PATH"
  fi
done

# echo "Optimizing JPG files..."
# jpegoptim --quiet --strip-all --all-progressive --size=50 "$WORKING_DIR"/*.jpg
# jpegoptim --quiet --strip-all --all-progressive --size=100 "$WORKING_DIR"/*.jpg
jpegoptim --quiet --strip-all --all-progressive --size=50 "$WORKING_DIR"/*.jpg
