/// <reference path="AbstractShape" />
/// <reference path="../../gfx/Rectangle" />

namespace game.shapes {
	
	export class RectangleShape extends AbstractShape
	{
		Sprite: gfx.Rectangle;
		
		constructor(x: number, y: number, width: number, height: number)
		{
			super(x, y, width, height);
			this.Sprite = new gfx.Rectangle(0, 0, width, height, {fillStyle: 'red'});
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.globalCompositeOperation = 'xor';
			if (this.Trajectory.length > 0) {
				this.Sprite.Style.fillStyle = 'white';
			}
			this.Sprite.Draw(ctx);
		}
	}
	
}