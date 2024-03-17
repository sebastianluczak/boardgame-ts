export class PositionMap {
	public mapLetterToColumnNumber(letter: string): number {
		const map = {
			letters: [
				'A',
				'B',
				'C',
				'D',
				'E',
				'F',
				'G',
				'H',
				'I',
				'J',
				'K',
				'L',
				'M',
				'N',
				'O',
				'P',
				'Q',
				'R',
				'S',
			],
			numbers: [
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
			],
		};

		const indexOfElement = map.letters.indexOf(letter);

		return map.numbers[indexOfElement] - 1;
	}
}
