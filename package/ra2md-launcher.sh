#!/bin/bash

# This script checks if gamemd.exe is patched and launches the appropriate executable.

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

# Check if sha1sum is installed
if ! command -v sha1sum &> /dev/null; then
    echo "Error: sha1sum is not installed. Please install it to use this script."
    exit 1
fi

# Calculate the SHA-1 hash of a given file
calculate_sha1() {
    sha1sum "$1" | awk '{ print $1 }'
}

# Get the size of a given file in bytes
get_file_size() {
    stat -c%s "$1"
}

# Check if gamemd.exe is patched
is_patched() {
    local gamemd_hash=$(calculate_sha1 "$1")
    local gamemd_size=$(get_file_size "$1")
    local steam_hash_v1="1b57b09d9912023eda3124b959d5f274e9a9bd5f"
    local steam_hash_v2="f5ae9d38f1f628f8bc0c27b1be463c3f5c5d811b"
    local cncfd_hash="6fdf606f9b08ee4c5813aed373953fa1c822e934"
    local origin_hash="3ffb7cc1240164c4fc94d093fe5abe43691940ac"
    local uncracked_retail_cd_hash="6314ca9a8254d70d6e38bf436da86b23b5345a91"
    local PATCHED_GAMEMD_MINIMUM_SIZE=5000000

    echo "Info: SHA-1 hash of gamemd.exe: $gamemd_hash."
    echo "Info: Size of gamemd.exe: $gamemd_size bytes."

    # Determine by hash
    if [[ "$gamemd_hash" == "$steam_hash_v1" || "$gamemd_hash" == "$steam_hash_v2" ]]; then
        echo "Info: gamemd.exe is patched."
        return 0
    elif [[ "$gamemd_hash" == "$cncfd_hash" || "$gamemd_hash" == "$origin_hash" || "$gamemd_hash" == "$uncracked_retail_cd_hash" ]]; then
        echo "Info: gamemd.exe is unpatched."
        return 1
    fi

    # If no hash matched, determine by file size.
    if (( gamemd_size >= PATCHED_GAMEMD_MINIMUM_SIZE )); then
        echo "Info: gamemd.exe is likely patched."
        return 0
    else
        echo "Info: gamemd.exe is likely unpatched."
        return 1
    fi
}

app_path="$(dirname "$0")"
gamemd_path="$(find "$app_path" -iname "gamemd.exe" -print -quit)"
ra2md_path="$(find "$app_path" -iname "ra2md.exe" -print -quit)"

# Check if gamemd.exe is not found.
if [[ -z "$gamemd_path" ]]; then
    echo "Error: gamemd.exe not found."
    exit 2
fi

# Determine if gamemd is patched
is_patched "$gamemd_path"
is_patched_status=$?

# Launch the appropriate executable
if [[ "$is_patched_status" -eq 0 ]]; then
    echo "Info: Launching gamemd.exe."
    exec "$gamemd_path" "$@"
else
#    Check if ra2md.exe is not found
    if [[ -z "$ra2md_path" ]]; then
        echo "Warning: ra2md.exe not found."
        echo "Info: Launching gamemd.exe anyway."
        exec "$gamemd_path" "$@"
    else
        echo "Info: Launching ra2md.exe"
        exec "$ra2md_path" "$@"
    fi
fi
