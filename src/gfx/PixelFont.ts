namespace gfx {
	
	export interface IFont {
		Char: { Width: number, Height: number };
		Letter: { [letter:string]: number[] };
	}
	
	export var PixelFont: IFont = {
		
		Char: {
			Width: 3,
			Height: 5
		},
	
		Letter: {
			
			'+': [
				0, 0, 0,
				0, 1, 0,
				1, 1, 1,
				0, 1, 0,
				0, 0, 0
			],
			
			'-': [
				0, 0, 0,
				0, 0, 0,
				1, 1, 1,
				0, 0, 0,
				0, 0, 0
			],
			
			'.': [
				0, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0, 1, 0
			],
			
			':': [
				0, 0, 0,
				0, 1, 0,
				0, 0, 0,
				0, 1, 0,
				0, 0, 0
			],
			
			'0': [
				1, 1, 1,
				1, 0, 1,
				1, 0, 1,
				1, 0, 1,
				1, 1, 1
			],
			
			'1': [
				0, 1, 0,
				1, 1, 0,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0
			],
			
			'2': [
				1, 1, 1,
				0, 0, 1,
				1, 1, 1,
				1, 0, 0,
				1, 1, 1
			],
			
			'3': [
				1, 1, 1,
				0, 0, 1,
				0, 1, 1,
				0, 0, 1,
				1, 1, 1
			],
			
			'4': [
				1, 0, 1,
				1, 0, 1,
				1, 1, 1,
				0, 0, 1,
				0, 0, 1
			],
			
			'5': [
				1, 1, 1,
				1, 0, 0,
				1, 1, 1,
				0, 0, 1,
				1, 1, 0
			],
			
			'6': [
				0, 1, 1,
				1, 0, 0,
				1, 1, 1,
				1, 0, 1,
				1, 1, 1
			],
			
			'7': [
				1, 1, 1,
				0, 0, 1,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0
			],
			
			'8': [
				1, 1, 1,
				1, 0, 1,
				1, 1, 1,
				1, 0, 1,
				1, 1, 1
			],
			
			'9': [
				1, 1, 1,
				1, 0, 1,
				1, 1, 1,
				0, 0, 1,
				1, 1, 0
			],
			
			'A': [
				0, 1, 0,
				1, 0, 1,
				1, 1, 1,
				1, 0, 1,
				1, 0, 1
			],
			
			'C': [
				1, 1, 1,
				1, 0, 0,
				1, 0, 0,
				1, 0, 0,
				1, 1, 1
			],
			
			'E': [
				1, 1, 1,
				1, 0, 0,
				1, 1, 0,
				1, 0, 0,
				1, 1, 1
			],
			
			'F': [
				1, 1, 1,
				1, 0, 0,
				1, 1, 0,
				1, 0, 0,
				1, 0, 0
			],
			
			'O': [
				1, 1, 1,
				1, 0, 1,
				1, 0, 1,
				1, 0, 1,
				1, 1, 1
			],
			
			'P': [
				1, 1, 1,
				1, 0, 1,
				1, 1, 1,
				1, 0, 0,
				1, 0, 0
			],
			
			'R': [
				1, 1, 0,
				1, 0, 1,
				1, 1, 0,
				1, 0, 1,
				1, 0, 1
			],
			
			'S': [
				1, 1, 1,
				1, 0, 0,
				1, 1, 0,
				0, 0, 1,
				1, 1, 1
			]
		}
	};
	
}