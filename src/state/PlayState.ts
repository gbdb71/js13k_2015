/// <reference path="AbstractState" />
/// <reference path="../game/World" />
/// <reference path="../gfx/Rectangle" />
/// <reference path="../core/Math" />

namespace state {
	
	export class PlayState extends AbstractState
	{
		
		World: game.World;
		
		ScoreText: gfx.Text;
		FPSText: gfx.Text;
		Bar: gfx.Rectangle;
		
		Id: number = 0;
		
		constructor(
			public Config = {
				SpawnTime: 3,
				LevelTime: 15
			}
		) {
			super();
		}
		
		Start(): void
		{
			super.Start();
			
			this.Id += 1;
			
			this.World = new game.World(this.DefaultGameSize.x, this.DefaultGameSize.y, this.Config);
			this.World.OnTimesUpCallback = this.OnTimesUp.bind(this);
			// this.World.Position.Set(30, 30);
			this.Stage.AddChild(this.World);
			
			this.InputController = new GameInputController(this);
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
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
			
			this.ResizeStrategy.OnResize();
		}
		
		Update(timeDelta: number): void
		{
			this.World.Update(timeDelta);
			this.InputController.Update();
			
			this.FPSText.SetText("FPS " +this.Id+ " " + (timeDelta*1000).toFixed(1));
			this.ScoreText.SetText("SCORE: " + this.World.Score);
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			this.Stage.Draw(ctx);
		}
		
		OnTimesUp(): void
		{
			let restart = new gfx.Text(this.World.Size.x/2, this.World.Size.y/3 + 50, "RESTART");
			restart.SetSize(40);
			restart.Anchor.Set(0.5, 0.5);
			
			let menu = new gfx.AAText(this.World.Size.x/2, this.World.Size.y/2 + 50, "MENU");
			menu.Anchor.Set(0.5, 0.5);
			
			this.Stage.AddChild(restart);
			this.Stage.AddChild(menu);
			
			this.InputController = new core.GenericInputController()
				.WhenPointerDown(restart, () => this.Game.Play('game'))
				.WhenPointerDown(menu, () => this.Game.Play('level-select'));
		}
		
		OnResize(width: number, height: number): void
		{
			let scale = Math.min(width / this.DefaultGameSize.x, height / (this.DefaultGameSize.y + 20));
			this.Stage.Size.Set(width / scale, height / scale);
			this.Stage.Scale.Set(scale, scale);
			
			this.Bar.Size.y = core.math.Clamp(height - this.DefaultGameSize.y * scale, 20, 50);
			
			this.World.Size.y =	(height / scale) - this.Bar.Size.y;
			
			this.Bar.Position.Set(0, this.World.Size.y);
			this.ScoreText.Position.Set(5.5, this.World.Size.y + 5.5);
			this.FPSText.Position.Set(this.World.Size.x - 5.5, this.World.Size.y + 5.5);
			
			// console.log('h', height, 's', scale, 'wh', this.DefaultWorldSize.y * scale, 'bar size', this.Bar.Size.y);
			// this.Game.Context.imageSmoothingEnabled = false;
			// this.Game.Context.webkitImageSmoothingEnabled = false;
		}
	}
	
	class GameInputController implements core.IInputController
	{
		CursorPosition = new core.Vector();
		SelectedShape: game.shapes.AbstractShape;
		
		constructor(
			private State: PlayState
		) { }
		
		OnPointerDown(point: core.Vector): void
		{
			core.vector.Clone(point, this.CursorPosition);
			
			if (this.State.World.IsOver) return;
			
			let shape = this.State.World.GetShapeUnder(this.CursorPosition);
			
			if (shape) {
				shape.Trajectory = [];
				this.SelectedShape = shape;
			}
		}
		
		OnPointerUp(point: core.Vector): void
		{
			if (this.SelectedShape)
			{
				this.State.World.FinishTrajectory(this.SelectedShape);
				this.SelectedShape = undefined;
			}
		}
		
		OnPointerMove(point: core.Vector): void
		{
			core.vector.Clone(point, this.CursorPosition);
			
			if (!this.SelectedShape) {
				this.OnPointerDown(point);
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
	
}