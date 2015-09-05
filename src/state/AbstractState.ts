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
		Tweens: core.TweenManager;
		Timers: core.TimersManager;
		
		Start(): void
		{
			this.Stage = new core.Layer(0, 0, 320, 370);
			this.Tweens = new core.TweenManager();
			this.Timers = new core.TimersManager();

			this.Game.AddDOMEventListener(window, 'resize', (e) => this.OnResize());
		}
		
		Update(timeDelta: number): void
		{
			this.Timers.Update(timeDelta);
			this.Tweens.Update(timeDelta);
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			this.Stage.Draw(ctx);
		}
		
		OnPointerDown(point: core.Vector): void
		{
			this.InputController.OnPointerDown(point);
		}
		
		OnPointerMove(point: core.Vector): void
		{
			this.InputController.OnPointerMove(point);
		}
		
		OnPointerUp(point: core.Vector): void
		{
			this.InputController.OnPointerUp(point);
		}
		
		OnResize(): void
		{
			let width = window.innerWidth, height = window.innerHeight;
			
			let scale = Math.min(width / this.DefaultSize.x, height / this.DefaultSize.y);
			this.Stage.Scale.Set(scale, scale);
			this.Stage.Size.Set(this.DefaultSize.x, height / scale);
			
			let canvasWidth = Math.floor(this.Stage.Size.x * scale);
			if (this.Game.Canvas.width !== canvasWidth)
			{
				this.Game.Canvas.width = canvasWidth;
			}
			
			let canvasHeight = Math.floor(this.Stage.Size.y * scale);
			if (this.Game.Canvas.height !== canvasHeight)
			{
				this.Game.Canvas.height = canvasHeight;
			}
		}
		
		protected ListenForMouseInput(): void
		{
			if (!this.InputController) throw Error();
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mousemove', core.MakeMouseEventTranslator(this.OnPointerMove, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mousedown', core.MakeMouseEventTranslator(this.OnPointerDown, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mouseup', core.MakeMouseEventTranslator(this.OnPointerUp, this));
		}
		
		protected ListenForTouchInput(): void
		{
			if (!this.InputController) throw Error();
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchmove', core.MakeTouchEventTranslator(this.OnPointerMove, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchstart', core.MakeTouchEventTranslator(this.OnPointerDown, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchend', core.MakeTouchEventTranslator(this.OnPointerUp, this));
		}
			
	}
	
}