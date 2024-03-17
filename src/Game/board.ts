import {type Target} from './Target/target';
import {type Position} from '../Support/types';
import {TargetFactory} from './Target/target-factory';

export class Board {
	public readonly targets: Target[];

	public constructor(private readonly width: number, private readonly height: number) {
		this.targets = new TargetFactory(width, height).createTargets();
	}

	public getWidth(): number {
		return this.width;
	}

	public getHeight(): number {
		return this.height;
	}

	public draw(): void {
		// Header
		process.stdout.write('🚢 Battleships v0.1');
		process.stdout.write('\r\n\n');
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
				if (this.hasTargetOnPosition(currentDrawPosition)) {
					const validTarget = this.getTargetOnPosition(currentDrawPosition);
					if (validTarget.hasDamagedSection(currentDrawPosition)) {
						process.stdout.write('🔴');
					} else {
						// Uncomment this section to debug the board.
						// process.stdout.write('🟢');
						process.stdout.write('🔵');
					}
				} else {
					process.stdout.write('🔵');
				}
			}

			process.stdout.write('\n');
		}
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
			if (target.occupiesPosition(position)) {
				target.damageSection(position);
			}
		});
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
