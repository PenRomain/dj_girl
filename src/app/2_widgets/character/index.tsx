"use client";

import { useGameState } from "../../4_shared/context/game-context";
import { db } from "../../4_shared/model";
import { DialogueFragment } from "articy-js";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import styles from "./character.module.css";
import cx from "clsx";
import {
  useGetDriveManifestQuery,
  useGetImageQuery,
  useGetSheetsManifestQuery,
} from "@/shared/store/services/google";
import { Characters } from "@/shared/types";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEmotion } from "@/shared/context/emotion-context";
import Button from "@/shared/uikit/button";
import { SwipeyService } from "../../3_entities/swipey/swipey.service";

const CharacterItem = memo(function CharacterItem({
  image,
  character,
  className,
}: {
  image: string;
  character: string;
  className?: string;
}) {
  const { data, isLoading } = useGetImageQuery(image, {
    skip: !image,
  });
  if (!data || isLoading) return null;
  return (
    <Image
      src={data}
      width={400}
      height={800}
      alt={character}
      className={cx(styles.character, styles[character], className)}
      priority
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

  const [value, setInputValue] = useState("");
  const [fetchJson, setFetchJson] = useState("");
  const swipeyService = new SwipeyService();
  if (!character || !sheets || !drive || isOpenWardrobe) return null;

  const isLeftSide = character === Characters.Protagonist;
  const variants = isLeftSide ? leftVariants : rightVariants;
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        style={{
          position: "absolute",
          top: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 100,
          width: "100%",
          maxWidth: "80%",
          color: "black",
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {fetchJson && <span>{fetchJson}</span>}
        <Button
          onClick={async () => {
            swipeyService
              .getPaymentMethods()
              .then((res) => setFetchJson(JSON.stringify(res)));
          }}
        >
          SEND
        </Button>
      </div>
    );
  }

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
