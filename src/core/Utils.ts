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
	
}