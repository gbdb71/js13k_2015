namespace core {
	
	export interface IVector { x: number, y: number };
	
	export class Vector {
		
		constructor(
			public x: number = 0,
			public y: number = 0
		) { }
		
		Set(x: number, y: number): void
		{
			this.x = x;
			this.y = y;
		}
		
		Clone(): Vector
		{
			return new Vector(this.x, this.y);
		}
	}
	
}
	
namespace core.vector {
	
	export var Zero = {x: 0, y: 0};
	
	export function New(x: number = 0, y: number = 0): Vector
	{
		return new Vector(x, y);	
	}
	
	export function Clone(a: IVector): Vector
	export function Clone(a: IVector, b: IVector): void
	export function Clone(a, b?)
	{
		if (b) {
			b.x = a.x;
			b.y = a.y;
		}
		else {
			return New(a.x, a.y);
		}
	}
	
	export function IsZero(a: IVector): boolean
	{
		return a.x === 0 && a.y === 0;
	}
	
	export function Add(a: IVector, b: IVector, o: IVector): void
	{
		o.x = a.x + b.x;
		o.y = a.y + b.y;
	}
	
	export function Subtract(a: IVector, b: IVector, o: IVector): void
	{
		o.x = a.x - b.x;
		o.y = a.y - b.y;
	}
	
	export function Multiply(a: IVector, b: IVector, o: IVector): void
	{
		o.x = a.x * b.x;
		o.y = a.y * b.y;
	}
	
	export function Scale(a: IVector, s: number, o: IVector = a): void
	{
		o.x = a.x * s;
		o.y = a.y * s;
	}
	
	export function Length(a: IVector): number
	{
		return Math.sqrt(a.x*a.x + a.y*a.y);
	}
	
	export function Rotate(a: IVector, angle: number, o: IVector): void
	{
		let sin = Math.sin(angle), cos = Math.cos(angle);
		if (a === o) a = Clone(a);
		
		o.x = a.x * cos - a.y * sin;
		o.y = a.x * sin + a.y * cos;
	}
	
	export function Invert(a: IVector, o: IVector): void
	{
		o.x = a.x > 0 ? 1/a.x : 0;
		o.y = a.y > 0 ? 1/a.y : 0;
	}
	
}