/// <reference path="AbstractState" />
/// <reference path="../game/config" />
/// <reference path="../gfx/Text" />
/// <reference path="../core/Tween" />
/// <reference path="../core/Utils" />
/// <reference path="../game/Player" />

namespace state {
	
	let vec = core.vector;
	
	export class Menu extends AbstractState
	{
		Title: core.Layer;
		TimeElapse: number = 0;
		Worlds: game.World[];
		WorldsTimeScale: number;
		
		FPS: gfx.AAText;
		InputController: core.GenericInputController;
		
		Start(): void
		{
			super.Start();
			
			this.Worlds = [];
			this.WorldsTimeScale = 12;
			
			this.InputController = new core.GenericInputController();
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
			this.FPS = new gfx.AAText(10, 10);
			this.FPS.SetSize(10);
			this.Stage.AddChild(this.FPS);
		
			this.Title = new core.Layer();
			// this.Title.Scale.Set(0, 0.5);
				
			let line1 = new gfx.AAText(0, 0, "GAME NAME");
			line1.Cache();
			line1.Anchor.Set(0.5, 0.5);
			
			let playBtn = new gfx.Text(0, 100, "PLAY");
			playBtn.Cache();
			playBtn.Anchor.Set(0.5, 0.5);
			playBtn.Scale.Set(2, 2);
			
			let tutorialBtn = new gfx.AAText(0, 180, "TUTORIAL");
			tutorialBtn.Cache();
			tutorialBtn.Anchor.Set(0.5, 0.5);
			
			let voteBtn = new gfx.AAText(0, 230, "VOTE");
			voteBtn.Cache();
			voteBtn.Anchor.Set(0.5, 0.5);
			
			let clearBtn = new gfx.AAText(0, 260, "CLEAR DATA");
			clearBtn.Anchor.Set(0.5, 0.5);
			clearBtn.SetSize(10);
			
			this.Title.AddChild(line1);
			this.Title.AddChild(playBtn);
			this.Title.AddChild(tutorialBtn);
			this.Title.AddChild(voteBtn);
			// this.Title.AddChild(clearBtn);
			
			this.InputController
				.WhenPointerClick(playBtn, () => this.Game.Play(game.player.PassedTutorial ? 'select' : 'tutorial'))
				.WhenPointerClick(tutorialBtn, () => this.Game.Play('tutorial'))
				.WhenPointerClick(clearBtn, () => {game.player.ClearData(); clearBtn.SetText("DONE")});
				
			this.Tweens.New(playBtn)
				.To({Rotation: Math.PI/12}, 2, core.easing.SinusoidalInOut)
				.Then()
				.To({Rotation: -Math.PI/12}, 2, core.easing.SinusoidalInOut)
				.Then()
				.Loop()
				.Start();
			
			this.Stage.Alpha = 0;
			this.Tweens.New(this.Stage)
				.To({Alpha: 1})
				.Start();
			
			this.OnResize();
			
			this.MakeBackground();
			this.Stage.AddChild(this.Title);
		}
		
		Update(timeDelta: number)
		{
			this.TimeElapse += timeDelta;
			this.FPS.SetText((timeDelta*1000).toFixed(1));
			
			if (this.TimeElapse < 1)
			{
				this.Game.Canvas.style.background = core.Brightness(game.config.color.background, this.TimeElapse);
			}
			
			for(let w of this.Worlds) w.Update(timeDelta * this.WorldsTimeScale);
			
			super.Update(timeDelta);
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.Title.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/5);		
		}
		
		MakeBackground(): void
		{
			let layer = new core.Layer();
			for (let i = 1; i < 3; ++i)
			{
				vec.Clone(this.Stage.Size, layer.Size);
				let scale = 1/(i + 1);
				let world = new SimpleWorld(layer.Size.x, layer.Size.y, { SpawnTime: 0.5, LevelTime: 1000 });
				world.Scale.Set(scale, (i & 1 ? -1 : 1) * scale);
				world.Anchor.Set(0.5, 0.5);
				world.Alpha = scale;
				vec.Scale(world.Size, 1/scale);
				world.TimeLeftText.IsVisible = false;
				
				layer.AddChild(world);
				this.Worlds.push(world);
				
			};
			layer.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/2);	
			this.Stage.AddChild(layer)
			
			this.Tweens.New(this)
				.To({WorldsTimeScale: 1}, 2, core.easing.OutCubic)
				.Start();
		}
	}
	
	class SimpleWorld extends game.World
	{
		InactiveSquarCache: HTMLCanvasElement;
		ActiveSquarCache: HTMLCanvasElement;
		
		Update(timeDelta): void
		{
			this.Tweens.Update(timeDelta);
			this.Timers.Update(timeDelta);
			this.UpdateShapes(timeDelta);
		}
		
		UpdateShapes(timeDelta: number): void
		{
			let tmp = vec.Tmp;
			
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				vec.Clone(shape.Velocity, tmp);
				vec.Scale(tmp, timeDelta);
				vec.Add(shape.Position, tmp, shape.Position);
				shape.Rotation += Math.PI/80;
				
				if (
					shape.Position.x < 0 || shape.Position.x > this.Size.x ||
					shape.Position.y < 0 || shape.Position.y > this.Size.y
				)
				{
					this.RemoveShape(shape);
					shape.RemoveFromParent();
				}
			}
		}
		
		SpawnShape(): void
		{
			super.SpawnShape();
			
			let shape = this.ShapesTail, tmp = vec.Tmp;
			
			if (this.InactiveSquarCache)
			{
				shape.CachedObject = this.InactiveSquarCache;
			}
			else
			{
				shape.Cache();
				this.InactiveSquarCache = shape.CachedObject;
			}
			
			if (Math.random() > 0.5) return;
			
			shape.Color = game.config.color.active;
			
			if (this.ActiveSquarCache)
			{
				shape.CachedObject = this.ActiveSquarCache;
			}
			else
			{
				shape.Cache();
				this.ActiveSquarCache = shape.CachedObject;
			}
			
			// vec.Clone(shape.Velocity, tmp);
			// vec.Scale(tmp, 20);
			// vec.Add(shape.Position, tmp, tmp);
			// shape.Trajectory.push(tmp.Clone());
			
			// vec.Scale(tmp, 1.1);
			// shape.Trajectory.push(tmp.Clone());
		}
	}
}