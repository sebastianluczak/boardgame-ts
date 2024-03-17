import {Engine} from './Game/engine';
import readline from 'readline';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
	process.stdin.setRawMode(true);
}

const engine = new Engine({
	boardSize: {
		height: 15,
		width: 15,
	},
	numberOfShots: 100,
});

type InputKey = {
	sequence: string;
	name: string;
	ctrl: boolean;
};

process.stdin.on('keypress', (str, key: InputKey) => {
	if (key.ctrl && key.name === 'c') {
		process.exit();
	} else {
		// Firing sequence initiated...
		if (key.name === 'space') {
			try {
				engine.fireAtCursor();
			} catch (error) {
				// End-game scenario!
				engine.handleError(error as Error);
				engine.endGame();
			}
		}

		// Moving the cursor around the board.
		if (key.sequence.toString().includes('\x1B[')) {
			try {
				engine.moveCursorInDirection(key.name);
			} catch (error) {
				// Cursor can go out of bounds.
				engine.handleError(error as Error);
			}
		}

		// Handling the turn after player interaction.
		console.clear();
		engine.nextTurn();
	}
});
console.clear();
engine.nextTurn();
