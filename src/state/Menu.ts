/// <reference path="AbstractState" />
/// <reference path="../game/config" />
/// <reference path="../gfx/Text" />
/// <reference path="../core/Tween" />
/// <reference path="../core/Utils" />

namespace state {
	
	export class Menu extends AbstractState
	{
		Title: core.Layer;
		TimeElapse: number = 0;
		
		Tweens: core.TweenManager;
		InputController: core.GenericInputController;
		
		Start(): void
		{
			super.Start();
			this.Tweens = new core.TweenManager();
			this.InputController = new core.GenericInputController();
			this.ListenForMouseInput();
			this.ListenForTouchInput();
		
			this.Title = new core.Layer();
			// this.Title.Scale.Set(0, 0.5);
				
			let line1 = new gfx.AAText(0, 0, "GAME NAME");
			line1.Anchor.Set(0.5, 0.5);
			
			let playBtn = new gfx.Text(0, 100, "PLAY");
			playBtn.Anchor.Set(0.5, 0.5);
			playBtn.Scale.Set(2, 2);
			
			let voteBtn = new gfx.AAText(0, 200, "VOTE");
			voteBtn.Anchor.Set(0.5, 0.5);
			
			
			this.Title.AddChild(line1);
			this.Title.AddChild(playBtn);
			this.Title.AddChild(voteBtn);
			
			this.InputController
				.WhenPointerClick(playBtn, () => this.Game.Play('tutorial'));
				
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
			
			this.Stage.AddChild(this.Title);
			this.OnResize();
		}
		
		Update(timeDelta: number)
		{
			this.TimeElapse += timeDelta;
			
			if (this.TimeElapse < 1)
			{
				this.Game.Canvas.style.background = core.Brightness(game.config.color.background, this.TimeElapse);
			}
			
			this.Tweens.Update(timeDelta);
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.Title.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/4);		
		}
	}
	
}