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

export const generateCharacterAnimations = (spriteSheetKey: keyof typeof SPRITESHEET_MAP) => {
  const sheet: ex.SpriteSheet = SPRITESHEET_MAP[spriteSheetKey];
  // let payload: { [direction: string]: { [posture: string]: ex.Animation } } = {};
  // let payload: { [direction in DIRECTION]: { [posture in POSE]: ex.Animation } } = {};
  // let payload: Partial<Record<DIRECTION, Partial<Record<POSE, ex.Animation>>>> = {};
  // let payload: Partial<{ [direction in DIRECTION]: Partial<{ [posture in POSE]: ex.Animation }> }> = {};
  // [UP, DOWN, LEFT, RIGHT].forEach((dir) => {
  //   payload[dir] = {};
  //   [WALK, SWORD1, SWORD2, PAIN].forEach((pose) => {
  //     const [frames, speed] = ANIMATION_CONFIGS[dir][pose];
  //     payload[dir]![pose] = ex.Animation.fromSpriteSheet(
  //       sheet,
  //       [...frames],
  //       speed
  //     );
  //   });
  // });

  type Tata = Partial<{ [posture in POSE]: ex.Animation }>;
  type Toto = Partial<{ [direction in DIRECTION]: Tata }>;
  let payload2: Toto = {};

  const arrDir: DIRECTION[] = [UP, DOWN, LEFT, RIGHT];
  const arrPos: POSE[] = [PAIN, WALK, SWORD1, SWORD2];

  payload2 = arrDir.reduce(callBack1, {});
  function callBack1(acc1: Toto, currentVal1: DIRECTION) {
    acc1 = {
      ...acc1, [currentVal1]: arrPos.reduce((acc2: Tata, currentVal2: POSE) => {
        const [frames, speed] = ANIMATION_CONFIGS[currentVal1][currentVal2];
        return {
          ...acc2, [currentVal2]: ex.Animation.fromSpriteSheet(
            sheet,
            [...frames],
            speed
          )
        };
      }, {})
    }
    return acc1;
  }



  // let payload2: Partial<{ [direction in DIRECTION]: Partial<{ [posture in POSE]: ex.Animation }> }> = {};
  // let initialValue: Partial<{ [direction in DIRECTION]: Partial<{ [posture in POSE]: ex.Animation }> }> = {};

  // payload2 = [UP, DOWN, LEFT, RIGHT].reduce(
  //   (acc: Partial<{ [direction in DIRECTION]: Partial<{ [posture in POSE]: ex.Animation }> }>, direction) => {
  //     acc[direction] = [WALK, SWORD1, SWORD2, PAIN].reduce(
  //       (acc: Partial<{ [direction in DIRECTION]: Partial<{ [posture in POSE]: ex.Animation }> }>, pose) => {
  //         const [frames, speed] = ANIMATION_CONFIGS[direction][pose];
  //         // acc[direction][pose] = ex.Animation.fromSpriteSheet(
  //         //   sheet,
  //         //   [...frames],
  //         //   speed);
  //         acc[direction][pose] = 2;
  //         return acc;
  //       }, {}
  //     );
  //     return acc
  //   }, initialValue);

  return payload2;
};





// type LETTERS = 'A' | 'B' | 'C';
// type ELEMENT = 'FIRE' | 'ICE' | 'THUNDER';
// type COLORS = 'BLACK' | 'RED' | 'BROWN' | 'BLUE' | 'YELLOW';

// function getColorsByLettersAndElement(letter: LETTERS, elem: ELEMENT): COLORS {
//   console.log('GET : ' + letter + " " + elem);
//   if (letter === 'A') {
//     return "BLACK";
//   }
//   if (elem === 'ICE') {
//     return "BLUE";
//   }
//   return 'RED';
// }

// const arrLet: LETTERS[] = ['A', 'B', 'C'];
// const arrElem: ELEMENT[] = ['FIRE', 'ICE', 'THUNDER'];
// let x = arrLet.reduce((accumLetters, currentLetter) => {
//   console.log('Reducing for ' + currentLetter);
//   let obj = arrElem.reduce((accumElem, currentElem) => {
//     console.log('     Reducing for ' + currentElem);
//     console.log('                  accumElem ->   '); console.dir(accumElem);
//     return { ...accumElem, [currentElem]: getColorsByLettersAndElement(currentLetter, currentElem) };
//   }, {})
//   console.log('>>>>>>>>>>>>>>>>>> : '); console.dir(obj);
//   return { ...accumLetters, [currentLetter]: obj };
// }, {});

// console.log(x);


// let y = arrLet.reduce((acc,currentVal) => {
//     return {...acc,[currentVal]: 'YEAH'};
// },{})

// console.log(y);

