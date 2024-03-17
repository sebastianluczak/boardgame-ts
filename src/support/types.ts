/**
 * Identifies valid shot.
 */
export type Shot = {
	position: Position;
};

/**
 * Represents any position on board.
 */
export type Position = {
	x: number;
	y: number;
};

/**
 * Represents orientation on board.
 */
export enum TargetOrientation {
	HORIZONTAL,
	VERTICAL,
}
