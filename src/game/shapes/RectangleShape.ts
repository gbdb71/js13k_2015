/// <reference path="AbstractShape" />
/// <reference path="../../gfx/Text" />

namespace game.shapes {
	
	export class RectangleShape extends AbstractShape
	{
		ScoreText = new gfx.Text(0, 0);
		Rectangle: gfx.Rectangle;
		
		constructor(x: number, y: number, width: number, height: number)
		{
			super(x, y, width, height);
			// this.Rectangle = new gfx.Rectangle(0, 0, width, height);
			// this.Rectangle.Anchor.Set(0.5, 0.5);
			this.ScoreText.Anchor.Set(0.5, 0.5);
			this.ScoreText.Position.Set(width/2, height/2);
		}
		
		Update(timeDelta: number): void
		{
			this.Rotation += Math.PI * 1 * timeDelta;
			super.Update(timeDelta);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.globalCompositeOperation = 'xor';
			
			// this.Rectangle.Style.fillStyle = this.Color;
			// this.Rectangle.Draw(ctx);
			
			ctx.fillStyle = this.Color;
			ctx.fillRect(0, 0, this.Size.x, this.Size.y);
			
			this.ScoreText.SetText(this.Score.toString());
			this.ScoreText.Rotation = -this.Rotation;
			this.ScoreText.Draw(ctx);
		}
	}
	
}