import {Target} from './target';
import {type Position, TargetOrientation} from '../../Support/types';
import {randomInt} from 'node:crypto';

export class TargetFactory {
	private targetsDiscarded: number;

	public constructor(public readonly maxWidth: number, public readonly maxHeight: number) {
		this.targetsDiscarded = 0;
	}

	/**
	 * Creates non-colliding targets.
	 *
	 * @param numberOfTargets
	 */
	public createTargets(numberOfTargets = 10): Target[] {
		// Add one random target on game initialization
		const targets = [];
		for (let i = 1; i <= numberOfTargets; i++) {
			const spawn = this.spawnNew();

			if (this.isInCollisionWith(targets, spawn)) {
				this.targetsDiscarded++;
				i--;
			} else {
				targets.push(spawn);
			}
		}

		console.debug(`Targets discarded: ${this.targetsDiscarded}.`);
		console.debug(`Spawned ${targets.length} valid targets.`);

		return targets;
	}

	private isInCollisionWith(targets: Target[], subject: Target): boolean {
		let inCollision = false;
		targets.forEach(target => {
			subject.getOccupiedSpace().forEach(position => {
				if (target.occupiesPosition(position)) {
					inCollision = true;
				}

				if (target.isInVicinityOf(position)) {
					inCollision = true;
				}
			});
		});

		return inCollision;
	}

	private spawnNew(): Target {
		const orientation = this.randomOrientation();
		const randomSize = randomInt(3, 6);
		let randomPosition: Position;
		if (orientation === TargetOrientation.VERTICAL) {
			randomPosition = {
				x: randomInt(0, this.maxWidth),
				y: randomInt(0, this.maxHeight - randomSize),
			} satisfies Position;
		} else {
			randomPosition = {
				x: randomInt(0, this.maxWidth - randomSize),
				y: randomInt(0, this.maxHeight),
			} satisfies Position;
		}

		return new Target(
			this.randomName(),
			randomPosition,
			randomSize,
			orientation,
		);
	}

	private randomName(): string {
		const arrayOfNames = [
			'Super Destroyer',
			'Glider',
			'Assault Ship',
			'Carrier',
			'Scout',
		];
		const randomElementIndex = randomInt(0, arrayOfNames.length);

		return arrayOfNames.slice(randomElementIndex, randomElementIndex + 1)[0];
	}

	private randomOrientation(): TargetOrientation {
		const orientations = [
			TargetOrientation.VERTICAL,
			TargetOrientation.HORIZONTAL,
		];
		const randomElementIndex = randomInt(0, orientations.length);

		return orientations.slice(randomElementIndex, randomElementIndex + 1)[0] as TargetOrientation;
	}
}
