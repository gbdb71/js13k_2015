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
		
		OnDoneCallback: Function;
		IsDone: boolean = false;
		
		constructor(
			public Target: any,
			private Manager?: TweenManager
		) { }
		
		/**
		 * Starts tween. Remeber that this will reset whole tween chain, and
		 * start playing from beggining of this chain.
		 */
		Start(): void
		{
			let root = this.GetRoot();
			
			if (root.Manager)
			{
				root.Manager.StartTween(root);
			}
			
			if (root.IsDone)
			{
				while(root)
				{
					root.IsDone = false;
					root.ElapsedTime = 0;
					root = root.Next;
				}
			}
		}
		
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
		
		WhenDone(callback: Function): Tween
		{
			this.OnDoneCallback = callback;
			return this;
		}
		
		/**
		 * @return new tween
		 */
		Then(target = this.Target): Tween
		{
			let tween = new Tween(target, this.Manager);
			
			this.Next = tween;
			tween.Prev = this;
			
			return tween;
		}
		
		/**
		 * @return new tween
		 */
		Delay(duration: number): Tween
		{
			return this.Then().To({}, duration);
		}
		
		Update(timeDelta: number): void
		{
			let self = this;
			
			while (self)
			{
				if (self.ElapsedTime === 0) self.InitProperties();
				
				self.ElapsedTime += timeDelta;
				
				if (self.ElapsedTime < self.Duration)
				{
					for (let property of self.TweenedProperties)
					{
						self.Target[property.key] = self.Easeing(self.ElapsedTime, property.start, property.change, self.Duration);
					}
					return;
				}
				else 
				{
					if (!self.IsDone)
					{
						if (self.OnDoneCallback) self.OnDoneCallback();
						if (self.Manager && !self.Next) self.Manager.StopTween(self.GetRoot());
						self.IsDone = true;
					}
					
					self = self.Next;
				}
			}
		}
		
		GetRoot(): Tween
		{
			let root = this;
			while(root.Prev) { root = root.Prev; }
			return root;
		}
		
		private InitProperties(): void
		{
			for (let property of this.TweenedProperties)
			{
				property.start = this.Target[property.key];
				property.change = property.final - property.start;
			}
		}
	}
	
	export namespace easing {

		export function Linear(t, b, c, d): number
		{
			return c * t / d + b;
		}
		
		export function OutCubic(t, b, c, d)
		{
			t /= d;
			t--;
			return c * (t * t * t + 1) + b;
		}
		
	}
	
	export class TweenManager
	{
		Tweens: Tween[] = [];
		
		New(target: any): Tween
		{
			let tween = new core.Tween(target, this);
			return tween;
		}
		
		StartTween(tween: Tween): void
		{
			this.Tweens.push(tween);
		}
		
		StopTween(tween: Tween): void
		{
			let i = this.Tweens.indexOf(tween);
			if (i >= 0) {
				this.Tweens.splice(i, 1);
			} else {
				throw Error();
			}
		}
		
		Update(timeDelta: number): void
		{
			for(let tween of this.Tweens)
			{
				tween.Update(timeDelta);
			}
		}
	}
	
	
}