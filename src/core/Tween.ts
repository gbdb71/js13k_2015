namespace core {
	
	interface IEasingFunction 
	{
		/**
		 * @param t current time
		 * @param b start value
		 * @param c change in value
		 * @param d duration
		 */
		(t: number, b: number, c: number, d: number): number;
	}
	
	interface IPropertyTween 
	{
		key: string;
		start: number;
		change: number;
		final: number;
	}
	
	export class Tween
	{
		ElapsedTime: number = 0;
		
		Next: Tween;
		Prev: Tween;
		
		TweenedProperties: IPropertyTween[]; 
		Duration: number;
		Easeing: IEasingFunction;
		
		constructor(
			public Target: any
		) { }
		
		To(properites: {[name:string]: number}, duration: number = 1, ease: IEasingFunction = easing.Linear): Tween
		{
			this.TweenedProperties = [];
			
			for (let key in properites) {
				this.TweenedProperties.push({
					key: key,
					start: 0,
					change: 0,
					final: properites[key]
				});
			}
			this.Duration = duration;
			this.Easeing = ease;
			
			return this;
		}
		
		Then(target = this.Target): Tween
		{
			let tween = new Tween(target);
			
			this.Next = tween;
			tween.Prev = this;
			
			return tween;
		}
		
		Update(timeDelta: number): void
		{
			let self = this;
			
			while (self)
			{
				if (self.ElapsedTime === 0)
				{
					self.InitProperties();
				}
				self.ElapsedTime += timeDelta;
				
				if (self.ElapsedTime < self.Duration) {
					for (let property of self.TweenedProperties)
					{
						self.Target[property.key] = self.Easeing(self.ElapsedTime, property.start, property.change, self.Duration);
					}
					return;
				}
				else {
					self = self.Next;
				}
			}
		}
		
		private InitProperties(): void
		{
			for (let property of this.TweenedProperties)
			{
				property.start = this.Target[property.key];
				property.change = property.final - property.start;
			}
			console.log('Starting tween ', this.TweenedProperties);
		}
	}
	
	export namespace easing {

		export function Linear(t, b, c, d): number
		{
			return c * t / d + b;
		}
		
	}
	
	
}