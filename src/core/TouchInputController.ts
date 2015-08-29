/// <reference path="Game" />

namespace core {
	
	interface TouchCallback { (x: number, y: number): void };
	
	export class TouchInputController
	{
		constructor(
			public Game: Game
		) { }
		
		SetOnMoveCb(cb: TouchCallback, ctx?: any): void
		{
			this.Game.Canvas.addEventListener(
				"touchmove", this.HandleEvent.bind(this, cb.bind(ctx))
			);
		}
		
		SetOnDownCb(cb: TouchCallback, ctx?: any): void
		{
			this.Game.Canvas.addEventListener(
				"touchstart", this.HandleEvent.bind(this, cb.bind(ctx))
			);
		}
		
		SetOnUpCb(cb: TouchCallback, ctx?: any): void
		{
			this.Game.Canvas.addEventListener("touchend", (event: TouchEvent) => {
				cb.call(ctx, 0, 0);
			});
		}
		
		private HandleEvent(cb: TouchCallback, event: TouchEvent): void
		{
			let x = event.targetTouches[0].pageX,
				y = event.targetTouches[0].pageY;
			
			cb(x, y);
			event.preventDefault();
		}	
	}
	
}