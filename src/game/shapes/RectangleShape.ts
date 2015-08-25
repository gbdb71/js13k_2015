/// <reference path="AbstractShape" />
/// <reference path="../../gfx/Rectangle" />

namespace game.shapes {
	
	export class RectangleShape extends AbstractShape
	{
		Sprite: gfx.Rectangle;
		
		constructor(x: number, y: number, width: number, height: number)
		{
			super(x, y, width, height);
			this.Sprite = new gfx.Rectangle(0, 0, width, height);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			this.Sprite.Draw(ctx);
		}
	}
	
}