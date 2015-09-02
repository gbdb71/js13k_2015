/// <reference path="AbstractState" />
/// <reference path="../gfx/Text" />
/// <reference path="../gfx/Rectangle" />
/// <reference path="PlayState" />

namespace state {
	
	interface ILevelDefinition
	{
		SpawnTime: number;
		LevelTime: number;
		Min: number;
		Max: number;	
	}
	
	export class LevelSelect extends AbstractState
	{
		Levels: ILevelDefinition[] = [
			{SpawnTime: 4, LevelTime: 10, Min: 50, Max: 200},
			{SpawnTime: 3, LevelTime: 15, Min: 50, Max: 200},
			{SpawnTime: 3, LevelTime: 30, Min: 50, Max: 200},
			{SpawnTime: 3, LevelTime: 60, Min: 50, Max: 200}
		];
		
		InputController: core.GenericInputController;
		
		Start(): void
		{
			super.Start();
			
			this.InputController = new core.GenericInputController();
			this.ListenForMouseInput();
			this.ListenForTouchInput();
			
			let challangeText = new gfx.AAText(this.Stage.Size.x/2, 10, "CHALANGE");
			challangeText.Anchor.Set(0.5, 0);
			challangeText.SetSize(10);
			this.Stage.AddChild(challangeText);
			
			let challangeType = new gfx.AAText(this.Stage.Size.x/2, 30, "PRECISION");
			challangeType.Anchor.Set(0.5, 0);
			this.Stage.AddChild(challangeType);
			
			this.Levels.forEach((definition, index) => 
			{
				let btn = this.CreateLevelBtn(index);
				btn.Position.Set(20, 70 + index * 80);
				this.Stage.AddChild(btn);
				
				this.InputController.WhenPointerDown(btn, () => {
					this.Game.AddState('game', new PlayState(definition));
					this.Game.Play('game');
				})
			});
			
			this.ResizeStrategy.OnResize();
		}
		
		CreateLevelBtn(index: number): core.DisplayObject
		{
			console.log('btn i', index);
			
			let layer = new core.Layer(0, 0, 275, 50);
			
			let indexText = new gfx.AAText(0, 0, index.toString());
			indexText.SetSize(40);
			layer.AddChild(indexText);
			
			let score = new gfx.AAText(50, 0, "HI-SCORE: 10");
			score.SetSize(10);
			layer.AddChild(score);
			
			let bad = new gfx.AAText(55, 25, "BAD")
			bad.SetSize(10);
			layer.AddChild(bad);
			
			let awesome = new gfx.AAText(245, 25, "AWESOME")
			awesome.SetSize(10);
			awesome.Anchor.Set(1, 0);
			layer.AddChild(awesome);
			
			let progress = new gfx.Rectangle(50.5, 20.5, 200, 20, {strokeStyle: 'white'});
			layer.AddChild(progress);
			
			let fill = new gfx.Rectangle(50.5, 20.5, Math.random() * 200, 20, {fillStyle: 'white', compositeOperation: 'xor'});
			layer.AddChild(fill);
			
			let bg = new gfx.Rectangle(-10, -10, 285, 60, {fillStyle: 'rgba(0, 0, 0, 0.5)', compositeOperation: 'destination-over'});
			layer.AddChild(bg);
			
			return layer;
		}
			
	}
	
}