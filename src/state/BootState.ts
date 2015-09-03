/// <reference path="AbstractState" />
/// <reference path="../game/config" />

namespace state {
	
	export class BootState extends AbstractState
	{
		Start(): void
		{
			this.Game.Canvas.style.background = game.config.color.background;
			this.Game.Play('level-select');
		}
	}
	
}