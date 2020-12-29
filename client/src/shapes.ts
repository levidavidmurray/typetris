import { ShapeType } from "@/types";

const shapeTypes: ShapeType = {
  I: [false, true, false, false, true, false, false, true, false],

  L: [false, true, false, false, true, false, false, true, true],

  T: [true, true, true, false, true, false, false, true, false],

  O: [false, false, false, true, true, false, true, true, false],

  Z: [true, true, false, false, true, false, false, true, true],
};

export default shapeTypes;
