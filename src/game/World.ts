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
		
		Score: number = 0;
		TimeElapsed: number = 0;
		
		Overlay: core.Layer;
		Tweens: core.TweenManager;
		
		constructor(width: number, height: number)
		{
			super(0, 0, width, height);
			this.Overlay = new core.Layer(0, 0, width, height);
			this.Tweens = new core.TweenManager();
		}
		
		Update(timeDelta: number): void
		{
			this.TimeElapsed += timeDelta;
			
			if (this.TimeElapsed > 3) {
				this.SpawnShape(); this.TimeElapsed = 0;
			}
			
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
					this.Score -= shape.Score * 10;
					this.RemoveShape(shape);
					shape.Position.y += shape.Size.y/2;
					this.DisplayScore(shape.Position, -shape.Score * 10);
					this.SpawnShape();
				}
				else if (shape.Position.y > this.Size.y) {
					this.RemoveShape(shape);
					this.Score += shape.Score;
					this.DisplayScore(shape.Position, shape.Score);
				}
			}
			
			this.Tweens.Update(timeDelta);
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
			ctx.setLineDash([3, 6]);
			ctx.lineWidth = 2;
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.HasTrajectory()) {
					ctx.beginPath();
					
					ctx.moveTo(shape.Position.x, shape.Position.y);
					for (let point of shape.Trajectory) {
						ctx.lineTo(point.x, point.y)
					}
					ctx.stroke();
					// for (let point of shape.Trajectory) {
					// 	ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
					// }
					
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
					
					// ctx.stroke();
				}
				
			}
			
			this.Overlay.Draw(ctx);
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
		
		DisplayScore(position: core.IVector, score: number): void
		{
			let text = new gfx.AAText(position.x, position.y, (score > 0 ? '+' : '') + score);
			text.Anchor.Set(0.5, 0.5);
			text.SetColor(score > 0 ? 'white' : 'red');

			this.Overlay.AddChild(text);

			let scale = score > 0 ? 2 : 1;
			
			this.Tweens.New(text.Scale)
				.To({x: scale, y: scale}, 0.5, core.easing.OutCubic)
				.Delay(0.3)
				.Then(text)
				.To({Alpha: 0}, 0.3)
				.WhenDone(() => {
					text.RemoveFromParent();
				})
				.Start();
				
			let sign = score > 0 ? 1 : -1;
			this.Tweens.New(text.Position)
				.To({y: position.y - sign * (text.Size.y * scale)}, 0.2)
				.Start();
		}
		
	}
	
}