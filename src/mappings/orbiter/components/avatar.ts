import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const avatarMapping = {
  Avatar: {
    props: {
      mappings: {
        onClick: "onPress",
        size: "size",
        retryCount: () => ({
          todoComments: "`retryCount` is not supported anymore. Remove it."
        })
      }
    }
  },
  AvatarProps: "AvatarProps",

  DeletedAvatar: {
    props: {
      mappings: { onClick: "onPress" }
    }
  },
  DeletedAvatarProps: "DeletedAvatarProps",
  
  AnonymousAvatar: {
    props: {
      mappings: { onClick: "onPress" }
    }
  },
  AnonymousAvatarProps: "AnonymousAvatarProps"
  
} satisfies Record<string, ComponentMapMetaData>;
