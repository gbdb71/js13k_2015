namespace gfx {
	
	interface IFont {
		Char: { Width: number, Height: number };
		Letter: { [letter:string]: number[] };
	}
	
	export var PixelFont: IFont = {
		
		Char: {
			Width: 3,
			Height: 5
		},
	
		Letter: {
			'0': [
				0, 1, 0,
				1, 0, 1,
				1, 0, 1,
				1, 0, 1,
				0, 1, 0
			],
			
			'1': [
				0, 1, 0,
				1, 1, 0,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0
			],
			
			'2': [
				0, 1, 1,
				1, 0, 1,
				0, 1, 1,
				1, 0, 1,
				1, 1, 1
			],
			
			'A': [
				0, 1, 0,
				1, 0, 1,
				1, 1, 1,
				1, 0, 1,
				1, 0, 1
			]
		}
	};
	
}