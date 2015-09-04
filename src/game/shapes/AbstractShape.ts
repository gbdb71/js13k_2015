/// <reference path="../../core/DisplayObject"/>
/// <reference path="../Config" />

namespace game.shapes {
	
	let vec = core.vector;
	let tvec = core.vector.Tmp;
	
	const MIN_DISTANCE_BETWEEN_TRAJECTORY_POINTS = 20;
	
	export class AbstractShape extends core.DisplayObject
	{
		Velocity: core.Vector = vec.New(0, 0);
		Trajectory: core.Vector[] = [];
		Color: string = 'red';
		Score: number = 1;
		
		Next: AbstractShape;
		Prev: AbstractShape;
		World: World;
		
		Update(timeDelta: number): void
		{
			if (this.HasTrajectory()) 
			{
				this.Color = this.World.MoveScore > 1 ? game.config.color.other : game.config.color.active;
				this.UpdateDirection(timeDelta);
			}
			else
			{
				vec.Clone(this.Velocity, tvec);
				vec.Scale(tvec, timeDelta);
				vec.Add(this.Position, tvec, this.Position);
			}
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
			let last = core.Last(this.Trajectory);
			let min = MIN_DISTANCE_BETWEEN_TRAJECTORY_POINTS;
			let doCorrection = this.Trajectory.length < 2;
			
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
					
					if (!doCorrection) return;
					
					let [first, second] = this.Trajectory;
					vec.Subtract(second, first, tvec);
					if (!IsParallel(this.Velocity, tvec))
					{
						let velocity = vec.Length(this.Velocity);
						vec.Subtract(second, this.Position, this.Velocity);
						vec.Unit(this.Velocity)
						
						vec.Clone(this.Velocity, first);
						vec.Scale(first, min/2);
						vec.Add(this.Position, first, first);
						
						vec.Scale(this.Velocity, velocity);
					}	
				}
			}
			else
			{
				this.Trajectory.push(vec.Clone(point));
			}
		}
		
		private UpdateDirection(timeDelta: number): void
		{
			let velocity = vec.Length(this.Velocity),
				step = velocity * timeDelta,
				dist = 0;
			
			while (step > 0)
			{
				let [moveTo] = this.Trajectory;
				vec.Subtract(moveTo, this.Position, tvec);
				
				if ((dist = vec.Length(tvec)) - step > 0)
				{
					vec.Unit(tvec);
					vec.Clone(tvec, this.Velocity);
					
					vec.Scale(tvec, step);
					vec.Add(this.Position, tvec, this.Position);
					
					vec.Scale(this.Velocity, velocity);
					break;
				}
				else
				{
					step = step - dist;
					vec.Add(this.Position, tvec, this.Position);
					this.Trajectory.shift();
					this.Score += this.World.MoveScore;
					
					if (this.Trajectory.length < 1) return;
				}
			}
		}
	}
	
	function IsParallel(a: core.IVector, b: core.IVector, epsilon: number = 0.01): boolean
	{
		if (a.y === 0 || b.y === 0) return a.y === b.y;
		return Math.abs(Math.abs(a.x / a.y) - Math.abs(b.x / b.y)) < epsilon;
	}
	
}