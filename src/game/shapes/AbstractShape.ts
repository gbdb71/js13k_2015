/// <reference path="../../core/DisplayObject"/>

namespace game.shapes {
	
	let vec = core.vector;
	let tvec = vec.New();
	
	const MIN_DISTANCE = 40;
	
	export class AbstractShape extends core.DisplayObject
	{
		Velocity: core.Vector = vec.New(0, 0);
		Trajectory: core.Vector[] = [];
		Progress: number = 0;
		
		Update(timeDelta: number): void
		{
			if (this.Trajectory.length > 1) {
				let [a, b] = this.Trajectory;
				vec.Subtract(b, a, tvec);
				vec.Scale(tvec, this.Progress);
				vec.Add(a, tvec, tvec);
				
				vec.Subtract(tvec, this.Position, tvec);
				vec.Clone(tvec, this.Velocity);
				
				this.Progress += timeDelta  * 2;
				if (this.Progress > 1) {
					this.Trajectory.shift();
					this.Progress = 0;	
				}	
			}
			
			vec.Clone(this.Velocity, tvec);
			vec.Scale(tvec, timeDelta);
			vec.Add(this.Position, tvec, this.Position);	
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			throw new Error('Unimplemented');
		}
		
		AddTrajectoryPoint(point: core.IVector): void
		{
			let last = this.Trajectory[this.Trajectory.length - 1];
			
			if (last) {
				vec.Subtract(point, last, tvec);
				if (vec.Length(tvec) < MIN_DISTANCE) return;
			}
			
			this.Trajectory.push(vec.Clone(point));	
			
		}
	}
	
}