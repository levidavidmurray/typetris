import { GameSize } from "@/lib/types/Terminal";

export function getGameSize(): GameSize {
  const GAME_WIDTH: number = 20;
  const { clientWidth, clientHeight } = document.body;
  let whRatio: number = clientHeight / clientWidth;

  if (clientWidth > 800) {
    whRatio = 1.25;
  }

  return {
    width: 20,
    height: Math.ceil(GAME_WIDTH * whRatio),
  };
}
