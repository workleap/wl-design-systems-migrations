#!/bin/bash

# IMPORTANT! You must have cloned the target repositories locally before running this script.

rm -f ./reports/orbiter-not-mapped-props.json

npx codemod -s ./ -t ../ShareGate.Protect.Web -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "SG Protect"
npx codemod -s ./ -t ../ShareGate.One -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "SG One"

npx codemod -s ./ -t ../workleap-performance-app -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "Performance"
npx codemod -s ./ -t ../workleap-management-app -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "Management App"
npx codemod -s ./ -t ../workleap-management-shell -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "Management Shell"
npx codemod -s ./ -t ../workleap-administration-portal -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "Administration Portal"
npx codemod -s ./ -t ../workleap-activation-app -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "Activation"
npx codemod -s ./ -t ../workleap-login-app -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "Login"

npx codemod -s ./ -t ../workleap-ai-app -a ./reports/orbiter-not-mapped-props.json -n 1 --no-interactive --filter-unmapped props --project "AI"

echo "✅ Analysis complete! Check ./reports/orbiter-not-mapped-props.json for results."
