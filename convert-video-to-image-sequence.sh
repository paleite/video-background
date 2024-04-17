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
# echo "VIDEO_PATH: $VIDEO_PATH"
# echo "VIDEO_PATH_WITHOUT_EXTENSION: $VIDEO_PATH_WITHOUT_EXTENSION"

GIT_REPO_ROOT=$(git rev-parse --show-toplevel)
OUTPUT_DIR="${GIT_REPO_ROOT}/public/frames/$VIDEO_PATH_WITHOUT_EXTENSION"

# echo "OUTPUT_DIR: $OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# ffmpeg -i "$VIDEO_PATH" -start_number 1 "$OUTPUT_DIR/%04d.png"

echo ""
echo "Convert from png to jpg"

for IMAGE_INPUT_PATH in "$OUTPUT_DIR"/*.png; do
  if [[ -f "$IMAGE_INPUT_PATH" ]]; then
IMAGE_INPUT_PATH_WITHOUT_EXTENSION=$(basename "${IMAGE_INPUT_PATH%.*}")
    # Extract the folder name from the directory path
    folder_name=$(basename "$(dirname "$IMAGE_INPUT_PATH")")

    # Build the path for the output JPG file
    output_file="$OUTPUT_DIR/$folder_name.jpg"

echo "IMAGE_INPUT_PATH_WITHOUT_EXTENSION: $IMAGE_INPUT_PATH_WITHOUT_EXTENSION"
echo "IMAGE_INPUT_PATH: $IMAGE_INPUT_PATH"
echo "OUTPUT_DIR+IMAGE_INPUT_PATH_WITHOUT_EXTENSION: $OUTPUT_DIR/$IMAGE_INPUT_PATH_WITHOUT_EXTENSION"
IMAGE_OUTPUT_PATH="$OUTPUT_DIR/$IMAGE_INPUT_PATH_WITHOUT_EXTENSION.jpg"
echo "IMAGE_OUTPUT_PATH: $IMAGE_OUTPUT_PATH"
convert "$IMAGE_INPUT_PATH" "$IMAGE_OUTPUT_PATH"
    # Resize the square images and convert to JPG
    # cjpeg -progressive -optimize -sample 1x1 -quality 85 "${IMAGE_INPUT_PATH}"
    # cjpeg -progressive -sample 1x1 -quality 85 -outfile encoded_image.jpg "${IMAGE_INPUT_PATH}"
    # echo convert "$IMAGE_INPUT_PATH" -gravity center -crop 58.6%x78.125%+0+0 - #  | convert - "$output_file"
  fi
done


# open  "$OUTPUT_DIR"

# exit 1
# ffmpeg -i "$VIDEO_PATH"  -frames:v 1 -q:v 2 ./public/"$VIDEO_PATH_WITHOUT_EXTENSION"-poster.jpg ;

# ffmpeg -i "$VIDEO_PATH" -an -vf scale=376:668 -movflags faststart -vcodec libx264 -g 1 -pix_fmt yuv420p ./public/"$VIDEO_PATH_WITHOUT_EXTENSION".mp4;


###################



# # Iterate through each subdirectory in the search directory
# for IMAGE_INPUT_PATH in "$search_dir"/*/*.0001.png; do
#   if [[ -f "$IMAGE_INPUT_PATH" ]]; then
#     # Extract the folder name from the directory path
#     folder_name=$(basename "$(dirname "$IMAGE_INPUT_PATH")")

#     # Build the path for the output JPG file
#     output_file="$OUTPUT_DIR/$folder_name.jpg"

#     # Resize the square images and convert to JPG
#     convert "$IMAGE_INPUT_PATH" -gravity center -crop 58.6%x78.125%+0+0 - | convert - "$output_file"
#   fi
# done
