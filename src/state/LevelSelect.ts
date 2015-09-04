/// <reference path="AbstractState" />
/// <reference path="../gfx/Text" />
/// <reference path="../gfx/Rectangle" />
/// <reference path="PlayState" />

namespace state {
	
	interface ILevelData
	{
		SpawnTime: number;
		LevelTime: number;
		Min: number;
		Max: number;
		LevelName: string;	
	}
	
	export class LevelSelect extends AbstractState
	{
		Levels: ILevelData[] = [
			{LevelName: 'World1.Level1', SpawnTime: 5, LevelTime: 5, Min: 0, Max: 15},
			{LevelName: 'World1.Level2', SpawnTime: 3, LevelTime: 15, Min: 50, Max: 200},
			{LevelName: 'World1.Level3', SpawnTime: 3, LevelTime: 30, Min: 50, Max: 600},
			{LevelName: 'World1.Level4', SpawnTime: 3, LevelTime: 60, Min: 100, Max: 1000}
		];
		
		InputController: core.GenericInputController;
		Tweens: core.TweenManager;
		
		Start(): void
		{
			super.Start();
			
			this.Game.Canvas.style.background = game.config.color.background;
			
			this.InputController = new core.GenericInputController();
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
			this.Tweens = new core.TweenManager();
			
			let challangeText = new gfx.AAText(this.Stage.Size.x/2, 10, "CHALANGE");
			challangeText.Anchor.Set(0.5, 0);
			challangeText.SetSize(10);
			this.Stage.AddChild(challangeText);
			
			let challangeType = new gfx.AAText(this.Stage.Size.x/2, 30, "PRECISION");
			challangeType.Anchor.Set(0.5, 0);
			this.Stage.AddChild(challangeType);
			
			let buttons: Array<[core.DisplayObject, core.Tween]> = [];
			this.Levels.forEach((levelData, index) => 
			{
				let btn = new LevelButton(index, levelData);
				btn.Position.Set(index & 1? this.Stage.Size.x + btn.Size.x : -btn.Size.x, 120 + index * 70);
				btn.Anchor.Set(0.5, 0.5);
				this.Stage.AddChild(btn);
				
				let appearTween = this.Tweens.New(btn.Position)
					.To({x: this.Stage.Size.x/2}, 1, core.easing.OutCubic)
					.WhenDone(() => btn.StartTweens(this.Tweens))
					.Start();
					
				buttons.push([btn, appearTween]);
				
				this.InputController.WhenPointerClick(btn, () =>
				{
					this.Tweens.New(btn.Scale)
						.To({x: 1.1, y: 1.1}, 1, core.easing.OutCubic)
						.WhenDone(() => {
							this.Game.AddState('game', new PlayState(levelData));
							this.Game.Play('game');
						})
						.Start();
						
					for (let [otherBtn, appearTween] of buttons)
					{
						if (otherBtn === btn) continue;
						appearTween.Reverse().Start();
					}	
				})
			});
			
			let menuBtn = new gfx.AAText(40, 30, "MENU");
			menuBtn.Anchor.Set(0.5, 0.5);
			menuBtn.SetSize(10);
			
			let menuBtnHitbox = new gfx.Rectangle(menuBtn.Position.x, menuBtn.Position.y, 50, 30, {strokeStyle: 'white'});
			menuBtnHitbox.Anchor.Set(0.5, 0.5);
			menuBtnHitbox.IsVisible = false;
			
			this.Stage.AddChild(menuBtnHitbox);
			
			this.InputController
				.WhenPointerClick(menuBtnHitbox, () => this.Game.Play('menu'));
			
			this.Stage.AddChild(menuBtn);
			this.OnResize();
		}
		
		Update(timeDelta: number): void
		{
			this.Tweens.Update(0.016);
		}
			
	}
	
	class LevelButton extends core.Layer
	{
		Fill: gfx.Rectangle;
		Data: ILevelData;
		Score: number;
		
		constructor(index: number, data: ILevelData)
		{
			const btnWidth = 250, btnHeight = 40;
			super(0, 0, btnWidth, btnHeight);
			
			this.Data = data;

			let indexText = new gfx.AAText(0, 0, index.toString());
			indexText.SetSize(40);
			indexText.SetColor(game.config.color.inactive);
			this.AddChild(indexText);

			this.Score = game.player.GetHiScore(data.LevelName);
			let score = new gfx.AAText(50, 0, "HI-SCORE: " + this.Score);
			score.SetSize(10);
			this.AddChild(score);

			let timeText = new gfx.AAText(251, 0, "TIME: " + data.LevelTime)
			timeText.SetSize(10);
			timeText.Anchor.Set(1, 0);
			this.AddChild(timeText);

			let bad = new gfx.AAText(55, 25, "BAD")
			bad.SetSize(10);
			this.AddChild(bad);

			let awesome = new gfx.AAText(245, 25, "AWESOME")
			awesome.SetSize(10);
			awesome.Anchor.Set(1, 0);
			this.AddChild(awesome);

			let progress = new gfx.Rectangle(50.5, 20.5, 200, 20, { strokeStyle: 'white' });
			this.AddChild(progress);

			let fill = new gfx.Rectangle(51.5, 21.5, 200 - 2, 20 - 2, {fillStyle: 'white', compositeOperation: 'xor'});
			fill.Scale.Set(0, 1);
			this.AddChild(this.Fill = fill);

			let bg = new gfx.Rectangle(btnWidth / 2, btnHeight / 2, btnWidth + 20, btnHeight + 20, { fillStyle: 'rgba(0, 0, 0, 0.5)', compositeOperation: 'destination-over' });
			bg.Anchor.Set(0.5, 0.5);
			this.AddChild(bg);
		}
	
		StartTweens(tweens: core.TweenManager): void
		{
			let progress = core.math.Clamp((this.Score - this.Data.Min)/(this.Data.Max - this.Data.Min), 0, 1);
			
			let tween = tweens.New(this.Fill.Scale)
				.To({x: progress}, 1,core.easing.OutCubic)
				.Start();
				
			if (progress === 1)
			{
				tween.WhenDone(() => this.Fill.Style.fillStyle = game.config.color.other);
			}
		}
	}
	
}