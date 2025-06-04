import { useEffect } from "react";
import {
  advanceGameFlowState,
  GameFlowState,
  GameIterationConfig,
  DialogueFragment,
} from "articy-js";
import { db } from "@/shared/model";
import { useGameState } from "@/shared/context/game-context";
import {
  googleApi,
  useGetSheetsManifestQuery,
} from "@/shared/store/services/google";
import { useAppDispatch } from "@/shared/store/hooks";
import { Characters } from "../types";

const ITER_CFG: GameIterationConfig = { stopAtTypes: ["DialogueFragment"] };
const LOOK_AHEAD = 10;
const MAX_BRANCHES = 5;

export function usePrefetchLookAhead() {
  const [state] = useGameState();
  const dispatch = useAppDispatch();
  const { data: sheets } = useGetSheetsManifestQuery();

  useEffect(() => {
    function walk(node: GameFlowState, depth: number) {
      if (depth > LOOK_AHEAD) return;

      collectAssets(node);

      for (const br of node.branches.slice(0, MAX_BRANCHES)) {
        const [next] = advanceGameFlowState(db, node, ITER_CFG, br.index);

        walk(next, depth + 1);
      }
    }

    const imgNames = new Set<string>();
    const trackNames = new Set<string>();

    function collectAssets(g: GameFlowState) {
      const node = db.getObject(g.id, DialogueFragment);
      const character = node?.Speaker?.properties.DisplayName;
      const race = +state.variables.Wardrobe.mainCh_Race - 1;
      const res = sheets?.emotions.filter((r) => r[0] === character) ?? [];

      const [, , , , body, , ...emotions] = res[race] ?? res[0] ?? [];

      const mainClothes = state.variables.Wardrobe.mainCh_Clothes;
      const caroClothes = state.variables.Wardrobe.Carolina;

      if (body) imgNames.add(`${body}.png`);
      emotions.forEach((e) => {
        if (e && !imgNames.has(`${e}.png`)) {
          imgNames.add(`${e}.png`);
        }
      });

      if (character === Characters.Protagonist && mainClothes)
        imgNames.add(`mainCh_Clothes_${mainClothes}.png`);
      if (character === Characters.Carolina && caroClothes)
        imgNames.add(`Ivhid_Wardrobe_Carolina_${caroClothes}.png`);
    }

    walk(state, 0);

    imgNames.forEach((name) => {
      dispatch(googleApi.endpoints.getImage.initiate(name));
    });
    trackNames.forEach((name) =>
      dispatch(googleApi.endpoints.getTrack.initiate(name)),
    );
  }, [dispatch, sheets?.emotions, state]);
}
