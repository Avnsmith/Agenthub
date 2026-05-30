#!/usr/bin/env bash
set -euo pipefail

# Directory of the script
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")

echo "Running Prisma validation..."
cd "$PROJECT_ROOT"
pnpm prisma validate

echo "Generating Prisma client..."
pnpm prisma generate

echo "Running TypeScript typecheck..."
pnpm typecheck

echo "Building the project..."
pnpm build

# Optional: run secret scanning
if command -v gitleaks >/dev/null 2>&1 && command -v trufflehog >/dev/null 2>&1 && command -v git-secrets >/dev/null 2>&1; then
  echo "Running secret scanning..."
  gitleaks detect --source . --redact && trufflehog filesystem . && git-secrets --scan
else
  echo "Skipping secret scanning (tools not installed)"
fi

echo "All steps completed successfully."
