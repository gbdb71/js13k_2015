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
		
		Game: core.Game;
		
		ResizeStrategy: FillWindowResizeStrategy;
		InputController: core.IInputController;
		
		Start(): void
		{
			this.ResizeStrategy = new FillWindowResizeStrategy(this.Game, this.OnResize.bind(this));	
		}
		
		Update(timeDelta: number): void
		{
			/** Leave for concrete State */
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			/** Leave for concrete State */
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
			/** Leave for concrete State */
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