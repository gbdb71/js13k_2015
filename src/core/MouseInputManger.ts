/// <reference path="IGame" />

namespace core {
	
	export type MouseCallback = (x: number, y: number) => void;
	
	export class MouseInputManager {
		
		// private OnMouseMoveCb: MouseCallback;
		
		constructor(
			private Game: IGame
		) { }
		
		// StartListening(): void
		// {
		// 	this.Game.Canvas.addEventListener(
		// 		"mousemove", this.OnMouseMove.bind(this)
		// 	);
		// }
		
		SetOnMoveCb(cb: MouseCallback): void
		{
			this.Game.Canvas.addEventListener(
				"mousemove", this.HandleEvent.bind(null, cb)
			);
			// this.OnMouseMoveCb = cb;	
		}
		
		SetOnDownCb(cb: MouseCallback): void
		{
			this.Game.Canvas.addEventListener(
				"mousedown", this.HandleEvent.bind(null, cb)
			);
			// this.OnMouseMoveCb = cb;
		}
		
		SetOnUpCb(cb: MouseCallback): void
		{
			this.Game.Canvas.addEventListener(
				"mouseup", this.HandleEvent.bind(null, cb)
			);
			// this.OnMouseMoveCb = cb;
		}
		
		private HandleEvent(cb: MouseCallback, event: MouseEvent): void
		{
			cb(event.layerX, event.layerY);
		}
		
	}
}