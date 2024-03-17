import readline from 'readline';
import {Board} from './board';
import {type Shot, TargetOrientation} from '../Support/types';
import {PositionMap} from '../Support/position-map';

export class Engine {
	private readonly board: Board;
	private shot?: Shot;
	private readonly inputOutput: readline.Interface;

	public constructor() {
		this.board = new Board(15, 15);
		this.inputOutput = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
	}

	public nextTurn(): void {
		this.board.draw();
		this.nextMove();
	}

	private nextMove(): void {
		console.log('Please make valid shot, i.e. A:4.');
		this.inputOutput.question('Your move? \r\n', move => {
			const moveRepresentation = move.split(':');
			const row = parseInt(moveRepresentation[1], 10) - 1;
			const column = new PositionMap().mapLetterToColumnNumber(moveRepresentation[0].toString().toUpperCase());
			if (moveRepresentation.length === 2) {
				this.shot = {
					position: {x: row, y: column},
				} satisfies Shot;
				console.clear();
				this.resolveShot();
			} else {
				console.clear();
				console.error('Not valid move!');
			}

			this.nextTurn();
		});
	}

	private resolveShot(): void {
		if (this.shot && this.board.isTargetOnPosition(this.shot.position)) {
			this.board.damageTargetAtPosition(this.shot.position);
		}
	}
}
