/// <reference path="../core/IState" />
/// <reference path="../core/Game" />
/// <reference path="../core/InputController" />

namespace state {
	
	export class AbstractState implements core.IState
	{
		Game: core.Game;
		Stage: core.Layer;
		DefaultSize = new core.Vector(320, 370);
		InputController: core.IInputController;
		
		Start(): void
		{
			this.Stage = new core.Layer(0, 0, 320, 370);
			this.Game.AddDOMEventListener(window, 'resize', (e) => this.OnResize());
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
		
		OnResize(): void
		{
			let width = window.innerWidth, height = window.innerHeight;
			
			let scale = Math.min(width / this.DefaultSize.x, height / this.DefaultSize.y);
			this.Stage.Scale.Set(scale, scale);
			this.Stage.Size.Set(this.DefaultSize.x, height / scale);
			// core.vector.Scale(this.Stage.Size, scale);
			
			console.log(this.Stage.Size.x);
			this.Game.Canvas.width = this.Stage.Size.x * scale;
			this.Game.Canvas.height = this.Stage.Size.y * scale;
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