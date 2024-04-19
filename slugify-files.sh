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

input_dir="$1"

# Function to slugify directory paths without affecting slashes or leading dots
slugify_path() {
    # Process the path, maintaining initial dots and correctly formatting the slashes
    echo "$1" | awk -F/ -v OFS=/ '{
        if ($1 == ".") {
            leading_dot=1;
            $1="";
        }
        for (i=1; i<=NF; i++) {
            gsub(/[^a-zA-Z0-9-]/, "-", $i);
            gsub(/--*/, "-", $i);
            gsub(/^-|-$/, "", $i);
            $i = tolower($i);
        }
        if (leading_dot) print "." $0; else print $0;
    }'
}

slugify_file() {
    # Handle filenames separately to manage extensions without modifying the period
    echo "$1" | awk -F. '{
        if (NF>1) {
            ext = $NF;  # Save the extension
            NF--;
            name = $0;
            gsub(/[^a-zA-Z0-9-]/, "-", name);
            gsub(/--*/, "-", name);
            gsub(/^-|-$/, "", name);
            print tolower(name) "." tolower(ext);
        } else {
            print tolower($1);
        }
    }'
}

export -f slugify_path
export -f slugify_file

# Find all files in the specified directory, slugify the path and filename, and copy
find "$input_dir" -type f | while IFS= read -r file; do
    directory=$(dirname "$file")
    filename=$(basename "$file")
    new_directory=$(slugify_path "$directory")
    new_filename=$(slugify_file "$filename")
    new_path="$new_directory/$new_filename"

    Ensure the target directory exists
    mkdir -p "$new_directory"

    # Copy the file to the new path
    cp "$file" "$new_path"

    echo "Copied '$file' to '$new_path'"
done
