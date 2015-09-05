/// <reference path="AbstractState" />
/// <reference path="../game/config" />
/// <reference path="../gfx/Text" />
/// <reference path="../core/Tween" />
/// <reference path="../core/Utils" />
/// <reference path="../game/Player" />

namespace state {
	
	export class Menu extends AbstractState
	{
		Title: core.Layer;
		TimeElapse: number = 0;
		
		InputController: core.GenericInputController;
		
		Start(): void
		{
			super.Start();
			
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
			
			let tutorialBtn = new gfx.AAText(0, 180, "TUTORIAL");
			tutorialBtn.Anchor.Set(0.5, 0.5);
			
			let voteBtn = new gfx.AAText(0, 230, "VOTE");
			voteBtn.Anchor.Set(0.5, 0.5);
			
			let clearBtn = new gfx.AAText(0, 260, "CLEAR DATA");
			clearBtn.Anchor.Set(0.5, 0.5);
			clearBtn.SetSize(10);
			
			
			this.Title.AddChild(line1);
			this.Title.AddChild(playBtn);
			this.Title.AddChild(tutorialBtn);
			this.Title.AddChild(voteBtn);
			this.Title.AddChild(clearBtn);
			
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
			
			super.Update(timeDelta);
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.Title.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/5);		
		}
	}
	
}