/// <reference path="AbstractState" />
/// <reference path="../gfx/Text" />
/// <reference path="../gfx/Rectangle" />
/// <reference path="PlayState" />

namespace state {
	
	export interface ILevelData
	{
		SpawnTime: number;
		LevelTime: number;
		Max: number;
		LevelName: string;
		SpawnLimit: number;
	}
	
	export class LevelSelect extends AbstractState
	{
		Levels: ILevelData[] = [
			{LevelName: 'World1.Level0', SpawnTime: 5, SpawnLimit: 1, LevelTime: 5, Max: 15},
			{LevelName: 'World1.Level1', SpawnTime: 3, SpawnLimit: 2, LevelTime: 10, Max: 45},
			{LevelName: 'World1.Level2', SpawnTime: 3, SpawnLimit: 5, LevelTime: 15, Max: 170},
			{LevelName: 'World1.Level3', SpawnTime: 3, SpawnLimit: 10, LevelTime: 30, Max: 600},
			{LevelName: 'World1.Level4', SpawnTime: 3, SpawnLimit: 20, LevelTime: 60, Max: 1500}
		];
		
		InputController: core.GenericInputController;
		ChallangeName: gfx.Text;
		NextBtn: gfx.Text;
		NextBtnHitBox: gfx.Rectangle;
		
		Start(): void
		{
			super.Start();
			this.OnResize();
			
			this.Game.Canvas.style.background = game.config.color.background;
			
			this.InputController = new core.GenericInputController();
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
			let challangeText = new gfx.AAText(this.Stage.Size.x/2, 10, "CHALLENGE");
			challangeText.Anchor.Set(0.5, 0);
			challangeText.SetSize(10);
			this.Stage.AddChild(challangeText);
			
			this.ChallangeName = new gfx.AAText(this.Stage.Size.x/2, 30);
			this.ChallangeName.Anchor.Set(0.5, 0);
			this.Stage.AddChild(this.ChallangeName);
			
			
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
				});
				
				this.InputController
					.WhenPointerDown(btn, () => btn.OnPress())
					.WhenPointerUp(this.Stage, () => btn.OnRelease());
			});
			
			let menuBtn = new gfx.AAText(40, 30, "MENU");
			menuBtn.Anchor.Set(0.5, 0.5);
			menuBtn.SetSize(10);
			
			let menuBtnHitbox = new gfx.Rectangle(menuBtn.Position.x, menuBtn.Position.y, 50, 30, {strokeStyle: 'white'});
			menuBtnHitbox.Anchor.Set(0.5, 0.5);
			menuBtnHitbox.IsVisible = false;
			
			this.NextBtn = new gfx.AAText(this.Stage.Size.x - 40, menuBtn.Position.y, "NEXT");
			this.NextBtn.Anchor.Set(0.5, 0.5);
			this.NextBtn.SetSize(10);
			
			this.NextBtnHitBox = new gfx.Rectangle(this.NextBtn.Position.x, this.NextBtn.Position.y, 50, 30, {strokeStyle: 'white'});
			this.NextBtnHitBox.Anchor.Set(0.5, 0.5);
			this.NextBtnHitBox.IsVisible = false;
			
			this.Stage.AddChild(menuBtn, menuBtnHitbox, this.NextBtn, this.NextBtnHitBox);
			
			this.InputController
				.WhenPointerClick(menuBtnHitbox, () => this.Game.Play('menu'));
		}
		
		SetChallengeName(value: string): void
		{
			this.ChallangeName.SetText(value);
			game.player.CurrentChallenge(value.toLowerCase() + '-challenge');
		}
	}
	
	export class LevelScoreProgressBar extends core.Layer
	{
		Fill: gfx.Rectangle;
		
		constructor(x: number, y: number)
		{
			super(x, y, 200, 20);
			
			let bad = new gfx.AAText(5, 5, "BAD")
			bad.SetSize(10);
			this.AddChild(bad);

			let awesome = new gfx.AAText(195, 5, "AWESOME")
			awesome.SetSize(10);
			awesome.Anchor.Set(1, 0);
			this.AddChild(awesome);

			let progress = new gfx.Rectangle(0.5, 0.5, 200, 20, { strokeStyle: 'white' });
			this.AddChild(progress);

			this.Fill = new gfx.Rectangle(1.5, 1.5, 200 - 2, 20 - 2, {fillStyle: 'white', compositeOperation: 'xor'});
			this.Fill.Scale.Set(0.001, 1);
			this.AddChild(this.Fill);
		}
		
		TweenFill(tweens: core.TweenManager, progress: number): void
		{
			let tween = tweens.New(this.Fill.Scale)
				.To({x: Math.max(0.001, progress)}, 1,core.easing.OutCubic)
				.Start();
				
			if (progress === 1)
			{
				tween.WhenDone(() => this.Fill.Style.fillStyle = game.config.color.other);
			}
		}	
	}
	
	class LevelButton extends core.Layer
	{
		ScoreProgress: LevelScoreProgressBar;
		Data: ILevelData;
		Score: number;
		
		Border: gfx.Rectangle;
		
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
			let score = new gfx.Text(50, 0, "HI-SCORE: " + this.Score);
			score.SetSize(10);
			score.Cache();
			this.AddChild(score);

			let timeText = new gfx.Text(251, 0, "TIME: " + data.LevelTime)
			timeText.SetSize(10);
			timeText.Anchor.Set(1, 0);
			timeText.Cache();
			this.AddChild(timeText);
			
			this.ScoreProgress = new LevelScoreProgressBar(50, 20);
			this.AddChild(this.ScoreProgress);
			
			let bg = new gfx.Rectangle(btnWidth / 2, btnHeight / 2, btnWidth + 20, btnHeight + 20, { fillStyle: 'rgba(0, 0, 0, 0.3)', compositeOperation: 'destination-over' });
			bg.Anchor.Set(0.5, 0.5);
			this.AddChild(bg);
			
			this.Border = new gfx.Rectangle(bg.Position.x, bg.Position.y + bg.Size.y/2, bg.Size.x, 5, { fillStyle: 'rgba(0, 0, 0, 0.5)', compositeOperation: 'destination-over' });
			this.Border.Anchor.Set(0.5, 0);
			this.AddChild(this.Border);
		}
		
		OnPress(): void
		{
			this.Border.IsVisible = false;
			this.Position.y += this.Border.Size.y;
		}
		
		OnRelease(): void
		{
			if (!this.Border.IsVisible)
			{
				this.Border.IsVisible = true;
				this.Position.y -= this.Border.Size.y;
			}
		}
	
		StartTweens(tweens: core.TweenManager): void
		{
			let progress = core.math.Clamp(this.Score/this.Data.Max, 0, 1);
			
			this.ScoreProgress.TweenFill(tweens, progress);
		}
	}
	
}
