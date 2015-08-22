/// <reference path="Vector2" />

namespace core {
	
	export class DisplayObject {
		
		Position: Vector;
		Anchor: Vector;
		Size: Vector;
		Scale: Vector;
		Rotation: number;
		
		constructor(x: number, y: number, width: number, height: number)
		{
			this.Position = vector.New(x, y);
			this.Size = vector.New(width, height);
			this.Anchor = vector.New();
			this.Scale = vector.New(1, 1);
			this.Rotation = 0;
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			ctx.save();
			ctx.translate(this.Position.x, this.Position.y);
			ctx.scale(this.Scale.x, this.Scale.y);
			ctx.rotate(this.Rotation);
			if (!vector.IsZero(this.Anchor)) {
				ctx.translate(-this.Anchor.x * this.Size.x, - this.Anchor.y * this.Size.y);
			}
			this.DrawSelf(ctx);
			ctx.restore();
		}
		
		protected DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			throw new Error('Unimplemented');
		}
		
		IsPointInside(point: IVector): boolean
		{
			// let p = vector.Clone(point);
			let p = point;
			let t = vector.New();
			
			// Translation
			vector.Subtract(p, this.Position, p);
			// Scale
			vector.Clone(this.Scale, t);
			vector.Invert(t, t);
			vector.Multiply(p, t, p);
			// Rotation
			vector.Rotate(p, this.Rotation, p);
			// Anchor Translation
			vector.Clone(this.Anchor, t);
			vector.Multiply(t, this.Size, t);
			vector.Add(p, t, p);
			
			let xAxis = p.x > 0 && p.x < this.Size.x;
			let yAxis = p.y > 0 && p.y < this.Size.y;
			return xAxis && yAxis;
		}
		
	}
	
}