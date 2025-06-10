import styles from "./page.module.css";
import VisualNovel from "./1_features/visual-novel";
import { GameProvider } from "./4_shared/context/game-context";
import Background from "./2_widgets/background";
import { BackgroundProvider } from "./4_shared/context/background-context";
import Character from "./2_widgets/character";
import ContinueEvent from "./2_widgets/continue-event";
import CutsceneOverlay from "./2_widgets/cutscene-overlay";
import Wardrobe from "./2_widgets/wardrobe";
import InfoToast from "./2_widgets/info-toast";
import { EmotionProvider } from "./4_shared/context/emotion-context";

const mainStart = "0x010000000000C91B";
// const secondWardrobeForMainChClothes = "0x010000000000CD3B";
// const thirdWardrobeForCarolina = "0x010000000000CE0F";
// const firstCutsceneInstruction = "0x010000000000D00E";
// const beforeBar = "0x010000000000CD79";
// const beforeInformation = "0x010000000000CDEA";
// const beforeMind = "0x010000000000CE98";
// const melissa = "0x010000000000D106";
// const carolina = "0x010000000000CEAF";
// const bartender = "0x010000000000D0A8";
// const firstColor = "0x010000000000CC8C";
// const withoutHead = "0x010000000000CD26";
export default function Home() {
  return (
    <div className={styles.page}>
      <GameProvider
        startId={
          mainStart
          // firstColor
          // withoutHead
          // firstCutsceneInstruction
          // secondWardrobeForMainChClothes
          // thirdWardrobeForCarolina
          // melissa
          // beforeMind
          // bartender
          // beforeBar
          // carolina
          // beforeInformation
        }
      >
        <BackgroundProvider>
          <EmotionProvider>
            <InfoToast />
            <ContinueEvent />
            <Character />
            <main className={styles.main}>
              <Background />
              <CutsceneOverlay />
              <Wardrobe />
              <VisualNovel />
            </main>
          </EmotionProvider>
        </BackgroundProvider>
      </GameProvider>
    </div>
  );
}
