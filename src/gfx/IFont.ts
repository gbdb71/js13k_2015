namespace gfx {
		
	export interface IFont
	{
		Char: { Width: number, Height: number };
		Letter: { [letter:string]: number[] };
		Cache: { [color:string]: FontChache };
	}
	
}