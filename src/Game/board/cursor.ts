import {type Position} from '../../support/types';

/**
 * I have no idea where I've fuck'd up the directions of X and Y...
 *
 * @todo needs fixing immediately. :)
 */
export class Cursor {
	constructor(public maxWidth: number, public maxHeight: number, public currentPosition: Position) {}

	public moveLeft(): void {
		if (this.currentPosition.y === 0) {
			throw new Error('Cursor out of bounds.');
		}

		this.currentPosition = {
			...this.currentPosition,
			y: this.currentPosition.y - 1,
		};
	}

	public moveRight(): void {
		if (this.currentPosition.y === this.maxWidth - 1) {
			throw new Error('Cursor out of bounds.');
		}

		this.currentPosition = {
			...this.currentPosition,
			y: this.currentPosition.y + 1,
		};
	}

	public moveUp(): void {
		if (this.currentPosition.x === 0) {
			throw new Error('Cursor out of bounds.');
		}

		this.currentPosition = {
			...this.currentPosition,
			x: this.currentPosition.x - 1,
		};
	}

	public moveDown(): void {
		if (this.currentPosition.x === this.maxHeight - 1) {
			throw new Error('Cursor out of bounds.');
		}

		this.currentPosition = {
			...this.currentPosition,
			x: this.currentPosition.x + 1,
		};
	}
}
