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
		public Game: core.IGame,
		public Callback: (w: number, h: number) => void
	) {
		this.Listener = this.OnResize.bind(this);
		window.addEventListener('resize', this.Listener);
	}
	
	OnResize(): void
	{
		let w = this.Game.Canvas.width = window.innerWidth;
		let h = this.Game.Canvas.height = window.innerHeight;
		this.Callback(w, h);
	}
}

	
class DemoState implements core.IState{
	
	Cursor = new gfx.Rectangle(0, 0, 10, 10, {fillStyle: 'red'});
	DefaultWorldSize = new core.Vector(320, 350);
	
	World: game.World;
	SelectedShape: game.shapes.AbstractShape;
	
	Stage: core.Layer;
	Game: core.Game;
	ResizeStrategy: FillWindowResizeStrategy;
	
	ScoreText: gfx.Text;
	FPSText: gfx.Text;
	Bar: gfx.Rectangle;
	
	Start(mgame: core.Game): void
	{
		document.body.style.background = game.config.color.background;
		
		this.Game = mgame;
		// this.Cursor.Anchor.Set(0.5, 0.5);
		
		this.Stage = new core.Layer(0, 0, mgame.Canvas.width, mgame.Canvas.height);
		// this.Stage.Scale.Set(0.5, 0.5);
		this.Stage.Position.Set(0.5, 0.5);
		
		this.World = new game.World(this.DefaultWorldSize.x, this.DefaultWorldSize.y);
		// this.World.Position.Set(30, 30);
		
		this.Stage.AddChild(this.World);
		
		let mouse = new core.MouseInputManager(mgame);
		mouse.SetOnMoveCb(this.OnMouseMove, this);
		mouse.SetOnDownCb(this.OnMousDown, this);
		mouse.SetOnUpCb(this.OnMouseUp, this);
		
		let touch = new core.TouchInputController(mgame);
		touch.SetOnMoveCb(this.OnMouseMove, this);
		touch.SetOnDownCb(this.OnMousDown, this);
		touch.SetOnUpCb(this.OnMouseUp, this);
		
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
		
		this.ResizeStrategy = new FillWindowResizeStrategy(mgame, this.OnResize.bind(this));
		this.ResizeStrategy.OnResize();
	}
	
	OnMouseMove(x: number, y: number): void
	{
		this.Cursor.Position.Set(x, y);
		
		if (!this.SelectedShape) {
			this.OnMousDown(x, y);
		}
		
		let local = this.World.ToLocal(this.Cursor.Position);
		if (this.SelectedShape &&
			(
				(local.y < 0 || local.y > this.World.Size.y) ||
				(local.x < 0 || local.x > this.World.Size.y)
			))
		{
			this.World.FinishTrajectory(this.SelectedShape)
			this.SelectedShape = undefined
		}
	}
	
	OnMousDown(x: number, y: number): void
	{
		this.Cursor.Position.Set(x, y);
		if (this.World.IsOver) return;
		
		let shape = this.World.GetShapeUnder(this.Cursor.Position);
		
		if (shape) {
			shape.Trajectory = [];
			this.SelectedShape = shape;
		}
	}
	
	OnMouseUp(x: number, y: number): void
	{
		if (this.SelectedShape)
		{
			this.World.FinishTrajectory(this.SelectedShape);
			this.SelectedShape = undefined;
		}
		else if (this.World.TimeLeft < 0)
		{
			this.Stage.RemoveChild(this.World);
			this.World = new game.World(this.DefaultWorldSize.x, this.DefaultWorldSize.y);
			this.Stage.AddChild(this.World);
			this.ResizeStrategy.OnResize();
		}
	}
	
	Update(timeDelta: number): void
	{
		this.World.Update(timeDelta);
		
		if (this.SelectedShape) {
			
			if (!this.SelectedShape.Parent) {
				this.SelectedShape = undefined;
				return;
			}
			
			this.SelectedShape.AddTrajectoryPoint(this.World.ToLocal(this.Cursor.Position));
		}
		
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
		this.Stage.Size.Set(width, height);
		
		let scale = Math.min(width / this.DefaultWorldSize.x, height / (this.DefaultWorldSize.y + 20));
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

let mgame = new core.Game('canvas');
mgame.AddState('demo', new DemoState());
mgame.Play('demo');
