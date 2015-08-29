/// <reference path="core/Game" />
/// <reference path="core/MouseInputManger" />
/// <reference path="core/TouchInputController" />
/// <reference path="gfx/Rectangle" />
/// <reference path="gfx/Text" />
/// <reference path="game/World" />
/// <reference path="game/shapes/RectangleShape" />

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
	
	timeDelta: number;
	Mouse: core.MouseInputManager;
	Cursor = new gfx.Rectangle(0, 0, 10, 10, {fillStyle: 'red'});
	World: game.World;
	SelectedShape: game.shapes.AbstractShape;
	ResizeStrategy: FillWindowResizeStrategy;
	
	Shape0: game.shapes.RectangleShape;
	Stage: core.Layer;
	
	
	Start(myGame: core.Game): void
	{
		console.log('start');
		this.Cursor.Anchor.Set(0.5, 0.5);
		
		this.Stage = new core.Layer(0, 0, myGame.Canvas.width, myGame.Canvas.height);
		// this.Stage.Scale.Set(0.5, 0.5);
		
		this.World = new game.World(myGame.Canvas.width, myGame.Canvas.height);
		// this.World.Position.Set(0, 30);
		
		this.Stage.AddChild(this.World);
		
		let p = new game.shapes.RectangleShape(100, 10, 20, 20);
		p.Velocity.Set(20, 20);
		p.Anchor.Set(0.5, 0.5);
		p.Rotation = Math.PI / 4;
		this.Stage.AddChild(p);
		this.World.AddShape(p);
		this.Shape0 = p;
		
		this.Mouse = new core.MouseInputManager(myGame);
		this.Mouse.SetOnMoveCb(this.OnMouseMove, this);
		this.Mouse.SetOnDownCb(this.OnMousDown, this);
		this.Mouse.SetOnUpCb(this.OnMouseUp, this);
		
		let touch = new core.TouchInputController(myGame);
		touch.SetOnMoveCb(this.OnMouseMove, this);
		touch.SetOnDownCb(this.OnMousDown, this);
		touch.SetOnUpCb(this.OnMouseUp, this);
		
		
		this.ResizeStrategy = new FillWindowResizeStrategy(myGame, this.OnResize.bind(this));
		this.ResizeStrategy.OnResize();
	}
	
	OnMouseMove(x: number, y: number): void
	{
		this.Cursor.Position.Set(x, y);
	}
	
	OnMousDown(x: number, y: number): void
	{
		this.Cursor.Position.Set(x, y);
		let shape = this.World.GetShapeUnder(this.Cursor.Position);
		
		if (shape) {
			shape.AddTrajectoryPoint(this.World.ToLocal(this.Cursor.Position));
			this.SelectedShape = shape;
		}
	}
	
	OnMouseUp(x: number, y: number): void
	{
		this.SelectedShape = null;
	}
	
	Update(timeDelta: number): void
	{
		this.timeDelta = timeDelta;
		
		if (this.Shape0.IsPointInside(this.Cursor.Position)) {
			this.Shape0.Sprite.Style.fillStyle = 'green';
		} else {
			this.Shape0.Sprite.Style.fillStyle = 'red';
		}
		
		this.World.Update(timeDelta);
		
		if (this.SelectedShape) {
			this.SelectedShape.AddTrajectoryPoint(this.World.ToLocal(this.Cursor.Position));
		}
	}
	
	Draw(ctx: CanvasRenderingContext2D): void
	{
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillText((this.timeDelta * 1000).toFixed(2), 10, 10);
		
		this.Stage.Draw(ctx);
		this.Cursor.Draw(ctx);
		
		for (let s of this.World.Shapes) {
			ctx.beginPath();
			let pos = s.Parent.ToGlobal(s.Position);
			ctx.moveTo(pos.x, pos.y);
			ctx.lineTo(s.Velocity.x + pos.x, s.Velocity.y + pos.y);
			ctx.stroke();
		}
		
		// this.World.DrawTrajectories(ctx);
	}
	
	OnResize(width: number, height: number): void
	{
		console.log('new size ', width, height);
	}
}

let mgame = new core.Game('canvas');
mgame.AddState('demo', new DemoState());
mgame.Play('demo');
