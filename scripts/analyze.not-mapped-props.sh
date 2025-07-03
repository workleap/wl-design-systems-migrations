#!/bin/bash

# IMPORTANT! You must have cloned the target repositories locally before running this script.

DEEP_ANALYSIS_FLAG=""
MAPPINGS="orbiter" # Default mappings
MAPPINGS_FLAG="--mappings orbiter-to-hopper"

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

pnpm build:cli

pnpm cli analyze -s ./ -t ../ShareGate.Protect.Web --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"SG Protect\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
pnpm cli analyze -s ./ -t ../ShareGate.One --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"SG One\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

pnpm cli analyze -s ./ -t ../workleap-performance-app --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"Performance\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

pnpm cli analyze -s ./ -t ../workleap-management-app --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"Management App\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
pnpm cli analyze -s ./ -t ../workleap-management-shell --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"Management Shell\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
pnpm cli analyze -s ./ -t ../workleap-administration-portal --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"Administration Portal\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
pnpm cli analyze -s ./ -t ../workleap-activation-app --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"Activation\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG
pnpm cli analyze -s ./ -t ../workleap-login-app --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"Login\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

pnpm cli analyze -s ./ -t ../workleap-ai-app --usage-report-file "$OUTPUT_FILE_NAME" --filter-unmapped props --project "\"AI\"" $MAPPINGS_FLAG $DEEP_ANALYSIS_FLAG

echo "✅ Analysis complete! Check $OUTPUT_FILE_NAME for results."
