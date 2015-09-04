/// <reference path="AbstractState" />
/// <reference path="../game/config" />
/// <reference path="../gfx/Text" />
/// <reference path="../core/Tween" />

namespace state {
	
	export class BootState extends AbstractState
	{
		Title: core.Layer;
		Tweens: core.TweenManager;
		
		Start(): void
		{
			super.Start();
			this.Game.Canvas.style.background = 'black';
			this.Tweens = new core.TweenManager();
		
			this.Title = new core.Layer();
			this.Title.Scale.Set(0.5, 0.5);
				
			let line1 = new gfx.AAText(0, 0, "A GAME BY KAKUS");
			line1.Anchor.Set(0.5, 0.5);
			
			let line2 = new gfx.AAText(0, line1.Size.y + 10, "MADE FOR JS13K WITH ");
			line2.Anchor.Set(0.5, 0.5);
			
			let heart = new gfx.AAText(line2.Size.x/2, line2.Position.y, "♥");
			heart.Anchor.Set(0, 0.5);
			heart.SetColor('red');
			
			let year = new gfx.AAText(0, line2.Position.y + 300, "2015");
			year.Anchor.Set(0.5, 0.5);
			
			this.Title.AddChild(line1)
			this.Title.AddChild(line2)
			this.Title.AddChild(heart)
			this.Title.AddChild(year)
			
			this.Stage.Alpha = 0;
			this.Tweens.New(this.Stage)
				.To({Alpha: 1})
				.Then()
				.Delay(1)
				.Then()
				.To({Alpha: 0})
				.WhenDone(() => this.Game.Play('level-select'))
				.Start();
			
			this.Stage.AddChild(this.Title);
			this.OnResize();
		}
		
		Update(timeDelta: number)
		{
			this.Tweens.Update(timeDelta);
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.Title.Position.Set(this.Stage.Size.x/2, this.Stage.Size.x/2.5);		
		}
	}
	
}