/// <reference path="../../core/DisplayObject"/>

namespace game.shapes {
	
	let vec = core.vector;
	let tvec = vec.New();
	
	const MIN_DISTANCE_BETWEEN_TRAJECTORY_POINTS = 40;
	
	export class AbstractShape extends core.DisplayObject
	{
		Velocity: core.Vector = vec.New(0, 0);
		Trajectory: core.Vector[] = [];
		
		Update(timeDelta: number): void
		{
			if (this.Trajectory.length > 0) {
				let [moveTo] = this.Trajectory;
				vec.Subtract(moveTo, this.Position, tvec);

				if (vec.Length(tvec) < 5) {
					this.Trajectory.shift();
				}

				let target = vec.Angle(tvec),
					source = vec.Angle(this.Velocity);

				let angle = Math.atan2(Math.sin(target - source), Math.cos(target - source));
				vec.Rotate(this.Velocity, angle / 10);
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
				if (vec.Length(tvec) < MIN_DISTANCE_BETWEEN_TRAJECTORY_POINTS) return;
			}
			
			this.Trajectory.push(vec.Clone(point));	
			
		}
	}
	
}