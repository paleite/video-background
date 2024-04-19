#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset
readonly DEBUG=${DEBUG:-false}
[[ "${DEBUG}" == 'true' ]] && set -o xtrace

# Validate input
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <relative-folder-path>"
  exit 1
fi

# Slugification function for paths and files
slugify() {
  echo "$1" | awk -F/ -v OFS=/ '{
        for (i=1; i<=NF; i++) {
            # Handle filenames and extensions
            split($i, parts, ".");
            name = parts[1];
            ext = (length(parts) > 1) ? "." tolower(parts[2]) : "";
            gsub(/[^a-zA-Z0-9-]/, "-", name);
            gsub(/--*/, "-", name);
            gsub(/^-|-$/, "", name);
            $i = tolower(name) ext;
        }
        print;
    }'
}

export -f slugify

# Process all files, slugify paths and names, and copy them to new locations if
# they're not the same
find "$1" -type f | while IFS= read -r FILE; do
  NEW_PATH=$(slugify "$FILE")
  if [ -e "$NEW_PATH" ]; then
    echo "Skipping existing '$NEW_PATH'"
    continue
  fi

  mkdir -p "$(dirname "$NEW_PATH")"
  cp "$FILE" "$NEW_PATH"
  echo "Copied '$FILE' to '$NEW_PATH'"
done
