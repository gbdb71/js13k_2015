/// <reference path="../core/DisplayObject" />
/// <reference path="PixelFont" />

namespace gfx {
	
	export class Text extends core.DisplayObject
	{
		constructor(
			x: number, y: number,
			
			public text: string = ""
		) {
			super(x, y, 0, 0);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			let font = PixelFont;
			let dotSize = 10;
			
			for(let i = 0; i < this.text.length; ++i) {
				let letter = this.text[i];
				
				for (let x = 0; x < font.Char.Width; ++x) {
					for (let y = 0; y < font.Char.Height; ++y) {
						let dot = font.Letter[letter][y * font.Char.Width + x];
						if (dot) ctx.fillRect(x * dotSize, y * dotSize, dotSize, dotSize);
					}
				}
				
				ctx.translate(dotSize * (font.Char.Width + 1), 0);
			}
		}
	}
	
}