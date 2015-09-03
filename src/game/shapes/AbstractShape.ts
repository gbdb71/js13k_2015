/// <reference path="../../core/DisplayObject"/>
/// <reference path="../Config" />

namespace game.shapes {
	
	let vec = core.vector;
	let tvec = core.vector.Tmp;
	
	const MIN_DISTANCE_BETWEEN_TRAJECTORY_POINTS = 30;
	const DEFAULT_ROTATION_SPEED = 0.2;
	
	export class AbstractShape extends core.DisplayObject
	{
		Velocity: core.Vector = vec.New(0, 0);
		Trajectory: core.Vector[] = [];
		Color: string = 'red';
		Score: number = 1;
		
		Next: AbstractShape;
		Prev: AbstractShape;
		World: World;
		
		private AngleAcc: number = 0;
		private RotationSpeed: number = DEFAULT_ROTATION_SPEED;
		
		Update(timeDelta: number): void
		{
			if (this.HasTrajectory()) {
				this.Color = this.World.MoveScore > 1 ? game.config.color.other : game.config.color.active;
				this.UpdateDirection();
			}

			vec.Clone(this.Velocity, tvec);
			vec.Scale(tvec, timeDelta);
			vec.Add(this.Position, tvec, this.Position);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			throw new Error('Unimplemented');
		}
		
		HasTrajectory(): boolean
		{
			return this.Trajectory.length > 1;
		}
		
		AddTrajectoryPoint(point: core.IVector): void
		{
			let last = this.Trajectory[this.Trajectory.length - 1];
			let min = MIN_DISTANCE_BETWEEN_TRAJECTORY_POINTS;
			
			if (last)
			{
				vec.Subtract(point, last, tvec);
				let len = vec.Length(tvec);
				if (len > min)
				{
					vec.Unit(tvec);
					vec.Scale(tvec, min);
					let minVec = vec.Clone(tvec);
					
					while (len > min)
					{
						vec.Add(last, minVec, tvec);
						this.Trajectory.push(last = vec.Clone(tvec))
						len -= min;
					}
				}
			}
			else
			{
				this.Trajectory.push(vec.Clone(point));
			}
		}
		
		private UpdateDirection(): void
		{
			let [moveTo] = this.Trajectory;
			vec.Subtract(moveTo, this.Position, tvec);
			
			if (vec.Length(tvec) < 5)
			{
				this.Trajectory.shift();
				this.AngleAcc = 0;
				this.RotationSpeed = DEFAULT_ROTATION_SPEED;
				this.Score += this.World.MoveScore;
			}

			let target = vec.Angle(tvec),
				source = vec.Angle(this.Velocity);

			let angle = Math.atan2(Math.sin(target - source), Math.cos(target - source));
			angle *= this.RotationSpeed;

			this.AngleAcc += angle;
			vec.Rotate(this.Velocity, angle);

			if (Math.abs(this.AngleAcc) > Math.PI * 2)
			{
				this.RotationSpeed *= 2;
				this.AngleAcc = 0;
			}
		}
	}
	
}