namespace game {
	
	class Player
	{
		get PassedTutorial(): boolean
		{
			return !!localStorage.getItem('UserPassedTutorial');
		}
		
		set PassedTutorial(value: boolean)
		{
			localStorage.setItem('UserPassedTutorial', '' + value)
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