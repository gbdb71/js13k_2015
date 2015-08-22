/// <reference path="IGame" />

namespace core {
	
	export interface IState {
		
		Start(game: IGame): void;
		
		/**
		 * @param timeDelta time in seconds since last frame
		 */
		Update(timeDelta: number): void;
		
		Draw(ctx: CanvasRenderingContext2D): void;
		
	}
	
}