/// <reference path="PlayState" />
/// <reference path="../core/Timer" />

namespace state {
	
	let vec = core.vector;
	
	export class Tutorial extends PlayState
	{
		Timers: core.TimersManager;
		Tweens: core.TweenManager;
		
		StepTip = [
			"SEE THIS RED SQUARE?",
			"THIS IS ITS TRAJECTORY",
			"YOUR AIM IN THIS GAME",
			"IS TO",
			"REVERSE ITS TRAJECTORY",
			"LIKE THAT",
			"SO IT WILL HIT THE BOTTOM",
			"THEN YOU EARN POINTS",
			"BUT, YOU HAVE TO",
			"DO THIS BEFORE",
			"TIMES RUN OUT",
			"GOT IT?",
			""
		]
		
		Tip: gfx.Text;
		TapToContinue: gfx.Text;
		CurrentTip: number;
		
		constructor()
		{
			super({SpawnTime: 15, LevelTime: 15, LevelName: ''});
		}
		
		Start(): void
		{
			super.Start();
			let centerX = this.Stage.Size.x/2, centerY = this.Stage.Size.y/2;
			
			this.TimeScale = 1;
			this.Timers = new core.TimersManager();
			this.Tweens = new core.TweenManager();
		
			let tip = new gfx.AAText(centerX, 100);
			tip.SetSize(15);
			tip.Anchor.Set(0.5, 0.5);
			
			this.Tip = tip;
			this.CurrentTip = 0;
			
			let tapToContinue = new gfx.AAText(centerX, 130, "TAP TO CONTINIUE");
			tapToContinue.Anchor.Set(0.5, 0.5);
			tapToContinue.SetSize(10);
			tapToContinue.Alpha = 0.7;
			this.TapToContinue = tapToContinue;
				
			this.TapToStartText.RemoveFromParent();
			this.InputController = new core.GenericInputController();
			
			this.Timers.Delay(1.5, () => {
				this.TimeScale = 0;
				tip.SetText(this.StepTip[this.CurrentTip++]);
				
				
				this.Stage.AddChild(tapToContinue);
				this.Stage.AddChild(tip);
					
				this.InputController
					.WhenPointerClick(this.Stage, this.ExecuteTip.bind(this));
			});
		}
		
		Update(timeDelta: number): void
		{
			this.Timers.Update(timeDelta);
			super.Update(timeDelta);
		}
		
		ExecuteTip(): void
		{
			this.Tip.SetText(this.StepTip[this.CurrentTip]);
			
			switch (this.CurrentTip)
			{
				case 1:
					this.AddTrajctory(this.World.ShapesHead);
					break;
				
				case 2:
				case 3:
				case 4:
					break;
					
				case 5:
					this.ReverseTrajectory(this.World.ShapesHead);
					break;
					
				case 6:
					this.TimeScale = 1;
					if (this.World.Score < 1)
					{
						if (this.TapToContinue.Parent) 
						{
							this.TapToContinue.RemoveFromParent();
						}
						this.Timers.Delay(0.1, () => this.ExecuteTip());
						return;
					}
					this.TimeScale = 0;
					this.Stage.AddChild(this.TapToContinue);
					this.Timers.RemoveAll();
					break;
					
				case 7:
					this.TimeScale = 1;
					this.Timers.Delay(1.5, () => this.TimeScale = 0);
					break;
					
				case 8:
				case 9:
					break;
					
				case 10:
					this.TimeScale = 1;
					this.World.Update(this.World.TimeLeft - 5.5);
					this.Timers.Delay(5.3, () => this.TimeScale = 0);
					
				case 11:
					break;
					
				case 12:
					this.Game.Play('select');
					game.player.PassedTutorial = true;
					return;
					
				default: throw Error();	
			}
			
			this.CurrentTip += 1;
		}
		
		AddTrajctory(shape: game.shapes.AbstractShape): void
		{
			let point = vec.Tmp;
			
			vec.Clone(shape.Velocity, point);
			vec.Scale(point, 10);
			vec.Add(point, shape.Position, point);
			
			shape.AddTrajectoryPoint(shape.Position);
			shape.AddTrajectoryPoint(point);
		}
		
		ReverseTrajectory(shape: game.shapes.AbstractShape): void
		{
			let point = vec.Tmp;
			
			shape.Trajectory = [];
			
			vec.Clone(shape.Velocity, point);
			vec.Add(point, shape.Position, point);
			
			shape.AddTrajectoryPoint(shape.Position);
			shape.AddTrajectoryPoint(point);
			
			point.Set(this.World.Size.x/2 + core.Random(-30, 30), this.World.Size.y/2 + 50);
			shape.AddTrajectoryPoint(point);
			
			point.Set(this.World.Size.x/2, this.World.Size.y + 50);
			shape.AddTrajectoryPoint(point);
		}

	}
	
}