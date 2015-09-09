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
		TimeElapse: number = 0;
		Worlds: game.World[];
		WorldsTimeScale: number;
		
		Title: core.Layer;
		PlayBtn: core.Layer;
		TutorialBtn
		Menus: core.Layer;
		Version: gfx.Text;
		
		FPS: gfx.AAText;
		InputController: core.GenericInputController;
		
		Start(): void
		{
			super.Start();
			
			this.Worlds = [];
			this.WorldsTimeScale = 12;
			
			this.FPS = new gfx.AAText(10, 10);
			this.FPS.SetSize(10);
		
			
			this.MakeTitle();
			this.MakePlayBtn();
			this.MakeMenus();
			
			this.Version = new gfx.Text(0, 0, "0.8B");
			this.Version.SetSize(10);
			this.Version.Anchor.Set(1, 1);
			this.Version.Cache();
		
			this.Tweens.New(this.PlayBtn)
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
			
			this.InputController = new core.GenericInputController();
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
			this.InputController
				.WhenPointerClick(this.PlayBtn, () => this.Game.Play(game.player.PassedTutorial() ? 'precision-challenge' : 'tutorial'))
				.WhenPointerClick(this.TutorialBtn, () => this.Game.Play('tutorial'));
				// .WhenPointerClick(clearBtn, () => {game.player.ClearData(); clearBtn.SetText("DONE")});
				
			this.OnResize();
			
			this.MakeBackground();
			this.Stage.AddChild(this.FPS, this.Title, this.PlayBtn, this.Menus, this.Version);
		}
		
		Update(timeDelta: number)
		{
			this.TimeElapse += timeDelta;
			this.FPSMeter.Update(timeDelta);
			
			let fps = this.FPSMeter.GetFPS();
			this.FPS.SetText(fps.toFixed(1));
			
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
			
			let centerX = this.Stage.Size.x/2,
				centerY = this.Stage.Size.y/2,
				scaleH = this.Stage.Size.y/this.DefaultSize.y;
			
			this.Title.Position.Set(centerX, centerY - 100 * scaleH);
			this.PlayBtn.Position.Set(centerX, centerY - 10 * scaleH);
			this.Menus.Position.Set(centerX, centerY + 70 * scaleH);
			this.Version.Position.Set(this.Stage.Size.x - 10, this.Stage.Size.y - 10);
		}
		
		MakeBackground(): void
		{
			for (let i = 2; i >= 1; --i)
			{
				let scale = 1/(i/2 + 1);
				let world = new SimpleWorld(this.Stage.Size.x, this.Stage.Size.y, { SpawnTime: 0.5, LevelTime: 1E9, SpawnLimit: 0 });
				world.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/2);
				world.Scale.Set(scale, (i & 1 ? -1 : 1) * scale);
				world.Anchor.Set(0.5, 0.5);
				// world.ShapesBrightness = scale;
				world.Alpha = scale;
				vec.Scale(world.Size, 1/scale);
				world.TimeLeftText.IsVisible = false;
				
				this.Stage.AddChild(world);
				this.Worlds.push(world);
			};
			
			this.Tweens.New(this)
				.To({WorldsTimeScale: 1}, 2, core.easing.OutCubic)
				.Start();
		}
		
		MakePlayBtn(): void
		{
			let playBtn = new core.Layer(0, 100);
			playBtn.Anchor.Set(0.5, 0.5);
			playBtn.Scale.Set(2, 2);
			
			let playTxt = new gfx.Text(5, 5, "PLAY");
			
			let playBox = new gfx.Rectangle(0, 0, playTxt.Size.x + 10, playTxt.Size.y + 10, {strokeStyle: 'white', fillStyle: 'rgba(0, 0, 0, 0.2)'});
			
			playBtn.AddChild(playBox, playTxt)
			vec.Clone(playBox.Size, playBtn.Size);
			playBtn.Cache();
			
			this.PlayBtn = playBtn;
		}
		
		MakeMenus(): void
		{
			let tutorialBtn = new gfx.Text(0, 0, "TUTORIAL");
			tutorialBtn.Cache();
			tutorialBtn.Anchor.Set(0.5, 0.5);
			this.TutorialBtn = tutorialBtn;
			
			let voteBtn = new gfx.Text(0, 60, "VOTE");
			voteBtn.Cache();
			voteBtn.Anchor.Set(0.5, 0.5);
			
			// let clearBtn = new gfx.AAText(0, 90, "CLEAR DATA");
			// clearBtn.Anchor.Set(0.5, 0.5);
			// clearBtn.SetSize(10);
			
			this.Menus = new core.Layer();
			this.Menus.AddChild(tutorialBtn, voteBtn);
		}
		
		MakeTitle(): void
		{
			this.Title = new core.Layer();
			 
			let shapes = new gfx.Text(0, 0, "SHAPES");
			
			let heart = new gfx.Text(shapes.Size.x + 20, 0, "♥");
			heart.SetColor('red');
			heart.Anchor.Set(0.5, 0);
			
			let numbers = new gfx.Text(heart.Position.x + 20, 0, "NUMBERS");
			
			let width = numbers.Position.x + numbers.Size.x;
			this.Title.Size.Set(width, shapes.Size.y);
			this.Title.Anchor.Set(heart.Position.x/width, 0.5);
			this.Title.AddChild(shapes, heart, numbers);
			this.Title.Cache();
		}	
	}
	
	class SimpleWorld extends game.World
	{
		InactiveSquarCache: HTMLCanvasElement;
		ActiveSquarCache: HTMLCanvasElement;
		ShapesBrightness: number = 1;
		
		Update(timeDelta): void
		{
			this.Tweens.Update(timeDelta);
			this.Timers.Update(timeDelta);
			this.UpdateShapes(timeDelta);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			for(let c of this.Children) c.Draw(ctx);
		}
		
		UpdateShapes(timeDelta: number): void
		{
			let tmp = vec.Tmp;
			
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				vec.Clone(shape.Velocity, tmp);
				vec.Scale(tmp, timeDelta);
				vec.Add(shape.Position, tmp, shape.Position);
				shape.Rotation += Math.PI * timeDelta;
				
				if (
					shape.Position.y < 0 || shape.Position.y > this.Size.y ||
					shape.Position.x < 0 || shape.Position.x > this.Size.x
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
			
			let shape = this.ShapesTail;
			shape.Color = core.Brightness(shape.Color, this.ShapesBrightness);
			
			if (this.InactiveSquarCache)
			{
				shape.CachedObject = this.InactiveSquarCache;
			}
			else
			{
				shape.Cache((ctx) => ctx.globalCompositeOperation = 'xor');
				this.InactiveSquarCache = shape.CachedObject;
			}
			
			if (Math.random() > 0.5) return;
			
			shape.Color = core.Brightness(game.config.color.active, this.ShapesBrightness);
			
			if (this.ActiveSquarCache)
			{
				shape.CachedObject = this.ActiveSquarCache;
			}
			else
			{
				shape.Cache((ctx) => ctx.globalCompositeOperation = 'xor');
				this.ActiveSquarCache = shape.CachedObject;
			}
			
			// if (Math.random() > 0.3) return;
			
			// let tmp = shape.Velocity.Clone(vec.Tmp);
			// vec.Scale(tmp, 20);
			
			// let dir = tmp.Clone();
			
			// vec.Add(shape.Position, tmp, dir);
			// shape.Trajectory.push(dir);
			
			// vec.Scale(tmp, 1.1);
			// vec.Add(shape.Position, tmp, tmp);
			// shape.Trajectory.push(tmp.Clone());
		}
	}
}