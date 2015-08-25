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
		
		SetOnMoveCb(cb: MouseCallback, ctx?: any): void
		{
			this.Game.Canvas.addEventListener(
				"mousemove", this.HandleEvent.bind(null, cb.bind(ctx))
			);
			// this.OnMouseMoveCb = cb;	
		}
		
		SetOnDownCb(cb: MouseCallback, ctx?: any): void
		{
			this.Game.Canvas.addEventListener(
				"mousedown", this.HandleEvent.bind(null, cb.bind(ctx))
			);
			// this.OnMouseMoveCb = cb;
		}
		
		SetOnUpCb(cb: MouseCallback, ctx?: any): void
		{
			this.Game.Canvas.addEventListener(
				"mouseup", this.HandleEvent.bind(null, cb.bind(ctx))
			);
			// this.OnMouseMoveCb = cb;
		}
		
		private HandleEvent(cb: MouseCallback, event: MouseEvent): void
		{
			cb(event.layerX, event.layerY);
		}
		
	}
}