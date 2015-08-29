/// <reference path="shapes/AbstractShape" />
/// <reference path="../core/DisplayObject" />

namespace game {
	
	export class World extends core.DisplayObject
	{
		Shapes: shapes.AbstractShape[] = [];
		
		constructor(width: number, height: number)
		{
			super(0, 0, width, height);
		}
		
		Update(timeDelta: number): void
		{
			for (let shape of this.Shapes) {
				shape.Update(timeDelta);
			}
		}
		
		AddShape(shape: shapes.AbstractShape): void
		{
			this.Shapes.push(shape);
		}
		
		GetShapeUnder(point: core.IVector): shapes.AbstractShape
		{
			for(let shape of this.Shapes)
			{
				if (shape.IsPointInside(point)) {
					return shape;
				}
			}
			return null;
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.strokeStyle = 'green';
			ctx.strokeRect(0, 0, this.Size.x, this.Size.y);
			
				
			for(let shape of this.Shapes)
			{
				for (let point of shape.Trajectory) {
					ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
				}
			}
		}
		
		// DrawTrajectories(ctx: CanvasRenderingContext2D): void
		// {
		// 	let tmp = core.vector.Tmp;
			
		// 	for(let shape of this.Shapes)
		// 	{
		// 		for (let point of shape.Trajectory) {
		// 			shape.Parent.ToGlobal(point, tmp)
		// 			ctx.fillRect(tmp.x - 2, tmp.y - 2, 4, 4);
		// 		}
		// 	}
		// }
	}
	
}