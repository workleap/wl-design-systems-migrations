<!-- markdownlint-disable -->
# Migration Notes

- **Counter**: `Counter` is not supported anymore. You need to find an alternative. You can see this as an example:https://dev.azure.com/sharegate/ShareGate.Protect.Web/_git/ShareGate.Protect.Web/commit/8c969df4da52b1a0208d54e295762f36aa364ce4?path=/apps/tenant-assessment/src/pages/sharing-links.%5BworkspaceId%5D.tsx&version=GBmain&line=83&lineEnd=89&lineStartColumn=1&lineEndColumn=1&type=2&lineStyle=plain&_a=files
  - test.tsx

- **Dot**: `Dot` is not supported anymore. Find an alternative. One possible option: `<Badge isIndeterminate />`
  - test.tsx

- **Overlay**: `Overlay` is not supported anymore. Remove it and move its props to `Modal` instead and use `isOpen` prop instead of `show`.
  - test.tsx
