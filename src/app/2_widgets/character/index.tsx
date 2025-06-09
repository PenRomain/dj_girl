"use client";

import { useGameState } from "../../4_shared/context/game-context";
import { db } from "../../4_shared/model";
import { DialogueFragment } from "articy-js";
import Image from "next/image";
import { ImgHTMLAttributes, memo, useMemo } from "react";
import styles from "./character.module.css";
import cx from "clsx";
import {
  useGetDriveManifestQuery,
  useGetSheetsManifestQuery,
} from "@/shared/store/services/google";
import { Characters } from "@/shared/types";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEmotion } from "@/shared/context/emotion-context";

type BlobImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  className?: string;
};
export const BlobImage = memo(function BlobImage({
  src,
  className,
  draggable = false,
  ...rest
}: BlobImageProps) {
  return (
    <img
      src={src}
      className={cx(styles.image, className)}
      draggable={draggable}
      {...rest}
    />
  );
});

const CharacterItem = memo(function CharacterItem({
  image,
  character,
  className,
}: {
  image: string;
  character: string;
  className?: string;
}) {
  return (
    <Image
      src={`/ivhid_src/${encodeURIComponent(image)}`}
      width={400}
      height={800}
      alt={character}
      className={cx(styles.character, styles[character], className)}
      priority
      unselectable="on"
      draggable={false}
      sizes="100dvw"
      quality={100}
    />
  );
});

const leftVariants: Variants = {
  hidden: { x: "-15%", opacity: 0 },
  show: { x: "0%", opacity: 1, transition: { duration: 0.2 } },
  exit: { x: "-15%", opacity: 0.65, transition: { duration: 0.2 } },
};

const rightVariants: Variants = {
  hidden: { x: "15%", opacity: 0 },
  show: { x: "0%", opacity: 1, transition: { duration: 0.2 } },
  exit: { x: "15%", opacity: 0.65, transition: { duration: 0.2 } },
};

export function isKeyOf<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}

export default memo(function Character() {
  const [state] = useGameState();
  const node = db.getObject(state.id, DialogueFragment);
  const [emotion] = useEmotion();
  const character = node?.Speaker?.properties.DisplayName;
  const { data: sheets } = useGetSheetsManifestQuery();
  const { data: drive } = useGetDriveManifestQuery();
  const race = +state.variables.Wardrobe.mainCh_Race - 1;
  const isOpenWardrobe = state.variables.Open.Wardrobe;

  const { bodyImg, emoImg, suitImg } = useMemo(() => {
    const res = sheets?.emotions.filter((r) => r[0] === character) ?? [];

    const [, , , , body, , ...emotions] = res[race] ?? res[0] ?? [];
    const emo = emotions.find((e) => e.includes(emotion));

    const mainClothes = state.variables.Wardrobe.mainCh_Clothes;
    const caroClothes = state.variables.Wardrobe.Carolina;

    return {
      bodyImg: body ? `${body}.png` : undefined,
      emoImg: emo ? `${emo}.png` : undefined,
      suitImg:
        character === Characters.Protagonist && mainClothes
          ? `mainCh_Clothes_${mainClothes}.png`
          : character === Characters.Carolina && caroClothes
            ? `Ivhid_Wardrobe_Carolina_${caroClothes}.png`
            : undefined,
    };
  }, [
    character,
    emotion,
    race,
    sheets?.emotions,
    state.variables.Wardrobe.Carolina,
    state.variables.Wardrobe.mainCh_Clothes,
  ]);

  if (!character || !sheets || !drive || isOpenWardrobe) return null;

  const isLeftSide = character === Characters.Protagonist;
  const variants = isLeftSide ? leftVariants : rightVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={character}
        className={styles.wrap}
        variants={variants}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {bodyImg && (
          <CharacterItem
            image={bodyImg}
            character={character}
            className={styles.body}
          />
        )}
        {suitImg && (
          <CharacterItem
            image={suitImg}
            character={character}
            className={styles.suit}
          />
        )}
        {emoImg && (
          <CharacterItem
            image={emoImg}
            character={character}
            className={styles.emo}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
});
