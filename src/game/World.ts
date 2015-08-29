/// <reference path="shapes/AbstractShape" />
/// <reference path="../core/DisplayObject" />
/// <reference path="shapes/RectangleShape" />
/// <reference path="../core/Random" />

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
			for (let i = this.Shapes.length - 1; i >= 0; --i) {
				let shape = this.Shapes[i];
				
				shape.Update(timeDelta);
				
				if (shape.Position.y < 0) {
					this.Shapes.splice(i, 1);
					shape.RemoveFromParent();
					this.SpawnShape();
				}
				else if (shape.Position.y > this.Size.y) {
					this.Shapes.splice(i, 1);
					shape.RemoveFromParent();
				}
			}
		}
		
		AddShape(shape: shapes.AbstractShape): void
		{
			this.Shapes.push(shape);
		}
		
		RemoveShape(shape: shapes.AbstractShape): void
		{
			let index = this.Shapes.indexOf(shape);
			if (index >= 0) {
				this.Shapes.splice(index, 1);
			}
			else {
				throw Error();
			}
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
			
			ctx.fillStyle = 'white';
			for(let shape of this.Shapes)
			{
				for (let point of shape.Trajectory) {
					ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
				}
			}
		}
		
		SpawnShape(): void
		{
			let shape = new shapes.RectangleShape(Math.random() * this.Size.x, this.Size.y - 10, 40, 40);
			shape.Anchor.Set(0.5, 0.5);
			shape.Velocity.Set(core.Random(-10, 10), core.Random(-120, -60));
			
			this.Parent.AddChild(shape);
			this.AddShape(shape);
		}
		
	}
	
}