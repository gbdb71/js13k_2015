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
	
	/**
	 * If element doesn't exist in collection, nothing happens.
	 */
	export function TryRemoveElement<T>(array: Array<T>, element: T): T[]
	{
		let i = array.indexOf(element);
		if (i >= 0)
		{
			return array.splice(i, 1);
		}
	}
	
	export function Last<T>(array: Array<T>): T
	{
		return array[array.length - 1];
	}
	
	export function Brightness(base: string, brightess: number): string
	{
		let rgb = base.substr(1).match(/.{2}/g).map((v) => parseInt(v, 16));
		rgb = rgb.map((v) => Math.min(v * brightess, 255)|0);
		let hex = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
		return '#' + (hex + 0x1000000).toString(16).substr(1);
	}
	
	export class FPSMeter
	{
		Probes: number[];
		ProbeIdx: number = 0;
		
		constructor(public ProbeNum: number = 60)
		{
			this.Probes = new Array(ProbeNum);
			for (let i = 0; i < ProbeNum; ++i) this.Probes[i] = 0;	
		}
		
		Update(timeDelta: number): void
		{
			this.Probes[(this.ProbeIdx++)%this.Probes.length] = timeDelta;
		}
		
		GetFPS(): number
		{
			return 1 / this.GetAvgFrameTime();
		}
		
		GetAvgFrameTime(): number
		{
			let avg = 0;
			for (let i = 0; i < this.ProbeNum; ++i) avg += this.Probes[i];
			return avg / this.ProbeNum;
		}
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