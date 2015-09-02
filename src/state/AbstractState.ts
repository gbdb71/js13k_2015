/// <reference path="../core/IState" />
/// <reference path="../core/Game" />
/// <reference path="../core/InputController" />

namespace state {
	
	class FillWindowResizeStrategy 
	{
		constructor(
			public Game: core.Game,
			public Callback: (w: number, h: number) => void
		) {
			this.Game.AddDOMEventListener(window, 'resize', this.OnResize.bind(this));
		}
		
		OnResize(): void
		{
			let w = this.Game.Canvas.width = window.innerWidth;
			let h = this.Game.Canvas.height = window.innerHeight;
			this.Callback(w, h);
		}
	}

	export class AbstractState implements core.IState
	{
		DefaultGameSize = new core.Vector(320, 350);

		Game: core.Game;
		Stage: core.Layer;
			
		ResizeStrategy: FillWindowResizeStrategy;
		InputController: core.IInputController;
		
		Start(): void
		{
			this.Stage = new core.Layer(0, 0, this.Game.Canvas.width, this.Game.Canvas.height);
			this.ResizeStrategy = new FillWindowResizeStrategy(this.Game, this.OnResize.bind(this));
		}
		
		Update(timeDelta: number): void
		{
			/** Leave for concrete State */
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			this.Stage.Draw(ctx);
		}
		
		OnPointerDown(point: core.Vector): void
		{
			if (this.InputController)
			{
				this.InputController.OnPointerDown(point);
			}
		}
		
		OnPointerMove(point: core.Vector): void
		{
			if (this.InputController)
			{
				this.InputController.OnPointerMove(point);
			}
		}
		
		OnPointerUp(point: core.Vector): void
		{
			if (this.InputController)
			{
				this.InputController.OnPointerUp(point);
			}
		}
		
		OnResize(width: number, height: number): void
		{
			let scale = Math.min(width / this.DefaultGameSize.x, height / (this.DefaultGameSize.y + 20));
			this.Stage.Size.Set(width / scale, height / scale);
			this.Stage.Scale.Set(scale, scale);
		}
		
		protected ListenForMouseInput(): void
		{
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mousemove', core.MakeMouseEventTranslator(this.OnPointerMove, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mousedown', core.MakeMouseEventTranslator(this.OnPointerDown, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mouseup', core.MakeMouseEventTranslator(this.OnPointerUp, this));
		}
		
		protected ListenForTouchInput(): void
		{
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchmove', core.MakeTouchEventTranslator(this.OnPointerMove, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchstart', core.MakeTouchEventTranslator(this.OnPointerDown, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchend', core.MakeTouchEventTranslator(this.OnPointerUp, this));
		}
			
	}
	
}