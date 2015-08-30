/// <reference path="../core/DisplayObject" />
/// <reference path="PixelFont" />

namespace gfx {
	
	export class Text extends core.DisplayObject
	{
		DotSizePx: number;
		CharWidthPx: number;
		FontRenderer: FontChache;
		
		constructor(
			x: number, y: number,
			
			protected Text: string = "",
			protected Style = {Size: 20, Color: 'white', Font: PixelFont}
		) {
			super(x, y, 0, 0);
			
			this.SetColor(Style.Color);
			this.SetSize(Style.Size);
		}
		
		SetColor(color: string): void
		{
			if (this.Style.Font.Cache[color])
			{
				this.FontRenderer = this.Style.Font.Cache[color];
			}
			else {
				this.FontRenderer = this.Style.Font.Cache[color] = new FontChache(this.Style.Font, this.Style.Size, color);
			}
		}
		
		SetText(text: string): void
		{
			this.Text = text;
			this.UpdateSize();
		}
		
		SetSize(size: number): void
		{
			this.Style.Size = size;
			this.DotSizePx = size / this.Style.Font.Char.Height;
			this.CharWidthPx = this.Style.Font.Char.Width * this.DotSizePx;
			this.UpdateSize();
		}
		
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			let scale = this.Style.Size / this.FontRenderer.Size;
			
			for(let i = 0; i < this.Text.length; ++i) {
				let letter = this.Text[i];
				
				if (letter !== ' ') {
					this.FontRenderer.DrawLetter(ctx, letter, 0, 0, scale);
				}
				
				ctx.translate(this.CharWidthPx + this.DotSizePx, 0);
			}
		}
		
		private UpdateSize(): void
		{
			this.Size.x = (this.CharWidthPx + this.DotSizePx) * this.Text.length - this.DotSizePx;
			this.Size.y = this.Style.Size; 
		}
	}
	
	/**
	 * Axis aligned text.
	 * 
	 * Text which is optimized for drawing without rotation.
	 */
	export class AAText extends Text
	{
		Draw(ctx: CanvasRenderingContext2D): void
		{
			let scale = this.Style.Size / this.FontRenderer.Size,
				{x, y} = this.Position;
		
			x -= this.Size.x * this.Anchor.x * this.Scale.x;
			y -= this.Size.y * this.Anchor.y * this.Scale.y;
			
			let alphaSave = ctx.globalAlpha;	
			ctx.globalAlpha *= this.Alpha;
			
			for(let i = 0; i < this.Text.length; ++i) {
				let letter = this.Text[i];
				
				if (letter !== ' ') {
					this.FontRenderer.DrawLetter(ctx, letter, x, y, scale * this.Scale.x, scale * this.Scale.y);
				}
				
				x += (this.CharWidthPx + this.DotSizePx) * this.Scale.x;
			}
			
			ctx.globalAlpha = alphaSave;
		}
	}
	
}