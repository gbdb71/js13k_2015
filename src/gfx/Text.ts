/// <reference path="../core/DisplayObject" />
/// <reference path="PixelFont" />

namespace gfx {
	
	export class Text extends core.DisplayObject
	{
		DotSizePx: number;
		CharWidthPx: number;
		
		constructor(
			x: number, y: number,
			
			private Text: string = "",
			private Style = {fillStyle: 'white', size: 20, font: PixelFont}
		) {
			super(x, y, 0, 0);
			
			this.SetSize(Style.size);
		}
		
		SetText(text: string): void
		{
			this.Text = text;
			this.UpdateSize();
		}
		
		SetSize(size: number): void
		{
			this.Style.size = size;
			this.DotSizePx = size / this.Style.font.Char.Height;
			this.CharWidthPx = this.Style.font.Char.Width * this.DotSizePx;
			this.UpdateSize();
		}
		
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			let scale = this.Style.size / PixelFontCache.Size;
			
			ctx.fillStyle = this.Style.fillStyle;
			for(let i = 0; i < this.Text.length; ++i) {
				let letter = this.Text[i];
				
				if (letter !== ' ') {
					PixelFontCache.DrawLetter(ctx, letter, 0, 0, scale);
				}
				
				ctx.translate(this.CharWidthPx + this.DotSizePx, 0);
			}
		}
		
		private UpdateSize(): void
		{
			this.Size.x = (this.CharWidthPx + this.DotSizePx) * this.Text.length - this.DotSizePx;
			this.Size.y = this.Style.size; 
		}
	}
	
	class FontChache {
		
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
		
		DrawLetter(ctx: CanvasRenderingContext2D, letter: string, x = 0, y = 0, scale = 1): void
		{
			ctx.drawImage(
				this.Cache, this.CacheMap[letter], 0, this.CharWidthPx, this.Size, 
				x, y, this.CharWidthPx * scale, this.Size * scale
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
	
	export var PixelFontCache = new FontChache(PixelFont, 20);
}