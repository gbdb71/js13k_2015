/// <reference path="Utils" />

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
		end: number;
	}
	
	export class Tween
	{
		ElapsedTime: number = 0;
		
		/** Next tween in this chain */
		Next: Tween;
		/** Previous tween in this chain */
		Prev: Tween;
		
		TweenedProperties: IPropertyTween[] = []; 
		Duration: number = 0;
		Easeing: IEasingFunction;
		
		OnDoneCallback: (target: any) => void;
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
					end: properites[key]
				});
			}
			this.Duration = duration;
			this.Easeing = ease;
			
			return this;
		}
		
		WhenDone(callback: (target) => void): Tween
		{
			this.OnDoneCallback = callback;
			return this;
		}
		
		/**
		 * Returned tween will be executed in sequnce
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
				
				if (self.ElapsedTime <= self.Duration)
				{
					self.UpdateProperties(self.ElapsedTime)
					return;
				}
				else 
				{
					if (!self.IsDone)
					{
						self.UpdateProperties(self.Duration);
						
						if (self.OnDoneCallback) self.OnDoneCallback(self.Target);
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
		
		private UpdateProperties(elapsedTime: number): void
		{
			for (let property of this.TweenedProperties) {
				this.Target[property.key] = this.Easeing(this.ElapsedTime, property.start, property.change, this.Duration);
			}
		}
		
		private InitProperties(): void
		{
			for (let property of this.TweenedProperties)
			{
				property.start = this.Target[property.key];
				property.change = property.end - property.start;
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
			RemoveElement(this.Tweens, tween);
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