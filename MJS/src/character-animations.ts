import * as ex from "excalibur";
import { Images } from "./resources";
import {
  DIRECTION,
  DOWN,
  LEFT,
  PAIN,
  POSE,
  RIGHT,
  SWORD1,
  SWORD2,
  UP,
  WALK,
} from "./constants";

const WALK_ANIM_SPEED = 150;
const charSpritesheetGridConfig = {
  columns: 10,
  rows: 10,
  spriteWidth: 32,
  spriteHeight: 32,
};

const redSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.redSheetImage,
  grid: charSpritesheetGridConfig,
});

const SPRITESHEET_MAP: { [key: string]: ex.SpriteSheet } = {
  RED: redSpriteSheet,
};

const ANIMATION_CONFIGS: { [key1 in DIRECTION]: { [key2 in POSE]: [number[], number] } } = {
  DOWN: {
    WALK: [[0, 1], WALK_ANIM_SPEED],
    SWORD1: [[2], WALK_ANIM_SPEED],
    SWORD2: [[3], WALK_ANIM_SPEED],
    PAIN: [[4], WALK_ANIM_SPEED],
  },
  UP: {
    WALK: [[10, 11], WALK_ANIM_SPEED],
    SWORD1: [[12], WALK_ANIM_SPEED],
    SWORD2: [[13], WALK_ANIM_SPEED],
    PAIN: [[14], WALK_ANIM_SPEED],
  },
  LEFT: {
    WALK: [[20, 21], WALK_ANIM_SPEED],
    SWORD1: [[22], WALK_ANIM_SPEED],
    SWORD2: [[23], WALK_ANIM_SPEED],
    PAIN: [[24], WALK_ANIM_SPEED],
  },
  RIGHT: {
    WALK: [[30, 31], WALK_ANIM_SPEED],
    SWORD1: [[32], WALK_ANIM_SPEED],
    SWORD2: [[33], WALK_ANIM_SPEED],
    PAIN: [[34], WALK_ANIM_SPEED],
  },
};

//Generates the association between the direction, the action and the corresponding Animation based on the spritesheet
export function generateCharacterAnimations(spriteSheetKey: keyof typeof SPRITESHEET_MAP): Record<DIRECTION, Record<POSE, ex.Animation>> {
  const sheet: ex.SpriteSheet = SPRITESHEET_MAP[spriteSheetKey];
  let payload = [UP, DOWN, LEFT, RIGHT].reduce((acc, currentDir) => ({
    ...acc,
    [currentDir]: [PAIN, WALK, SWORD1, SWORD2].reduce((acc2, currentPos) => {
      const [frames, speed] = ANIMATION_CONFIGS[currentDir][currentPos];
      return {
        ...acc2,
        [currentPos]: ex.Animation.fromSpriteSheet(sheet, frames, speed)
      };
    }, {} as Record<POSE, ex.Animation>)
  }), {} as Record<DIRECTION, Record<POSE, ex.Animation>>);
  return payload;
};