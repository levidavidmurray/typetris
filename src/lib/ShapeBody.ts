import {Direction, Vector} from "@/types";

export class ShapeBody {
	/**
	 * Calculate potential coordinates give the direction
	 * @param dir
	 * @param coords
	 */
	public static appliedVector(dir: Direction, coords: Vector) {
		switch (dir) {
			case Direction.Up:
				coords.y--;
				break;
			case Direction.Down:
				coords.y++;
				break;
			case Direction.Left:
				coords.x--;
				break;
			case Direction.Right:
				coords.x++;
				break;
		}

		return coords;
	}

	public static validCoords(coords: Vector, maxWidth: number, maxHeight: number) {
		return (coords.x >= 0) && (coords.x < maxWidth) && (coords.y >= 0) && (coords.y < maxHeight);
	}

	public static shapeConstruct(shapeType: boolean[], origin: Vector) {
		const shapeCoords: number[][] = [];
		
		shapeType.forEach((coordBool, index) => {
			if (coordBool) {
				if (index < 3) {
					shapeCoords.push([origin.x + index, origin.y]);
				} else if (index >= 3 && index < 6) {
					shapeCoords.push([origin.x + index - 3, origin.y + 1]);
				} else {
					shapeCoords.push([origin.x + index - 6, origin.y + 2]);
				}
			}
		});

		return shapeCoords;
	}

	public static getRandomInt(max: number) {
		return Math.floor(Math.random() * Math.floor(max));
	}
}
