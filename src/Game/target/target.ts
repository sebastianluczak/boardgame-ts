import {type Position, TargetOrientation} from '../../support/types';

export class Target {
	public destroyed: boolean;
	private readonly damagedSections: Position[];

	public constructor(public name: string, public position: Position, public size: number, public orientation: TargetOrientation) {
		this.destroyed = false;
		this.damagedSections = [];
	}

	public occupiesPosition(position: Position): boolean {
		let occupies = false;
		this.getOccupiedSpace().forEach(occupiedSpace => {
			if (position.x === occupiedSpace.x && position.y === occupiedSpace.y) {
				occupies = true;
			}
		});
		return occupies;
	}

	public getOccupiedSpace(): Position[] {
		const occupiedSpace: Position[] = [];

		if (this.orientation === TargetOrientation.HORIZONTAL) {
			// X. axis is in play.
			for (let i = this.position.x; i < this.position.x + this.size; i++) {
				occupiedSpace.push({x: i, y: this.position.y});
			}
		} else {
			// Same but for Y axis.
			for (let i = this.position.y; i < this.position.y + this.size; i++) {
				occupiedSpace.push({x: this.position.x, y: i});
			}
		}

		return occupiedSpace;
	}

	public isInVicinityOf(position: Position): boolean {
		let inVicinity = false;
		// Vicinity is 8 points around given point.
		// Build a matrix of those positions;
		const vicinityMatrix = [
			{x: position.x - 1, y: position.y - 1} satisfies Position,
			{x: position.x, y: position.y - 1} satisfies Position,
			{x: position.x + 1, y: position.y - 1} satisfies Position,
			{x: position.x - 1, y: position.y} satisfies Position,
			{x: position.x + 1, y: position.y} satisfies Position,
			{x: position.x - 1, y: position.y + 1} satisfies Position,
			{x: position.x, y: position.y + 1} satisfies Position,
			{x: position.x + 1, y: position.y + 1} satisfies Position,
		];
		this.getOccupiedSpace().forEach(occupiedSpace => {
			vicinityMatrix.forEach(vicinityPoint => {
				if (vicinityPoint.x === occupiedSpace.x && vicinityPoint.y === occupiedSpace.y) {
					inVicinity = true;
				}
			});
		});
		return inVicinity;
	}

	public damageSection(position: Position): void {
		if (this.damagedSections.find(element => element.y === position.y && element.x === position.x)) {
			throw new Error(`Section of ${this.name} is already destroyed. Shot wasted...`);
		}

		this.damagedSections.push(position);
		if (this.damagedSections.length === this.size) {
			this.destroyed = true;
		}
	}

	public hasDamagedSection(position: Position): boolean {
		let hasDamageOnSection = false;
		this.damagedSections.forEach(section => {
			if (section.x === position.x && section.y === position.y) {
				hasDamageOnSection = true;
			}
		});
		return hasDamageOnSection;
	}
}
