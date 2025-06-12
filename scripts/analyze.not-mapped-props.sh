#!/bin/bash

# IMPORTANT! You must have cloned the target repositories locally before running this script.

DEEP_ANALYSIS_FLAG=""
MAPPINGS="orbiter" # Default mappings
MAPPINGS_FLAG="--mappings orbiter"

# Parse arguments
if [ "$1" == "--deep" ] && [ "$2" == "true" ]; then
  DEEP_ANALYSIS_FLAG="--deep true"
  shift 2
elif [ "$1" == "--deep" ] && [ "$2" == "false" ]; then
  DEEP_ANALYSIS_FLAG="--deep false"
  shift 2
fi

if [ "$1" == "--mappings" ] && [ -n "$2" ]; then
  MAPPINGS="$2"
  MAPPINGS_FLAG="--mappings $2"
  shift 2
elif [ "$3" == "--mappings" ] && [ -n "$4" ]; then
  MAPPINGS="$4"
  MAPPINGS_FLAG="--mappings $4"
fi

# Set output file name based on mappings and deep analysis
if [ "$DEEP_ANALYSIS_FLAG" != "" ]; then
  OUTPUT_FILE_NAME="./reports/$MAPPINGS-not-mapped-props-deep.json"
else
  OUTPUT_FILE_NAME="./reports/$MAPPINGS-not-mapped-props.json"
fi

rm -f "$OUTPUT_FILE_NAME"

npx codemod -s ./ -t ../ShareGate.Protect.Web -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "SG Protect" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../ShareGate.One -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "SG One" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

npx codemod -s ./ -t ../workleap-performance-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "Performance" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

npx codemod -s ./ -t ../workleap-management-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "Management App" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-management-shell -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "Management Shell" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-administration-portal -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "Administration Portal" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-activation-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "Activation" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
npx codemod -s ./ -t ../workleap-login-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "Login" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

npx codemod -s ./ -t ../workleap-ai-app -a "$OUTPUT_FILE_NAME" -n 1 --no-interactive --filter-unmapped props --project "AI" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

echo "✅ Analysis complete! Check $OUTPUT_FILE_NAME for results."
