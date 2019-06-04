import {Entity, GamePosition, ShapeLetter, Vector} from "@/types";
import Shape from "@/views/Shape";

function timestamp(): number {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function isColliding(shape1: Entity[], shape2: Entity[]): Entity[] | null {
	for (const entity1 of shape1) {
		const s1: GamePosition = entityToGamePosition(entity1);

		for (const entity2 of shape2) {
			const s2: GamePosition = entityToGamePosition(entity2);
			if (s1.left < s2.right && s1.right > s2.left && s1.top < s2.bottom && s1.bottom > s2.top) {
				return [entity1, entity2];
			}
		}
	}

	return null;
}

function entityToGamePosition(entity: Entity): GamePosition {
	return {
		left: entity.x,
		right: entity.x + entity.width,
		top: entity.y,
		bottom: entity.y + entity.height,
	};
}

function entityInRange(shape1: Shape, shape2: Shape) {
	return (Math.abs(shape1.vecPosition.x - shape2.vecPosition.x) < 100) ||
				 (Math.abs(shape1.vecPosition.y - shape2.vecPosition.y) < 100);
}

function randomInt(max: number): number {
	return Math.floor(Math.random() * Math.floor(max));
}

function constructShape(shapeLetter: ShapeLetter, shape: Entity): Entity[] {
	const {x, y, width, height} = shape;

	switch (shapeLetter) {
		case ShapeLetter.L:
			return [
				{x, y, width, height},
				{x: x + width, y: y + height - width, width, height: width}
			];
		case ShapeLetter.T:
			return [
				{x, y, width, height},
				{x: x - width, y, width, height: width},
				{x: x + width, y, width, height: width},
			];
		case ShapeLetter.Z:
			return [
				{x, y, width, height},
				{x: x - width, y, width, height: width},
				{x: x + width, y: y + height - width, width, height: width},
			];
		default:
			return [];
	}
}

export const GameUtils = {
	timestamp,
	isColliding,
	randomInt,
	constructShape,
	entityInRange,
};
