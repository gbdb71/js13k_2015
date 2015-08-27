/// <reference path="core/Game" />
/// <reference path="core/MouseInputManger" />
/// <reference path="gfx/Rectangle" />
/// <reference path="gfx/Text" />
/// <reference path="game/World" />
/// <reference path="game/shapes/RectangleShape" />

class DemoState implements core.IState {
	
	timeDelta: number;
	Mouse: core.MouseInputManager;
	Cursor = new gfx.Rectangle(0, 0, 10, 10, {fillStyle: 'red'});
	Point: core.IVector;
	Childs: core.DisplayObject[] = [];
	World = new game.World();
	SelectedShape: game.shapes.AbstractShape;
	
	Start(myGame: core.IGame): void
	{
		console.log('start');
		this.Cursor.Anchor.Set(0.5, 0.5);
		
		let p = new game.shapes.RectangleShape(10, 10, 20, 20);
		p.Velocity.Set(30, 30);
		p.Anchor.Set(0.5, 0.5);
		this.Childs.push(p);
		this.World.AddShape(p);
		
		this.Mouse = new core.MouseInputManager(myGame);
		this.Mouse.SetOnMoveCb(this.OnMouseMove, this);
		this.Mouse.SetOnDownCb(this.OnMousDown, this);
		this.Mouse.SetOnUpCb(this.OnMouseUp, this);
	}
	
	OnMouseMove(x: number, y: number): void
	{
		this.Cursor.Position.Set(x, y);
	}
	
	OnMousDown(x: number, y: number): void
	{
		let shape = this.World.GetShapeUnder(this.Cursor.Position);
			
		if (shape) {
			shape.AddTrajectoryPoint(this.Cursor.Position);
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
		this.World.Update(timeDelta);
		
		if (this.SelectedShape) {
			this.SelectedShape.AddTrajectoryPoint(this.Cursor.Position);
		}
	}
	
	Draw(ctx: CanvasRenderingContext2D): void
	{
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillText((this.timeDelta * 1000).toFixed(2), 10, 10);
		
		for(let o of this.Childs) o.Draw(ctx);
		
		for (let s of this.World.Shapes) {
			ctx.beginPath();
			ctx.moveTo(s.Position.x, s.Position.y);
			ctx.lineTo(s.Velocity.x + s.Position.x, s.Velocity.y + s.Position.y);
			ctx.stroke();
		}
		
		this.World.DrawTrajectories(ctx);
	}
}

let mgame = new core.Game('canvas');
mgame.AddState('demo', new DemoState());
mgame.Play('demo');
