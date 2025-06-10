#!/bin/bash

# IMPORTANT! You must have cloned the target repositories locally before running this script.

DEEP_ANALYSIS_FLAG=""
OUTPUT_FILE_NAME="./reports/orbiter-not-mapped-components.json" # Default output file name

if [ "$1" == "--deep" ] && [ "$2" == "true" ]; then
  DEEP_ANALYSIS_FLAG="--deep true"
  OUTPUT_FILE_NAME="./reports/orbiter-not-mapped-components-deep.json" # Output file name for deep analysis
elif [ "$1" == "--deep" ] && [ "$2" == "false" ]; then
  DEEP_ANALYSIS_FLAG="--deep false"
fi

rm -f "$OUTPUT_FILE_NAME"

npx codemod -s ./ -t ../ShareGate.Protect.Web -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "SG Protect" $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../ShareGate.One -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "SG One" $DEEP_ANALYSIS_FLAG

npx codemod -s ./ -t ../workleap-performance-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "Performance" $DEEP_ANALYSIS_FLAG

npx codemod -s ./ -t ../workleap-management-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "Management App" $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-management-shell -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "Management Shell" $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-administration-portal -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "Administration Portal" $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-activation-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "Activation" $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-login-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "Login" $DEEP_ANALYSIS_FLAG

npx codemod -s ./ -t ../workleap-ai-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped components --project "AI" $DEEP_ANALYSIS_FLAG

echo "✅ Analysis complete! Check $OUTPUT_FILE_NAME for results."
