/// <reference path="LevelSelect" />

namespace state {
	
	export class PrecisionChallenge extends LevelSelect
	{
		Levels: ILevelData[] = [
			{LevelName: 'World1.Level0', SpawnTime: 5, SpawnLimit: 1, LevelTime: 5, Max: 15},
			{LevelName: 'World1.Level1', SpawnTime: 3, SpawnLimit: 2, LevelTime: 10, Max: 45},
			{LevelName: 'World1.Level2', SpawnTime: 3, SpawnLimit: 5, LevelTime: 15, Max: 170},
			{LevelName: 'World1.Level3', SpawnTime: 3, SpawnLimit: 10, LevelTime: 30, Max: 600},
			{LevelName: 'World1.Level4', SpawnTime: 3, SpawnLimit: 20, LevelTime: 60, Max: 1500}
		];
		
		Start(): void
		{
			game.config.color = game.config.theme.purple;
			
			super.Start();
			this.SetChallengeName('PRECISION');

			this.InputController
				.WhenPointerClick(this.NextBtnHitBox, () => this.Game.Play('speed-challenge'));
		}
	}

}
