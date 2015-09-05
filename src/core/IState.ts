/// <reference path="Game" />

namespace core {
	
	export interface IState {
		
		/**
		 * Reference to game object
		 */
		Game: Game;
		
		/**
		 * Called once before first update
		 */
		Start(): void;
		
		/**
		 * Called each frame.
		 * @param timeDelta time in seconds since last frame
		 */
		Update(timeDelta: number): void;
		
		/**
		 * Called after update.
		 */
		Draw(ctx: CanvasRenderingContext2D): void;
		
		/**
		 * Called when this game changes state, and this state will
		 * become inactive.
		 */
		Dispose?(): void;
		
	}
	
}