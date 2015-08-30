/// <reference path="IFont" />

namespace gfx
{
	export class FontChache {
		
		Cache: HTMLCanvasElement;
		CacheMap: { [letter: string]: number } = { };
		
		DotSizePx: number;
		CharWidthPx: number;
		
		constructor(
			public Font: IFont,
			public Size: number,
			public Color = 'white'
		) {
			this.DotSizePx = Size / Font.Char.Height;
			this.CharWidthPx = Font.Char.Width * this.DotSizePx;
			
			this.Cache = document.createElement('canvas');
			this.Cache.width = Object.keys(Font.Letter).length * Math.ceil(this.CharWidthPx + this.DotSizePx);
			this.Cache.height = Size;
			
			console.log('FontCache Size', this.Size, 'DotPx', this.DotSizePx, 'Color', this.Color);
			this.Render();
		}
		
		DrawLetter(ctx: CanvasRenderingContext2D, letter: string, x = 0, y = 0, scaleX = 1, scaleY = scaleX): void
		{
			ctx.drawImage(
				this.Cache, this.CacheMap[letter], 0, this.CharWidthPx, this.Size, 
				x, y, this.CharWidthPx * scaleX, this.Size * scaleY
			);	
		}
		
		private Render(): void
		{
			let ctx = this.Cache.getContext('2d');
			let offsetX = 0;
			
			ctx.fillStyle = this.Color;
			for(let letter in this.Font.Letter)
			{
				this.RenderLetter(ctx, letter);
				this.CacheMap[letter] = offsetX;
				
				let dx = Math.ceil(this.CharWidthPx + this.DotSizePx);
				// let dx = this.CharWidthPx;
				offsetX += dx;
				ctx.translate(dx, 0);
			}
		}
		
		private RenderLetter(ctx: CanvasRenderingContext2D, letter: string): void
		{
			let font = this.Font, dpx = this.DotSizePx;
			
			for (let x = 0; x < font.Char.Width; ++x) {
				for (let y = 0; y < font.Char.Height; ++y) {
					let dot = font.Letter[letter][y * font.Char.Width + x];
					if (dot) ctx.fillRect(x * dpx, y * dpx, dpx, dpx);
				}
			}
		}
	}
}