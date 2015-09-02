/// <reference path="Game" />

namespace core {
	
	export type MouseCallback = (x: number, y: number) => void;
	
	export class MouseInputManager {
		
		constructor(
			private Game: core.Game
		) { }
		
		SetOnMoveCb(cb: MouseCallback, ctx?: any): void
		{
			this.Game.AddDOMEventListener(this.Game.Canvas,
				"mousemove", this.HandleEvent.bind(null, cb.bind(ctx))
			);
		}
		
		SetOnDownCb(cb: MouseCallback, ctx?: any): void
		{
			this.Game.AddDOMEventListener(this.Game.Canvas,
				"mousedown", this.HandleEvent.bind(null, cb.bind(ctx))
			);
		}
		
		SetOnUpCb(cb: MouseCallback, ctx?: any): void
		{
			this.Game.AddDOMEventListener(this.Game.Canvas,
				"mouseup", this.HandleEvent.bind(null, cb.bind(ctx))
			);
		}
		
		private HandleEvent(cb: MouseCallback, event: MouseEvent): void
		{
			cb(event.layerX, event.layerY);
		}
		
	}
}