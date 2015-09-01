/// <reference path="IGame" />

namespace core {
	
	export interface IState {
		
		Game: IGame;
		
		/**
		 * Called once before first update
		 */
		Start(): void;
		
		/**
		 * @param timeDelta time in seconds since last frame
		 */
		Update(timeDelta: number): void;
		
		Draw(ctx: CanvasRenderingContext2D): void;
		
	}
	
}