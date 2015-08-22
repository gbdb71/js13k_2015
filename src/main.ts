/// <reference path="core/Game" />
/// <reference path="core/MouseInputManger" />
/// <reference path="gfx/Rectangle" />
/// <reference path="gfx/Text" />

let canvas = <HTMLCanvasElement>document.getElementById('canvas'),
	ctx = canvas.getContext('2d');
	
ctx.fillText('Hello World', 20, 20);

class DemoState implements core.IState {
	
	timeDelta: number;
	Mouse: core.MouseInputManager;
	Cursor = new gfx.Rectangle(0, 0, 10, 10, {fillStyle: 'red'});
	Point: core.IVector;
	Down: boolean = false;
	DO: core.DisplayObject[] = [];
	Sprite = new gfx.Rectangle(300, 240, 80, 80, {fillStyle: 'green'});
	SomeText = new gfx.Text(10, 10, "01A10");
	
	Start(game: core.IGame): void
	{
		console.log('start');
		this.Cursor.Anchor.Set(0.5, 0.5);
		// this.MousePos.Scale.Set(3, 3);
		// this.MousePos.Rotation = Math.PI / 4;
		
		this.Sprite.Anchor.Set(0.5, 0.5);
		this.Sprite.Scale.Set(2, 2);
		
		this.Mouse = new core.MouseInputManager(game);
		this.Mouse.SetOnMoveCb((x, y) => {this.Cursor.Position.x = x; this.Cursor.Position.y = y});
		this.Mouse.SetOnDownCb((x, y) => this.Down = true);
		this.Mouse.SetOnUpCb((x, y) => this.Down = false);
	}
	
	Update(timeDelta: number): void
	{
		this.timeDelta = timeDelta;
		if (this.Down) {
			this.DO.push(
				new gfx.Rectangle(this.Cursor.Position.x, this.Cursor.Position.y, 10, 10, { fillStyle: 'blue' })
			);
		}
		this.Sprite.Rotation += Math.PI/80;
		let p = this.Cursor.Position.Clone();
		this.Point = p;
		if (this.Sprite.IsPointInside(p)) {
			this.Sprite.Style.fillStyle = 'red';
			// console.log('rot', this.Sprite.Rotation);
		}
		else {
			this.Sprite.Style.fillStyle = 'green';
		}
	}
	
	Draw(ctx: CanvasRenderingContext2D): void
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//ctx.fillText(this.timeDelta.toFixed(2), 10, 10);
		this.SomeText.Draw(ctx);
		if (this.Point) {
			ctx.strokeRect(0, 0, 80, 80);
			ctx.fillRect(this.Point.x - 2, this.Point.y - 2, 4, 4);
			
		}
		this.Cursor.Draw(ctx);
		this.Sprite.Draw(ctx);
		for(let o of this.DO) o.Draw(ctx);
	}
}

let game = new core.Game(canvas);
game.AddState('demo', new DemoState());
game.Play('demo');
