"use client";

import { memo } from "react";
import { DialogueFragment } from "articy-js";
import styles from "./visual-novel.module.css";
import Button from "../../4_shared/uikit/button";
import { db } from "../../4_shared/model";
import CName from "../../2_widgets/c-name";
import {
  useCutscene,
  useGameChoice,
  useGameContext,
  useGameState,
} from "../../4_shared/context/game-context";
import { useInstructions } from "../../4_shared/hooks/use-instructions";
import cx from "clsx";
import { Characters } from "@/shared/types";
import { isKeyOf } from "@/widgets/character";
import { getBranchLabel } from "@/shared/utils/get-branch-label";
import { AnimatePresence, motion } from "framer-motion";
import TypingEffect from "@/shared/uikit/typing-effect";
import { useNodeTextWithName } from "@/shared/hooks/use-node-text-with-name";
import { useMusic } from "@/shared/hooks/use-music";
import { useGetDriveManifestQuery } from "@/shared/store/services/google";

const _isDev = process.env.NODE_ENV === "development";

export default memo(function VisualNovel() {
  useInstructions();
  useMusic();
  const [state] = useGameState();
  const handleChoice = useGameChoice();
  const [cutscene] = useCutscene();
  const { isFading } = useGameContext();
  const node = db.getObject(state.id, DialogueFragment);
  const text = useNodeTextWithName();
  const { isLoading } = useGetDriveManifestQuery();

  const characterName = state.variables.Enter["_cname_"].toString();

  const isOpenWardrobe = state.variables.Open.Wardrobe;

  if (cutscene || isOpenWardrobe || isFading || isLoading || !node) return null;

  const character = node.Speaker?.properties.DisplayName;
  const isMainCharacter = character === Characters.Protagonist;
  const isCharacter = character && isKeyOf(character, Characters);

  return (
    <div className={cx(styles.container, character && styles[character])}>
      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          className={styles.dialogueBox}
          initial={{
            scale: 0.05,
            opacity: 0,
            originX: isMainCharacter ? 0 : 1,
            originY: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { duration: 0.25, ease: "easeOut" },
          }}
          exit={{
            scale: 0.05,
            opacity: 0,
            originX: 1,
            originY: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          }}
        >
          {isCharacter && (
            <p
              className={cx(
                styles.character,
                isMainCharacter && styles.isMainCharacter,
              )}
            >
              {isMainCharacter ? characterName : character}
            </p>
          )}

          {text && (
            <TypingEffect key={text} text={text} className={styles.dialogue} />
          )}
        </motion.div>
      </AnimatePresence>
      <CName />
      <div className={styles.choices}>
        {state.branches.length > 1 &&
          state.branches.map((br, i) => (
            <Button
              key={i}
              onClick={() => {
                handleChoice(br.index);
              }}
            >
              {getBranchLabel(br)}
            </Button>
          ))}
      </div>
    </div>
  );
});
