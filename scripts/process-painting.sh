#!/bin/bash
# ════════════════════════════════════════════════════════════════
# BAKASAN — iPhone Photo Processor
# ════════════════════════════════════════════════════════════════
#
# USAGE:
#   bash scripts/process-painting.sh <category> <id> [source_file]
#
# EXAMPLES:
#   bash scripts/process-painting.sh women lady-okawa-2
#   bash scripts/process-painting.sh iconography white-tara ~/Downloads/IMG_1234.HEIC
#   bash scripts/process-painting.sh asian-ladies silk-robe
#   bash scripts/process-painting.sh nature topanga-200
#
# CATEGORIES:  women | iconography | asian-ladies | nature
#
# WHAT IT DOES:
#   1. Finds the most recent photo in ~/Downloads if no source given
#   2. Converts HEIC → JPG if needed
#   3. Resizes to 1400px on the longest side (web-ready, sharp on retina)
#   4. Saves to the correct images/paintings subfolder
#   5. Prints the data entry to paste into data/paintings.js
#
# AFTER RUNNING:
#   - Copy the printed entry into data/paintings.js
#   - Add your story to the bodyHtml field
#   - Open GitHub Desktop → Commit → Push
# ════════════════════════════════════════════════════════════════

set -e

CATEGORY="$1"
PAINTING_ID="$2"
SOURCE="$3"

# ── Validate inputs ──────────────────────────────────────────────
if [ -z "$CATEGORY" ] || [ -z "$PAINTING_ID" ]; then
  echo "❌  Usage: bash scripts/process-painting.sh <category> <id> [source_file]"
  echo "    Categories: women | iconography | asian-ladies | nature"
  exit 1
fi

case "$CATEGORY" in
  women)          FOLDER="women-of-buddhism";     KICKER="Women of Buddhism" ;;
  iconography)    FOLDER="buddhist-iconography";  KICKER="Buddhist Iconography" ;;
  asian-ladies)   FOLDER="asian-ladies";          KICKER="Asian Ladies" ;;
  nature)         FOLDER="fragments-of-nature";   KICKER="Fragments of Nature" ;;
  *)
    echo "❌  Unknown category: $CATEGORY"
    echo "    Use: women | iconography | asian-ladies | nature"
    exit 1 ;;
esac

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
DEST_DIR="$REPO_ROOT/images/paintings/$FOLDER"
DEST_FILE="$DEST_DIR/$PAINTING_ID.jpg"

mkdir -p "$DEST_DIR"

# ── Find source file ─────────────────────────────────────────────
if [ -n "$SOURCE" ]; then
  INPUT="$SOURCE"
else
  # Pick the most recently modified HEIC or JPG in Downloads
  INPUT=$(ls -t ~/Downloads/*.HEIC ~/Downloads/*.heic ~/Downloads/*.jpg ~/Downloads/*.JPG ~/Downloads/*.jpeg 2>/dev/null | head -1)
  if [ -z "$INPUT" ]; then
    echo "❌  No HEIC or JPG found in ~/Downloads. Please AirDrop the photo first."
    exit 1
  fi
  echo "📸  Using most recent download: $INPUT"
fi

if [ ! -f "$INPUT" ]; then
  echo "❌  File not found: $INPUT"
  exit 1
fi

# ── Convert & resize ─────────────────────────────────────────────
echo "🔄  Converting and resizing..."
sips -s format jpeg -Z 1400 "$INPUT" --out "$DEST_FILE" > /dev/null 2>&1

if [ ! -f "$DEST_FILE" ]; then
  echo "❌  Conversion failed. Make sure the file is a valid image."
  exit 1
fi

FILE_SIZE=$(du -sh "$DEST_FILE" | cut -f1)
echo "✅  Saved: images/paintings/$FOLDER/$PAINTING_ID.jpg ($FILE_SIZE)"

# ── Print data entry ─────────────────────────────────────────────
YEAR=$(date +%Y)
TITLE=$(echo "$PAINTING_ID" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2); print}')

echo ""
echo "════════════════════════════════════════════════════════"
echo "📋  ADD THIS ENTRY TO data/paintings.js:"
echo "════════════════════════════════════════════════════════"
echo ""
echo "  {"
echo "    id: '$PAINTING_ID',"
echo "    category: '$CATEGORY',"
echo "    title: '$TITLE',"
echo "    captionTitle: '$TITLE',"
echo "    era: '',                           // e.g. '14th Century' (optional)"
echo "    year: 'Bakasan, $YEAR',"
echo "    medium: 'Acrylic on Canvas',"
echo "    size: '24″ × 36″',"
echo "    file: 'paintings/$FOLDER/$PAINTING_ID.jpg',"
echo "    bodyHtml: \`"
echo "      <p>Story goes here...</p>\`"
echo "  },"
echo ""
echo "════════════════════════════════════════════════════════"
echo "👉  Next steps:"
echo "    1. Open data/paintings.js and paste the entry above"
echo "    2. Fill in the story in the bodyHtml field"
echo "    3. GitHub Desktop → Commit → Push"
echo "════════════════════════════════════════════════════════"
