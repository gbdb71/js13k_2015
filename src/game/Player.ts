namespace game {
	
	class Player
	{
		PassedTutorial(value?: boolean): boolean
		{
			if (value)
			{
				localStorage.setItem('UserPassedTutorial', value.toString());
			}
			return !!localStorage.getItem('UserPassedTutorial');
		}
		
		GetHiScore(levelName: string): number
		{
			return parseInt(localStorage.getItem('HiScore.' + levelName), 10) || 0;
		}
		
		SetHiScore(levelName: string, score: number): void
		{
			localStorage.setItem('HiScore.' + levelName, score.toString());
		}
		
		ClearData(): void
		{
			localStorage.clear();
		}
	}
	
	export var player = new Player();
	
}