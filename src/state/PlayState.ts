/// <reference path="AbstractState" />
/// <reference path="../game/World" />
/// <reference path="../gfx/Rectangle" />
/// <reference path="../core/Math" />

namespace state {
	
	export class PlayState extends AbstractState
	{
		
		World: game.World;
		TimeScale: number;
		
		TapToStartText: gfx.Text;
		ScoreText: gfx.Text;
		RestartBtn: gfx.Text;
		MenuBtn: gfx.Text;
		FPSText: gfx.Text;
		Bar: gfx.Rectangle;
		
		InputController: core.GenericInputController;
		
		constructor(
			public Config = {SpawnTime: 3, LevelTime: 1, LevelName: '', Max: 100, SpawnLimit: 0}
		) {
			super();
		}
		
		Start(): void
		{
			super.Start();
			this.TimeScale = 0;
			
			this.World = new game.World(this.Stage.Size.x, this.Stage.Size.y, this.Config);
			this.World.OnTimesUpCallback = () => this.Timers.Delay(1, this.OnTimesUp, this);
			// this.World.Position.Set(30, 30);
			this.Stage.AddChild(this.World);
			
			this.InputController = new GameInputController(this);
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
			
			this.Stage.AddChild(
				this.Bar = new gfx.Rectangle(0, this.World.Size.y, this.World.Size.x, 30, {fillStyle: 'rgba(0, 0, 0, 0.5)'})
			);
			
			this.TapToStartText = new gfx.AAText(0, 0, "TAP TO START");
			this.TapToStartText.Anchor.Set(0.5, 0.5);
			this.Stage.AddChild(this.TapToStartText);
			
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
			
			this.InputController
				.WhenPointerClick(this.RestartBtn, () => this.Game.Play('game'))
				.WhenPointerClick(this.MenuBtn, () => this.Game.Play(game.player.CurrentChallenge()))
			
			this.OnResize();
		}
		
		Update(timeDelta: number): void
		{
			super.Update(timeDelta);
			
			// this.FPSMeter.Update(timeDelta);
			this.InputController.Update();
			this.World.Update(timeDelta * this.TimeScale);
			
			// this.FPSText.SetText(this.FPSMeter.GetFPS().toFixed(1));
			this.ScoreText.SetText(this.World.Score.toString());
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			this.Stage.Draw(ctx);
		}
		
		OnTimesUp(): void
		{
			if (this.Config.LevelName)
			{
				if (this.World.Score > game.player.GetHiScore(this.Config.LevelName))
				{
					game.player.SetHiScore(this.Config.LevelName, this.World.Score);	
				}
			}
			
			let layer = new core.Layer(this.Stage.Size.x/2, 150);
			this.World.TimeLeftText.IsVisible = false;
			
			let progress = core.math.Clamp(this.World.Score/this.Config.Max, 0, 1);
			let progressBar = new LevelScoreProgressBar(0, 0);
			progressBar.Anchor.Set(0.5, 0.5);
			progressBar.TweenFill(this.Tweens, progress)
			
			let restart = new gfx.Text(0, 100, "RESTART");
			restart.SetSize(20);
			restart.Anchor.Set(0.5, 0.5);
			restart.SetColor(game.config.color.background);
			
			let box = new gfx.Rectangle(restart.Position.x, restart.Position.y, restart.Size.x + 20, restart.Size.y + 10, {fillStyle: 'white'});
			box.Anchor.Set(0.5, 0.5);
			
			let select = new gfx.AAText(0, 160, "LEVEL SELECT");
			select.Anchor.Set(0.5, 0.5);
			
			layer.AddChild(progressBar);
			layer.AddChild(box);
			layer.AddChild(restart);
			layer.AddChild(select);
			
			this.Stage.AddChild(layer);
			
			this.MenuBtn.RemoveFromParent();
			this.RestartBtn.RemoveFromParent();
			
			this.Tweens.New(this.ScoreText.Position)
				.To({y: 100}, 1, core.easing.OutCubic)
				.Parallel(this.ScoreText.Scale, (t) => t.To({x: 2, y: 2}))
				.Start();
			
			this.InputController = new core.GenericInputController()
				.WhenPointerClick(restart, () => this.Game.Play('game'))
				.WhenPointerClick(select, () => this.Game.Play(game.player.CurrentChallenge()));
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.World.Size.y =	this.Stage.Size.y - this.Bar.Size.y;
			this.World.Size.x = this.Stage.Size.x;
			this.World.TimeLeftText.Position.Set(this.World.Size.x / 2, this.World.Size.y / 3);
			
			this.Bar.Position.Set(0, this.World.Size.y);
			this.Bar.Size.x = this.World.Size.x;
			
			this.TapToStartText.Position.Set(this.World.Size.x/2, this.World.Size.y/2);
			this.ScoreText.Position.Set(this.World.Size.x/2, this.World.Size.y + 13.5);
			this.RestartBtn.Position.Set(this.World.Size.x - 10, this.World.Size.y + 13.5);
			this.MenuBtn.Position.Set(10, this.World.Size.y + 13.5);
			this.FPSText.Position.Set(10.5, 10.5);
		}
	}
	
	class GameInputController extends core.GenericInputController implements core.IInputController
	{
		CursorPosition = new core.Vector();
		SelectedShape: game.shapes.AbstractShape;
		
		constructor(
			private State: PlayState
		) {
			super();
		}
		
		OnPointerDown(point: core.Vector): void
		{
			core.vector.Clone(point, this.CursorPosition);
			
			let shape = this.State.World.GetShapeUnder(this.CursorPosition);
			
			if (shape) {
				shape.Trajectory = [];
				this.SelectedShape = shape;
			}
			
			super.OnPointerDown(point);
		}
		
		OnPointerUp(point: core.Vector): void
		{
			if (this.State.TapToStartText.Parent)
			{
				this.State.TimeScale = 1;
				this.State.TapToStartText.RemoveFromParent();
			}
			
			if (this.SelectedShape)
			{
				this.State.World.FinishTrajectory(this.SelectedShape);
				this.SelectedShape = undefined;
			}
			
			super.OnPointerUp(point);
		}
		
		OnPointerMove(point: core.Vector): void
		{
			core.vector.Clone(point, this.CursorPosition);
			
			if (!this.SelectedShape && this.State.World.IsPointInside(point))
			{
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