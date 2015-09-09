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
		
		CurrentChallenge(value?: string): string
		{
			if (value)
			{
				localStorage.setItem('CurrentChallenge', value)
			}
			return localStorage.getItem('CurrentChallenge');
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
	
	if (typeof localStorage === 'object')
	{
		let showMessage = true;
		try 
		{
			localStorage.setItem('storageTest', '1');
			localStorage.removeItem('storageTest');
		}
		catch (e)
		{
			Storage.prototype.setItem = function() 
			{
				if (showMessage) alert('If you want to save your scores please leave private browsing.');
				showMessage = false;
			};	
		}
	}
	
	export var player = new Player();
	
}