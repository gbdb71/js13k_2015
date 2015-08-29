namespace core {
	
	export function Random(min: number, max: number): number
	{
		if (max < min) throw Error();
		return min + Math.random() * (max - min);
	}
	
}