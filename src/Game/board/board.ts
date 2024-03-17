import {type Target} from '../target/target';
import {type Position} from '../../support/types';
import {TargetFactory} from '../target/target-factory';
import {Cursor} from './cursor';

export class Board {
	public readonly targets: Target[];
	public destroyedTargets = 0;
	public positionsShotAt: Position[];
	public shotsLeft: number;
	public cursor: Cursor;
	public messages: string[];

	public constructor(private readonly width: number, private readonly height: number, numberOfShots: number) {
		this.shotsLeft = numberOfShots;
		this.targets = new TargetFactory(width, height).createTargets();
		this.cursor = new Cursor(width, height, {x: Math.floor(width / 2), y: Math.floor(height / 2)} satisfies Position);
		this.messages = [];
		this.positionsShotAt = [];
	}

	public getWidth(): number {
		return this.width;
	}

	public getHeight(): number {
		return this.height;
	}

	public addBoardMessage(message: string): void {
		this.messages.push(message);
	}

	public draw(loseConditionMet = false): void {
		// Header
		process.stdout.write('🚢 Battleships-ts | v2.0.0');
		process.stdout.write('\r\n\n');
		process.stdout.write(`Ships left: ${this.targets.length - this.destroyedTargets} \r\n`);
		process.stdout.write(`C3: ${this.targets.filter(el => el.size === 3).length} C4: ${this.targets.filter(el => el.size === 4).length} C5: ${this.targets.filter(el => el.size === 5).length} \r\n`);
		process.stdout.write(`Shots left: ${this.shotsLeft} \r\n`);
		process.stdout.write('    🅰 🅱 🅲 🅳 🅴 🅵 🅶 🅷 🅸 🅹 🅺 🅻 🅼 🅽 🅾\r\n');
		for (let i = 0; i < this.getWidth(); i++) {
			if (i < 9) {
				process.stdout.write(' ');
			}

			process.stdout.write(` ${i + 1} `);
			for (let j = 0; j < this.getHeight(); j++) {
				// Check if there's a target at position
				const currentDrawPosition = {
					x: i,
					y: j,
				} satisfies Position;
				let symbol = '';

				if (this.cursor.currentPosition.x === currentDrawPosition.x && this.cursor.currentPosition.y === currentDrawPosition.y) {
					symbol = '🛑';
				} else if (this.hasTargetOnPosition(currentDrawPosition)) {
					const validTarget = this.getTargetOnPosition(currentDrawPosition);
					if (validTarget.hasDamagedSection(currentDrawPosition)) {
						symbol = validTarget.destroyed ? '🔴' : '🔥';
					} else {
						symbol = loseConditionMet ? '🟢' : '🔵';
					}
				} else if (this.positionsShotAt.find(el => el.x === currentDrawPosition.x && el.y === currentDrawPosition.y)) {
					symbol = '⚪';
				} else {
					symbol = '🔵';
				}

				process.stdout.write(symbol);
			}

			process.stdout.write('\n');
		}

		process.stdout.write('\n');
		// Get current messages and display them
		this.messages.forEach(message => {
			process.stdout.write(`${message} \r\n`);
		});
		// Clear messages after displaying them
		this.messages = [];
	}

	public isTargetOnPosition(position: Position): boolean {
		let isHit = false;
		this.targets.forEach(target => {
			if (target.occupiesPosition(position)) {
				isHit = true;
			}
		});

		return isHit;
	}

	public damageTargetAtPosition(position: Position): void {
		this.targets.forEach(target => {
			if (target.occupiesPosition(position) && target.destroyed) {
				this.addBoardMessage(`You hit a wrack of ${target.name}...`);
			}

			if (target.occupiesPosition(position) && !target.destroyed) {
				try {
					target.damageSection(position);
				} catch (error: unknown) {
					const internalError = error as Error;
					this.addBoardMessage(internalError.toString());
				}

				if (target.destroyed) {
					this.destroyedTargets++;
					this.addBoardMessage(`You destroyed ${target.name} of class C${target.size}!`);
				}
			}
		});
	}

	public addMissedShot(position: Position): void {
		this.positionsShotAt.push(position);
	}

	private getTargetOnPosition(position: Position): Target {
		return this.targets.find(target => target.occupiesPosition(position))!;
	}

	private hasTargetOnPosition(position: Position): boolean {
		let targetOnPosition = false;
		this.targets.forEach(target => {
			if (target.occupiesPosition(position)) {
				targetOnPosition = true;
			}
		});
		return targetOnPosition;
	}
}
