/// <reference path="../core/DisplayObject" />

namespace gfx {
	
	interface IStyle {
		fillStyle?: string;
		strokeStyle?: string;	
	}
	
	export class Rectangle extends core.DisplayObject
	{
	
		constructor(
			x: number, y: number, width: number, height: number,
			
			public Style: IStyle = {fillStyle: 'red'}
		) {
			super(x, y, width, height);
		}
		
		protected DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.fillStyle = this.Style.fillStyle;
			ctx.fillRect(
				0, 0, this.Size.x, this.Size.y
			);
		}
		
	}
	
}