/// <reference path="AbstractState" />
/// <reference path="../game/World" />
/// <reference path="../gfx/Rectangle" />
/// <reference path="../core/Math" />

namespace state {
	
	export class PlayState extends AbstractState
	{
		
		World: game.World;
		
		ScoreText: gfx.Text;
		RestartBtn: gfx.Text;
		MenuBtn: gfx.Text;
		FPSText: gfx.Text;
		Bar: gfx.Rectangle;
		
		BarInputController: core.GenericInputController;
		
		constructor(
			public Config = {SpawnTime: 3, LevelTime: 15}
		) {
			super();
		}
		
		Start(): void
		{
			super.Start();
			
			this.World = new game.World(this.Stage.Size.x, this.Stage.Size.y, this.Config);
			this.World.OnTimesUpCallback = this.OnTimesUp.bind(this);
			// this.World.Position.Set(30, 30);
			this.Stage.AddChild(this.World);
			
			this.InputController = new GameInputController(this);
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
			this.Stage.AddChild(
				this.Bar = new gfx.Rectangle(0, this.World.Size.y, this.World.Size.x, 30, {fillStyle: 'rgba(0, 0, 0, 0.5)'})
			);
			
			this.ScoreText = new gfx.AAText(0, 0);
			this.ScoreText.Anchor.Set(0.5, 0.5)
			this.ScoreText.SetSize(15);
			this.Stage.AddChild(this.ScoreText);
			
			this.RestartBtn = new gfx.AAText(0, 0, "RESTART");
			this.RestartBtn.SetSize(10);
			this.RestartBtn.Anchor.Set(1, 0.5);
			this.Stage.AddChild(this.RestartBtn);
			
			this.MenuBtn = new gfx.AAText(0, 0, "MENU");
			this.MenuBtn.SetSize(10);
			this.MenuBtn.Anchor.Set(0, 0.5);
			this.Stage.AddChild(this.MenuBtn);
			
			this.FPSText = new gfx.AAText(0, 0);
			this.FPSText.SetSize(10);
			this.Stage.AddChild(this.FPSText);
			
			this.BarInputController = new core.GenericInputController()
				.WhenPointerDown(this.RestartBtn, () => this.Game.Play('game'))
				.WhenPointerDown(this.MenuBtn, () => this.Game.Play('level-select'))
			
			this.OnResize();
		}
		
		OnPointerDown(point: core.Vector): void
		{
			this.InputController.OnPointerDown(point);
			this.BarInputController.OnPointerDown(point);
		}
		
		Update(timeDelta: number): void
		{
			this.World.Update(timeDelta);
			this.InputController.Update();
			
			this.FPSText.SetText((timeDelta*1000).toFixed(1));
			this.ScoreText.SetText(this.World.Score.toString());
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
			
			let box = new gfx.Rectangle(restart.Position.x, restart.Position.y, restart.Size.x + 20, restart.Size.y + 10, {fillStyle: 'white', compositeOperation: 'xor'});
			box.Anchor.Set(0.5, 0.5);
			
			let menu = new gfx.AAText(this.World.Size.x/2, this.World.Size.y/2 + 50, "MENU");
			menu.Anchor.Set(0.5, 0.5);
			
			this.Stage.AddChild(restart);
			this.Stage.AddChild(box);
			this.Stage.AddChild(menu);
			
			this.InputController = new core.GenericInputController()
				.WhenPointerDown(restart, () => this.Game.Play('game'))
				.WhenPointerDown(menu, () => this.Game.Play('level-select'));
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.World.Size.y =	this.Stage.Size.y - this.Bar.Size.y;
			
			this.Bar.Position.Set(0, this.World.Size.y);
			this.ScoreText.Position.Set(this.World.Size.x/2, this.World.Size.y + 13.5);
			this.RestartBtn.Position.Set(this.World.Size.x - 10, this.World.Size.y + 13.5);
			this.MenuBtn.Position.Set(10, this.World.Size.y + 13.5);
			this.FPSText.Position.Set(10.5, 10.5);
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
			
			if (this.SelectedShape && !this.State.World.IsPointInside(this.CursorPosition))
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