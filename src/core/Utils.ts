namespace core {
	
	export function RemoveElement<T>(array: Array<T>, element: T): T[]
	{
		let i = array.indexOf(element);
		if (i >= 0)
		{
			return array.splice(i, 1);
		}
		else throw new Error();
	}
	
	export class CallbackSet
	{
		Callbacks: Array<[Function, any]> = [];
		
		Add(callback: Function, ctx?): CallbackSet
		{
			this.Callbacks.push([callback, ctx]);
			return this;
		}
		
		CallAll(): void
		{
			for(let [callback, ctx] of this.Callbacks)
			{
				callback.call(ctx);
			}
		}
		
	}
	
}