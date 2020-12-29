import { Direction, Vector } from "@/types";

export class ShapeBody {
  /**
   * Calculate potential coordinates give the direction
   * @param dir
   * @param coords
   */
  public static appliedVector(dir: Direction, coords: Vector) {
    const deltaVector: Vector = { ...coords };

    switch (dir) {
      case Direction.Up:
        deltaVector.y--;
        break;
      case Direction.Down:
        deltaVector.y++;
        break;
      case Direction.Left:
        deltaVector.x--;
        break;
      case Direction.Right:
        deltaVector.x++;
        break;
    }

    return deltaVector;
  }

  public static validCoords(
    coords: Vector,
    maxWidth: number,
    maxHeight: number
  ) {
    return (
      coords.x >= 0 &&
      coords.x < maxWidth &&
      coords.y >= 0 &&
      coords.y < maxHeight
    );
  }

  public static shapeConstruct(shapeType: boolean[], origin: Vector): Vector[] {
    const shapeCoords: Vector[] = [];
    const { x, y } = origin;
    shapeType.forEach((shapeVector, i) => {
      if (shapeVector) {
        if (i < 3) {
          shapeCoords.push({ x: x + i, y });
        } else if (i >= 3 && i < 6) {
          shapeCoords.push({ x: x + i - 3, y: y + 1 });
        } else {
          shapeCoords.push({ x: x + i - 6, y: y + 2 });
        }
      }
    });

    return shapeCoords;
  }

  public static getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
