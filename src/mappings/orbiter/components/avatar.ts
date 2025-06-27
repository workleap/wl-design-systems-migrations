import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const avatarMapping = {
  Avatar: {
    props: {
      mappings: {
        onClick: "onPress",
        size: "size",
        retryCount: () => ({
          todoComments: getTodoComment("avatar_retry_count_not_supported")
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
  
} satisfies Record<string, ComponentMapping>;
