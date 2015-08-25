/// <reference path="shapes/AbstractShape" />

namespace game {
	
	export class World
	{
		Shapes: shapes.AbstractShape[] = [];
		
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
		
		DrawTrajectories(ctx: CanvasRenderingContext2D): void
		{
			for(let shape of this.Shapes)
			{
				for (let point of shape.Trajectory) {
					ctx.fillRect(point.x, point.y, 10, 10);
				}
			}
		}
	}
	
}