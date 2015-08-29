/// <reference path="shapes/AbstractShape" />
/// <reference path="../core/DisplayObject" />
/// <reference path="shapes/RectangleShape" />
/// <reference path="../core/Random" />

namespace game {
	
	const vec = core.vector;
	
	export class World extends core.DisplayObject
	{
		ShapesHead: shapes.AbstractShape;
		ShapesTail: shapes.AbstractShape;
		
		constructor(width: number, height: number)
		{
			super(0, 0, width, height);
		}
		
		Update(timeDelta: number): void
		{
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				shape.Update(timeDelta);
				
				if (shape.HasTrajectory())
				{
					for (let other = shape.Next; other; other = other.Next)
					{
						if (other.HasTrajectory() && this.IsColliding(shape, other)) {
							this.RemoveShape(shape);
							this.RemoveShape(other);
						}
					}
				}
				
				if (shape.Position.y < -shape.Size.y / 2) {
					this.RemoveShape(shape);
					this.SpawnShape();
				}
				else if (shape.Position.y > this.Size.y) {
					this.RemoveShape(shape);
				}
			}
		}
		
		AddShape(shape: shapes.AbstractShape): void
		{
			if (this.ShapesTail) {
				this.ShapesTail.Next = shape;
				shape.Prev = this.ShapesTail;
				this.ShapesTail = shape;
			}
			else {
				this.ShapesHead = this.ShapesTail = shape;
			}
		}
		
		RemoveShape(shape: shapes.AbstractShape): void
		{
			if (shape.Next) {
				
				if (shape.Prev) {
					shape.Prev.Next = shape.Next;
					shape.Next.Prev = shape.Prev
				}
				else {
					shape.Next.Prev = null;
					this.ShapesHead = shape.Next;	
				}
				
			}
			else {
				
				if (shape.Prev) {
					shape.Prev.Next = null;
					this.ShapesTail = shape.Prev;	
				}
				else {
					this.ShapesHead = this.ShapesTail = null;
				}
				
			}
			shape.RemoveFromParent();
		}

		
		GetShapeUnder(point: core.IVector): shapes.AbstractShape
		{
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.IsPointInside(point)) {
					return shape;
				}
			}
			return null;
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.strokeStyle = 'white';
			ctx.strokeRect(0, 0, this.Size.x, this.Size.y);
			
			ctx.fillStyle = 'white';
			ctx.setLineDash([3, 5]);
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.HasTrajectory()) {
					ctx.beginPath();
					
					ctx.moveTo(shape.Position.x, shape.Position.y);
					for (let point of shape.Trajectory) {
						ctx.lineTo(point.x, point.y)
					}
					
					// let a: core.IVector, b: core.IVector, tmp = vec.Tmp;

					// if (shape.Trajectory.length > 1) {
					// 	a = shape.Trajectory[shape.Trajectory.length - 2];
					// 	b = shape.Trajectory[shape.Trajectory.length - 1];
					// }
					// else {
					// 	a = shape.Position;
					// 	b = shape.Trajectory[0];
					// }
					
					// vec.Subtract(b, a, tmp);
					// if (tmp.y >= 0) {
					// 	vec.Scale(tmp, 10);
					// 	vec.Add(tmp, a, tmp);
					// 	ctx.lineTo(tmp.x, tmp.y);
					// }
					
					ctx.stroke();
				}
				
			}
		}
		
		IsColliding(a: shapes.AbstractShape, b: shapes.AbstractShape): boolean
		{
			let dist = vec.Tmp;
			vec.Subtract(a.Position, b.Position, dist);

			return vec.Length(dist) < (a.Size.x + b.Size.x) / 2;
		}
		
		SpawnShape(): void
		{
			let shape = new shapes.RectangleShape(Math.random() * this.Size.x, this.Size.y - 10, 30, 30);
			shape.Anchor.Set(0.5, 0.5);
			shape.Velocity.Set(core.Random(-10, 10), -60);
			
			this.Parent.AddChild(shape);
			this.AddShape(shape);
		}
		
	}
	
}