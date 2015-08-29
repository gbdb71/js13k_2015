/// <reference path="Vector2" />

namespace core {
	
	export class DisplayObject
	{
		
		Position: Vector;
		Anchor: Vector;
		Size: Vector;
		Scale: Vector;
		Rotation: number;
		Parent: Layer;
		
		constructor(x: number, y: number, width: number, height: number)
		{
			this.Position = vector.New(x, y);
			this.Size = vector.New(width, height);
			this.Anchor = vector.New(0, 0);
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
		
		ToLocal(point: IVector): Vector;
		ToLocal(point: IVector, out: IVector): void;
		ToLocal(point: IVector, out?: IVector)
		{
			let local: IVector, tmp = vector.Tmp;
			
			if (out) {
				vector.Clone(point, out);
				local = out;
			}
			else {
				local = vector.Clone(point);
			}
			
			if (this.Parent) {
				this.Parent.ToLocal(point, local);
			}
			
			// Translation
			vector.Subtract(local, this.Position, local);
			// Scale
			vector.Clone(this.Scale, tmp);
			vector.Invert(tmp, tmp);
			vector.Multiply(local, tmp, local);
			// Rotation
			vector.Rotate(local, -this.Rotation, local);
			// Anchor Translation
			vector.Clone(this.Anchor, tmp);
			vector.Multiply(tmp, this.Size, tmp);
			vector.Add(local, tmp, local);
			
			if (!out) return <Vector>local;
		}
		
		ToGlobal(point: IVector): Vector;
		ToGlobal(point: IVector, out: IVector): void;
		ToGlobal(point: IVector, out?: IVector)
		{
			let global = out ? out : vector.New(), tmp = vector.Tmp;
			
			// Anchor
			vector.Clone(this.Anchor, tmp);
			vector.Multiply(tmp, this.Size, tmp)
			vector.Add(point, tmp, global);
			// Rotation
			vector.Rotate(global, this.Rotation);
			// Scale
			vector.Multiply(global, this.Scale, global);
			// Translate
			vector.Add(global, this.Position, global);
			
			if (this.Parent) {
				this.Parent.ToGlobal(global, global);
			}
			
			if (!out) return <Vector>global;
		}
		
		IsPointInside(point: IVector): boolean
		{
			let p = this.ToLocal(point);
			
			let xAxis = p.x > 0 && p.x < this.Size.x;
			let yAxis = p.y > 0 && p.y < this.Size.y;
			return xAxis && yAxis;
		}
		
		RemoveFromParent(): void
		{
			this.Parent.RemoveChild(this);
		}
		
	}
	
	export class Layer extends DisplayObject
	{
		Children: DisplayObject[] = [];
		
		AddChild(child: DisplayObject): void
		{
			if (child.Parent) {
				throw Error("Child has parent");
			}
			else {
				child.Parent = this;
				this.Children.push(child);
			}
		}
		
		RemoveChild(child: DisplayObject): void
		{
			let index = this.Children.indexOf(child);
			if (index >= 0) {
				this.Children.splice(index, 1);
			}
			else {
				throw Error("Child doesn't exist in this layer");
			}
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			for (let child of this.Children) {
				child.Draw(ctx);
			}
		}	
	}
	
}