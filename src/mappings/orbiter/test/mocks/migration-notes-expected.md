<!-- markdownlint-disable -->
# Migration Notes

- **Counter**: `Counter` is not supported anymore. You need to find an alternative. You can see this as an example:https://dev.azure.com/sharegate/ShareGate.Protect.Web/_git/ShareGate.Protect.Web/commit/8c969df4da52b1a0208d54e295762f36aa364ce4?path=/apps/tenant-assessment/src/pages/sharing-links.%5BworkspaceId%5D.tsx&version=GBmain&line=83&lineEnd=89&lineStartColumn=1&lineEndColumn=1&type=2&lineStyle=plain&_a=files
  - test.tsx

- **Dot**: `Dot` is not supported anymore. Find an alternative. One possible option: `<Badge isIndeterminate />`
  - test.tsx

- **Group**: `Group` component is not supported in Hopper. Use `Flex` or `AvatarGroup` if it is used to group Avatars.
    If you want to use Flex, here is the migration path:
      - if there is no props on the tag, simply replace it with <Flex direction="column" justifyContent="center">
      - otherwise:
        - wrap=true => wrap="wrap"
        - wrap=false => remove it
        - if orientation is "horizontal":
          - align becomes justifyContent
          - add alignItems="center"
          - add direction="row"
        - if orientation is "vertical" or undefined:
          - align becomes alignItems
          - add justifyContent="center"
          - add direction="column"

    You can reach out to #wl-hopper-migration-devs team if you need help with this migration.
  - test.tsx

- **Lozenge.size**: The alternative `Tag` might be a bit taller(4px) than the old `Lozenge` even with the same size. Make sure you validate the design after the migration.
  - test.tsx

- **Overlay**: `Overlay` is not supported anymore. Remove it and move its props to `Modal` instead and use `isOpen` prop instead of `show`.
  - test.tsx

- **Tabs.collapsible**: Tabs are NOT collapsible by default. It means if you have multiple tabs you may get different view if they are not all visible at once. Please manually validate it
  - test.tsx

- **TileLink**: `TileLink` is not supported. You should manually implement a `Link` with a `Tile` inside. You can also follow this to implement one: https://dev.azure.com/sharegate/ShareGate.One/_git/ShareGate.One?path=/src/frontend/client/src/components/TileLink/TileLink.tsx&version=GBmain&_a=contents 
  - test.tsx

- **Transition**: `Transition` is not supported anymore. You can use The provided `Transition` shim instead: https://github.com/workleap/orbiter-to-hopper-codemods/blob/main/src/mappings/orbiter/shims/Transition.tsx
  - test.tsx

- **Underlay**: `Underlay` is mapped to `Div`. Please review it to ensure it meets your requirements. More details: https://workleap.atlassian.net/browse/SSD-2565?focusedCommentId=198239
  - test.tsx