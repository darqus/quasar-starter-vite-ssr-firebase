#!/usr/bin/env bash
#
# Creates a page component that matches the current conventions:
#   - folder and file names in kebab-case / PascalCase;
#   - <script setup lang="ts">, no <style> block (see src/css/STYLE_GUIDE.md);
#   - styles, if needed, go to a layered SCSS partial in src/css/.
#
# Usage:
#   bash create-page.sh
#   -> Enter page name: master-class
#   -> src/pages/master-class/MasterClassPage.vue

set -euo pipefail

read -r -p "Enter page name (kebab-case, e.g. master-class): " PAGE

PAGE_LC="$(printf '%s' "$PAGE" \
  | tr '[:upper:]' '[:lower:]' \
  | tr ' _' '--' \
  | sed -E 's/-+/-/g; s/^-|-$//g')"

if [[ ! "$PAGE_LC" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Error: use kebab-case, e.g. master-class." >&2
  exit 1
fi

PAGE_PC="$(printf '%s' "$PAGE_LC" | sed -E 's/(^|-)([a-z0-9])/\U\2/g')"

DIR="src/pages/$PAGE_LC"
FILE="$DIR/${PAGE_PC}Page.vue"

if [[ -e "$FILE" ]]; then
  echo "Error: $FILE already exists." >&2
  exit 1
fi

mkdir -p "$DIR"

cat > "$FILE" <<EOF
<script setup lang="ts">
// ${PAGE_PC} page logic goes here. Keep UI state local to the page and
// move reusable scenarios to a feature (src/features/<name>).
</script>

<template>
  <q-page class="q-pa-md">
    <div class="text-h5">${PAGE_PC}</div>
  </q-page>
</template>
EOF

cat <<MSG
Created $FILE

Next steps:
  1. Add ROUTE_NAME and ROUTE_PATH to src/types/route.ts.
  2. Add the route to src/router/routes.ts (title, icon, menu, access meta).
  3. If the page needs styles, add a layered partial in src/css/ and
     @use it from src/css/app.scss (no <style> blocks in components).
MSG
