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
}
