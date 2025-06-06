#!/bin/bash

# IMPORTANT! You must have cloned the target repositories locally before running this script.

rm -f ./reports/orbiter-usage.json

npx codemod -s ./ -t ../ShareGate.Protect.Web -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "SG Protect"
npx codemod -s ./ -t ../ShareGate.One -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "SG One"

npx codemod -s ./ -t ../workleap-performance-app -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "Performance"

npx codemod -s ./ -t ../workleap-management-app -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "Management App"
npx codemod -s ./ -t ../workleap-management-shell -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "Management Shell"
npx codemod -s ./ -t ../workleap-administration-portal -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "Administration Portal"
npx codemod -s ./ -t ../workleap-activation-app -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "Activation"
npx codemod -s ./ -t ../workleap-login-app -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "Login"

npx codemod -s ./ -t ../workleap-ai-app -a ./reports/orbiter-usage.json -n 1 --no-interactive --project "AI"

echo "✅ Analysis complete! Check ./reports/orbiter-usage.json for results."
