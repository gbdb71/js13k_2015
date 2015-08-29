/// <reference path="AbstractShape" />
/// <reference path="../../gfx/Rectangle" />

namespace game.shapes {
	
	export class RectangleShape extends AbstractShape
	{
		constructor(x: number, y: number, width: number, height: number)
		{
			super(x, y, width, height);
		}
		
		Update(timeDelta: number): void
		{
			this.Rotation += Math.PI * 2 * timeDelta;
			super.Update(timeDelta);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.globalCompositeOperation = 'xor';
			ctx.fillStyle = this.Color;
			ctx.fillRect(0, 0, this.Size.x, this.Size.y);
		}
	}
	
}