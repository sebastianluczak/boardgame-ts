import {Board} from './board/board';
import {type Shot} from '../support/types';

type InitialSettings = {
	boardSize: {
		width: number;
		height: number;
	};
	numberOfShots: number;
};

export class Engine {
	private readonly board: Board;
	private shot?: Shot;

	public constructor(settings: InitialSettings) {
		this.board = new Board(settings.boardSize.width, settings.boardSize.height, settings.numberOfShots);
	}

	public nextTurn(): void {
		this.board.draw();
	}

	public fireAtCursor(): void {
		this.board.addBoardMessage(`Firing at ${this.board.cursor.currentPosition.x}:${this.board.cursor.currentPosition.y}`);
		this.shot = {
			position: this.board.cursor.currentPosition,
		} satisfies Shot;
		this.resolveShot();
	}

	public moveCursorInDirection(direction: string): void {
		this.board.addBoardMessage('Locating targets...');
		if (direction === 'left') {
			this.board.cursor.moveLeft();
		} else if (direction === 'right') {
			this.board.cursor.moveRight();
		} else if (direction === 'up') {
			this.board.cursor.moveUp();
		} else if (direction === 'down') {
			this.board.cursor.moveDown();
		}
	}

	public handleError(error: Error) {
		this.board.addBoardMessage(error.message);
	}

	public endGame() {
		console.clear();
		this.board.draw(true);
		process.exit(420);
	}

	private resolveShot(): void {
		this.board.shotsLeft--;

		if (this.shot && this.board.isTargetOnPosition(this.shot.position)) {
			this.board.addBoardMessage('You hit something!');
			this.board.damageTargetAtPosition(this.shot.position);
		} else {
			this.board.addBoardMessage('You missed... ;-(');
			if (this.shot) {
				this.board.addMissedShot(this.shot.position);
			}
		}

		// Endgame scenario!
		if (this.board.shotsLeft <= 0) {
			// GAME LOST!
			throw new Error('End of Game! You lost your shots!');
		}

		if (this.board.destroyedTargets === this.board.targets.length) {
			// GAME WON!
			throw new Error('Congratulations, you won!');
		}
	}
}
