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
	
	Mouse: core.MouseInputManager;
	Cursor = new gfx.Rectangle(0, 0, 10, 10, {fillStyle: 'red'});
	World: game.World;
	SelectedShape: game.shapes.AbstractShape;
	ResizeStrategy: FillWindowResizeStrategy;
	
	Shape0: game.shapes.RectangleShape;
	Stage: core.Layer;
	
	Game: core.Game;
	
	Start(mgame: core.Game): void
	{
		this.Game = mgame;
		console.log('start');
		this.Cursor.Anchor.Set(0.5, 0.5);
		
		this.Stage = new core.Layer(0, 0, mgame.Canvas.width, mgame.Canvas.height);
		// this.Stage.Scale.Set(0.5, 0.5);
		
		this.World = new game.World(mgame.Canvas.width, mgame.Canvas.height);
		// this.World.Position.Set(0, 30);
		
		this.Stage.AddChild(this.World);
		this.Stage.Position.Set(0.5, 0.5);
		let p = new game.shapes.RectangleShape(100, 10, 20, 20);
		p.Velocity.Set(20, 20);
		p.Anchor.Set(0.5, 0.5);
		p.Rotation = Math.PI / 4;
		this.Stage.AddChild(p);
		this.World.AddShape(p);
		this.Shape0 = p;
		
		this.Mouse = new core.MouseInputManager(mgame);
		this.Mouse.SetOnMoveCb(this.OnMouseMove, this);
		this.Mouse.SetOnDownCb(this.OnMousDown, this);
		this.Mouse.SetOnUpCb(this.OnMouseUp, this);
		
		let touch = new core.TouchInputController(mgame);
		touch.SetOnMoveCb(this.OnMouseMove, this);
		touch.SetOnDownCb(this.OnMousDown, this);
		touch.SetOnUpCb(this.OnMouseUp, this);
		
		
		this.ResizeStrategy = new FillWindowResizeStrategy(mgame, this.OnResize.bind(this));
		this.ResizeStrategy.OnResize();
		
		setInterval(() => {
			this.World.SpawnShape();
		}, 2000);
	}
	
	OnMouseMove(x: number, y: number): void
	{
		this.Cursor.Position.Set(x, y);
		
		if (!this.SelectedShape) {
			this.OnMousDown(x, y);
		}
		if (y > this.World.Size.y) {
			this.SelectedShape = undefined
		}
	}
	
	OnMousDown(x: number, y: number): void
	{
		this.Cursor.Position.Set(x, y);
		let shape = this.World.GetShapeUnder(this.Cursor.Position);
		
		if (shape) {
			shape.Trajectory = [];
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
		this.World.Update(timeDelta);
		
		if (this.SelectedShape) {
			
			if (!this.SelectedShape.Parent) {
				this.SelectedShape = undefined;
				return;
			}
			
			this.SelectedShape.AddTrajectoryPoint(this.World.ToLocal(this.Cursor.Position));
		}
	}
	
	Draw(ctx: CanvasRenderingContext2D): void
	{
		ctx.fillStyle = 'white';
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillText((this.Game.TimeDelta * 1000).toFixed(2), 10, 10);
		
		this.Stage.Draw(ctx);
		this.Cursor.Draw(ctx);
		
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
		console.log('new size ', width, height);
	}
}

let mgame = new core.Game('canvas');
mgame.AddState('demo', new DemoState());
mgame.Play('demo');
