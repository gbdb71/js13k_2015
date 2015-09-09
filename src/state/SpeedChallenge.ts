/// <reference path="LevelSelect" />

namespace state {
	
	export class SpeedChalenge extends LevelSelect
	{
		Levels: ILevelData[] = [
			{LevelName: 'World2.Level0', SpawnTime: 1, SpawnLimit: 8, LevelTime: 10, Max: 250},
			{LevelName: 'World2.Level1', SpawnTime: 1, SpawnLimit: 13, LevelTime: 15, Max: 500},
			{LevelName: 'World2.Level2', SpawnTime: 1, SpawnLimit: 28, LevelTime: 30, Max: 1400},
			{LevelName: 'World2.Level3', SpawnTime: 1, SpawnLimit: 58, LevelTime: 60, Max: 2800}
		];
		
		Start(): void
		{
			game.config.color = game.config.theme.blue;
			
			super.Start();
			this.SetChallengeName('SPEED');
			this.NextBtn.SetText("PREV");
			
			this.InputController
				.WhenPointerClick(this.NextBtnHitBox, () => this.Game.Play('precision-challenge'));
		}
	}
	
}