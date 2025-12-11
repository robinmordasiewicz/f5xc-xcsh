#!/bin/sh
# Generate shell completion files for GoReleaser builds
set -e

# Output to stderr so GoReleaser captures it
exec 1>&2

echo "=== Starting completion generation ==="
echo "Working directory: $(pwd)"

# Clean and create completions directory
rm -rf completions
mkdir -p completions

# Build binary first to ensure it exists
# go run . can have issues in CI environments
echo "Building vesctl for completion generation..."
go build -o ./vesctl-completions .

if [ ! -f "./vesctl-completions" ]; then
    echo "ERROR: Failed to build vesctl-completions binary"
    exit 1
fi

echo "Binary built successfully"

# Generate completions for all supported shells using built binary
for sh in bash zsh fish; do
    echo "Generating ${sh} completions..."
    ./vesctl-completions completion "${sh}" > "completions/vesctl.${sh}"

    if [ ! -s "completions/vesctl.${sh}" ]; then
        echo "ERROR: Failed to generate ${sh} completions (file empty or missing)"
        exit 1
    fi
done

# Cleanup temp binary
rm -f ./vesctl-completions

echo "=== Completion generation finished ==="
echo "Generated files:"
ls -la completions/

# Verify files exist and have content
for sh in bash zsh fish; do
    if [ ! -s "completions/vesctl.${sh}" ]; then
        echo "ERROR: completions/vesctl.${sh} is missing or empty"
        exit 1
    fi
    echo "  completions/vesctl.${sh}: $(wc -c < completions/vesctl.${sh}) bytes"
done

echo "All completions generated successfully"
