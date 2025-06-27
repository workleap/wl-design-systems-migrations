import { MIGRATION_NOTES_FILE } from "../../../utils/migration-notes.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const groupMapping = {
  Group: {
    skipImport: true,
    todoComments: `\`Group\` component is not supported in Hopper. Check the \`${MIGRATION_NOTES_FILE}\` file to see the migration path.`,
    migrationNotes:
    `\`Group\` component is not supported in Hopper. Use \`Flex\` or \`AvatarGroup\` if it is used to group Avatars.
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

    You can reach out to #wl-hopper-migration-devs team if you need help with this migration.`
  },
  GroupProps:{
    skipImport: true
  }
} satisfies Record<string, ComponentMapping>;