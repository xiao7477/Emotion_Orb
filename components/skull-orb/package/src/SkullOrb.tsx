import type { SphereEmojiProps } from "./sphere/SphereEmoji";
import { SphereEmoji } from "./sphere/SphereEmoji";

export type SkullOrbForm = "orb" | "character";

export type SkullOrbProps = Omit<SphereEmojiProps, "appearance" | "portrait"> & {
  /** The same skull mask shown as a floating ball or as an upper-body character. */
  form?: SkullOrbForm;
};

/** The focused public component: one skull character, two visual forms. */
export function SkullOrb({ form = "orb", ...props }: SkullOrbProps) {
  return (
    <SphereEmoji
      {...props}
      appearance="skull"
      portrait={form === "character"}
    />
  );
}
