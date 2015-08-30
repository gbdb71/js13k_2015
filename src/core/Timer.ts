namespace core {
	
	export class Timer
	{
		ElapsedTime: number = 0;
		CallCount: number = 0;
		
		constructor(
			public Callback: (timeDelta: number) => void,
			public Ctx: any,
			public Delay: number,
			public Interval: number = NaN
		) { }
		
		Update(timeDelta): void
		{
			this.ElapsedTime += timeDelta;
			
			if (this.ElapsedTime > this.Delay)
			{
				if (this.CallCount === 0) 
				{
					this.Callback.call(this.Ctx, timeDelta);
					this.CallCount += 1;
				}
				
				if (this.ElapsedTime - this.Delay > this.Interval * this.CallCount)
				{
					this.Callback.call(this.Ctx, timeDelta)
					this.CallCount += 1;
				}
			}
		}
		
	}
}