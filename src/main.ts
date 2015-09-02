/// <reference path="core/Game" />
/// <reference path="core/MouseInputManger" />
/// <reference path="core/TouchInputController" />
/// <reference path="core/Math" />

/// <reference path="gfx/Rectangle" />
/// <reference path="gfx/Text" />
/// <reference path="game/World" />
/// <reference path="game/shapes/RectangleShape" />
/// <reference path="core/Tween" />

class FillWindowResizeStrategy 
{
	Listener: EventListener;
	
	constructor(
		public Game: core.Game,
		public Callback: (w: number, h: number) => void
	) {
		this.Listener = this.OnResize.bind(this);
		this.Game.AddDOMEventListener(window, 'resize', this.Listener);
	}
	
	OnResize(): void
	{
		let w = this.Game.Canvas.width = window.innerWidth;
		let h = this.Game.Canvas.height = window.innerHeight;
		this.Callback(w, h);
	}
}


interface IInputController
{
	OnPointerDown(x: number, y: number): void;
	OnPointerMove(x: number, y: number): void;
	OnPointerUp(x: number, y: number): void;
	Update(): void;
}

	
class DemoState implements core.IState
{
	DefaultWorldSize = new core.Vector(320, 350);
	
	World: game.World;
	
	Stage: core.Layer;
	Game: core.Game;
	ResizeStrategy: FillWindowResizeStrategy;
	InputController: IInputController;
	
	ScoreText: gfx.Text;
	FPSText: gfx.Text;
	Bar: gfx.Rectangle;
	
	Start(): void
	{
		document.body.style.background = game.config.color.background;
		// this.Cursor.Anchor.Set(0.5, 0.5);
		
		this.Stage = new core.Layer(0, 0, this.Game.Canvas.width, this.Game.Canvas.height);
		// this.Stage.Scale.Set(0.5, 0.5);
		this.Stage.Position.Set(0.5, 0.5);
		
		this.World = new game.World(this.DefaultWorldSize.x, this.DefaultWorldSize.y);
		this.World.OnEndCallback = () => this.InputController = new DefaultInputController(this);
		// this.World.Position.Set(30, 30);
		
		this.Stage.AddChild(this.World);
		
		let mouse = new core.MouseInputManager(this.Game);
		mouse.SetOnMoveCb(this.OnPointerMove, this);
		mouse.SetOnDownCb(this.OnPointerDown, this);
		mouse.SetOnUpCb(this.OnPointerUp, this);
		
		let touch = new core.TouchInputController(this.Game);
		touch.SetOnMoveCb(this.OnPointerMove, this);
		touch.SetOnDownCb(this.OnPointerDown, this);
		touch.SetOnUpCb(this.OnPointerUp, this);
		
		this.InputController = new GameInputController(this);
		
		this.Stage.AddChild(
			this.Bar = new gfx.Rectangle(0, this.World.Size.y, this.World.Size.x, 20, {fillStyle: 'rgba(0, 0, 0, 0.5)'})
		);
		
		this.ScoreText = new gfx.AAText(5.5, this.World.Size.y + 5.5);
		this.ScoreText.SetSize(10);
		this.Stage.AddChild(this.ScoreText);
		
		this.FPSText = new gfx.AAText(this.World.Size.x - 5.5, this.World.Size.y + 5.5);
		this.FPSText.Anchor.Set(1, 0);
		this.FPSText.SetSize(10);
		this.Stage.AddChild(this.FPSText);
		
		this.ResizeStrategy = new FillWindowResizeStrategy(this.Game, this.OnResize.bind(this));
		this.ResizeStrategy.OnResize();
	}
	
	OnPointerMove(x: number, y: number): void
	{
		this.InputController.OnPointerMove(x, y);
	}
	
	OnPointerDown(x: number, y: number): void
	{
		this.InputController.OnPointerDown(x, y);
	}
	
	OnPointerUp(x: number, y: number): void
	{
		this.InputController.OnPointerUp(x, y);
	}
	
	Update(timeDelta: number): void
	{
		this.World.Update(timeDelta);
		
		this.InputController.Update();
		
		this.FPSText.SetText("FPS " + (timeDelta*1000).toFixed(1));
		this.ScoreText.SetText("SCORE: " + this.World.Score);
	}
	
	Draw(ctx: CanvasRenderingContext2D): void
	{
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		// ctx.fillStyle = 'white';
		// ctx.fillText((this.Game.TimeDelta * 1000).toFixed(2), 10, 10);
		
		this.Stage.Draw(ctx);
		// this.Cursor.Draw(ctx);
		// this.Text.Draw(ctx);
		// gfx.PixelFontCache.DrawLetter(ctx, '2');
		// ctx.drawImage(gfx.PixelFontCache.Cache, 0, 0);
		// for (let s of this.World.Shapes) {
		// 	ctx.beginPath();
		// 	let pos = s.Parent.ToGlobal(s.Position);
		// 	ctx.moveTo(pos.x, pos.y);
		// 	ctx.lineTo(s.Velocity.x + pos.x, s.Velocity.y + pos.y);
		// 	ctx.stroke();
		// }
		
		// this.World.DrawTrajectories(ctx);
	}
	
	OnResize(width: number, height: number): void
	{
		let scale = Math.min(width / this.DefaultWorldSize.x, height / (this.DefaultWorldSize.y + 20));
		this.Stage.Size.Set(width / scale, height / scale);
		this.Stage.Scale.Set(scale, scale);
		
		this.Bar.Size.y = core.math.Clamp(height - this.DefaultWorldSize.y * scale, 20, 50);
		
		this.World.Size.y =	(height / scale) - this.Bar.Size.y;
		
		this.Bar.Position.Set(0, this.World.Size.y);
		this.ScoreText.Position.Set(5.5, this.World.Size.y + 5.5);
		this.FPSText.Position.Set(this.World.Size.x - 5.5, this.World.Size.y + 5.5);
		
		// console.log('h', height, 's', scale, 'wh', this.DefaultWorldSize.y * scale, 'bar size', this.Bar.Size.y);
		// this.Game.Context.imageSmoothingEnabled = false;
		// this.Game.Context.webkitImageSmoothingEnabled = false;
	}
}

class NoopInputController implements IInputController
{
	OnPointerDown(x: number, y: number): void {}
	OnPointerMove(x: number, y: number): void {}
	OnPointerUp(x: number, y: number): void {}
	Update(): void {}
}

class DefaultInputController implements IInputController
{
	RestartText: gfx.Text;
	
	constructor(
		private State: DemoState
	) {
		this.RestartText = new gfx.Text(this.State.World.Size.x/2, this.State.World.Size.y/2, "RESTART");
		this.RestartText.Anchor.Set(0.5, 0.5);
	}
	
	OnPointerDown(x: number, y: number): void 
	{
		if (this.RestartText.IsPointInside({x, y}))
		{
			this.State.Game.Play('demo');
		}
	}
	
	OnPointerMove(x: number, y: number): void {}
	OnPointerUp(x: number, y: number): void {}
	Update(): void
	{
		if (this.State.World.IsOver && !this.RestartText.Parent)
		{
			this.State.Stage.AddChild(this.RestartText);
		}
	}
}

class GameInputController implements IInputController
{
	CursorPosition = new core.Vector();
	SelectedShape: game.shapes.AbstractShape;
	
	constructor(
		private State: DemoState
	) { }
	
	OnPointerDown(x: number, y: number): void
	{
		this.CursorPosition.Set(x, y);
		if (this.State.World.IsOver) return;
		
		let shape = this.State.World.GetShapeUnder(this.CursorPosition);
		
		if (shape) {
			shape.Trajectory = [];
			this.SelectedShape = shape;
		}
	}
	
	OnPointerUp(x: number, y: number): void
	{
		if (this.SelectedShape)
		{
			this.State.World.FinishTrajectory(this.SelectedShape);
			this.SelectedShape = undefined;
		}
		else if (this.State.World.TimeLeft < 0)
		{
			this.State.Stage.RemoveChild(this.State.World);
			this.State.World = new game.World(this.State.DefaultWorldSize.x, this.State.DefaultWorldSize.y);
			this.State.Stage.AddChild(this.State.World);
			this.State.ResizeStrategy.OnResize();
		}
	}
	
	OnPointerMove(x: number, y: number): void
	{
		this.CursorPosition.Set(x, y);
		
		if (!this.SelectedShape) {
			this.OnPointerDown(x, y);
		}
		
		let local = this.State.World.ToLocal(this.CursorPosition);
		if (this.SelectedShape &&
			(
				(local.y < 0 || local.y > this.State.World.Size.y) ||
				(local.x < 0 || local.x > this.State.World.Size.y)
			))
		{
			this.State.World.FinishTrajectory(this.SelectedShape)
			this.SelectedShape = undefined
		}
	}
	
	Update(): void
	{
		if (this.SelectedShape) {
			
			if (!this.SelectedShape.Parent) {
				this.SelectedShape = undefined;
				return;
			}
			
			this.SelectedShape.AddTrajectoryPoint(this.State.World.ToLocal(this.CursorPosition));
		}
	}
}

let mgame = new core.Game('canvas');
mgame.AddState('demo', new DemoState());
mgame.Play('demo');
