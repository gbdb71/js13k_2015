/// <reference path="../core/DisplayObject" />
/// <reference path="../core/Random" />
/// <reference path="../core/Timer" />

/// <reference path="Config" />

/// <reference path="shapes/AbstractShape" />
/// <reference path="shapes/RectangleShape" />

namespace game {
	
	const vec = core.vector;
	const collisionData = { dist: 0, collide: false };
	
	class ScoreText extends gfx.AAText
	{
		Draw(ctx: CanvasRenderingContext2D): void
		{
			let op = ctx.globalCompositeOperation;
			ctx.globalCompositeOperation = 'xor';
			super.Draw(ctx);
			ctx.globalCompositeOperation = op;
		}
	}
	
	
	class TimeLeftText extends gfx.AAText
	{
		Draw(ctx: CanvasRenderingContext2D): void
		{
			let op = ctx.globalCompositeOperation;
			ctx.globalCompositeOperation = 'destination-over';
			super.Draw(ctx);
			ctx.globalCompositeOperation = op;
		}
	}
	
	export class World extends core.Layer
	{
		ShapesHead: shapes.AbstractShape;
		ShapesTail: shapes.AbstractShape;
		ShapesCount: number = 0;
		
		Timers: core.TimersManager;
		Tweens: core.TweenManager;
		
		Config = {
			SpawnTime: 0.5,
			LevelTime: 5
		}
		
		Score: number = 0;
		MoveScore: number = 1;
		TimeLeft: number = this.Config.LevelTime;
		TimeLeftText: TimeLeftText;
		
		constructor(width: number, height: number)
		{
			super(0, 0, width, height);
			this.Tweens = new core.TweenManager();
			this.Timers = new core.TimersManager();
			
			this.Timers.Repeat(this.Config.SpawnTime, this.SpawnShape, this);
			this.Timers.Delay(this.Config.LevelTime, this.OnTimesUp, this);
			
			this.TimeLeftText = new TimeLeftText(width/2, width/3);
			this.TimeLeftText.Anchor.Set(0.5, 0.5);
			this.TimeLeftText.SetColor('#32465a');
			this.TimeLeftText.SetSize(120);
		}
		
		Update(timeDelta: number): void
		{
			this.TimeLeft -= timeDelta;
			this.Tweens.Update(timeDelta);
			
			if (this.TimeLeft < 0) {
				timeDelta /= 30;
				// return;
			}
			else {
				this.TimeLeftText.SetText(this.TimeLeft.toFixed(0));
			}
			
			this.Timers.Update(timeDelta);
			this.UpdateShapes(timeDelta);
			this.UpdateBonuses();
		}
		
		UpdateShapes(timeDelta: number): void
		{
			for (let shape = this.ShapesHead; shape && shape.World; shape = shape.Next)
			{
				shape.Update(timeDelta);
				
				if (shape.HasTrajectory())
				{
					for (let other = shape.Next; other; other = other.Next)
					{
						if (other.HasTrajectory())
						{
							this.IsColliding(shape, other, collisionData)
							if (collisionData.collide) 
							{
								this.OnShapeCollide(shape, other);
							}
							// else if (collisionData.dist < 30)
							// {
								
							// }
						}
					}
				}
				
				if (shape.Position.y < -shape.Size.y / 2) {
					this.OnShapeHitBorder(shape);
				}
				else if (shape.Position.x > this.Size.x || shape.Position.x < 0) {
					this.OnShapeHitBorder(shape);
				}
				else if (shape.Position.y > this.Size.y) {
					this.OnShapeHitBottom(shape);
				}
			}
		}
		
		UpdateBonuses(): void
		{
			let activeShapes: shapes.AbstractShape[] = [];
			for (let shape = this.ShapesHead; shape && shape.HasTrajectory(); shape = shape.Next)
			{
				activeShapes.push(shape);
			}
			
			let newMoveScore = activeShapes.length < 4 ? 1 : (activeShapes.length / 2) | 0;
			if (newMoveScore - this.MoveScore > 0)
			{
				for (let shape of activeShapes)
				{
					this.Tweens.New(shape.Scale)
						.To({x: 1.5, y: 1.5}, 0.2, core.easing.OutCubic)
						.Then()
						.To({x: 1, y: 1}, 0.2)
						.Start();
				}
			}
			this.MoveScore = newMoveScore;
		}
		
		AddShape(shape: shapes.AbstractShape): void
		{
			if (this.ShapesTail) {
				this.ShapesTail.Next = shape;
				shape.Prev = this.ShapesTail;
				this.ShapesTail = shape;
			}
			else {
				this.ShapesHead = this.ShapesTail = shape;
			}
			shape.World = this;
			this.ShapesCount += 1;
		}
		
		RemoveShape(shape: shapes.AbstractShape): void
		{
			if (shape.Next) 
			{
				if (shape.Prev) {
					shape.Prev.Next = shape.Next;
					shape.Next.Prev = shape.Prev
				}
				else {
					shape.Next.Prev = null;
					this.ShapesHead = shape.Next;	
				}
			}
			else 
			{
				if (shape.Prev) {
					shape.Prev.Next = null;
					this.ShapesTail = shape.Prev;	
				}
				else {
					this.ShapesHead = this.ShapesTail = null;
				}
			}
			shape.World = undefined;
			this.ShapesCount -= 1;
		}
		
		GetShapeUnder(point: core.IVector): shapes.AbstractShape
		{
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.IsPointInside(point)) {
					return shape;
				}
			}
			return null;
		}
		
		FinishTrajectory(shape: shapes.AbstractShape): void
		{
			if (shape.Trajectory.length < 2) return;
			
			let a = shape.Trajectory[shape.Trajectory.length - 2],
				b = shape.Trajectory[shape.Trajectory.length - 1],
				tmp = vec.Tmp;	
			
			vec.Subtract(b, a, tmp);
			vec.Scale(tmp, 20);
			vec.Add(b, tmp, tmp);
			
			shape.AddTrajectoryPoint(tmp);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.strokeStyle = game.config.color.active;
			// ctx.strokeRect(0, 0, this.Size.x-1, this.Size.y-1);
			
			ctx.setLineDash([3, 9]);
			ctx.lineWidth = 2;
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.HasTrajectory()) 
				{
					ctx.beginPath();
					ctx.moveTo(shape.Position.x, shape.Position.y);
					for (let point of shape.Trajectory) {
						ctx.lineTo(point.x, point.y)
					}
					ctx.stroke();
				}
			}
			
			super.DrawSelf(ctx);
			
			this.TimeLeftText.Draw(ctx);
		}
		
		IsColliding(a: shapes.AbstractShape, b: shapes.AbstractShape, result: {dist: number, collide: boolean}): void
		{
			let dist = vec.Tmp;
			vec.Subtract(a.Position, b.Position, dist);

			result.collide = (result.dist = vec.Length(dist)) < (a.Size.x + b.Size.x) / 2;
		}
		
		OnShapeHitBorder(shape: shapes.AbstractShape): void
		{
			let penatly = Math.min(-shape.Score, -10);
			this.Score += penatly; 
			shape.Position.y += shape.Size.y/2;
			this.DisplayScore(shape.Position, penatly);
			
			this.RemoveShape(shape);
			this.RemoveChild(shape);
			this.SpawnShape();
		}
		
		OnShapeHitBottom(shape: shapes.AbstractShape): void
		{
			this.Score += shape.Score;
			this.DisplayScore(shape.Position, shape.Score);
			
			this.RemoveShape(shape);
			this.RemoveChild(shape);
		}
		
		OnShapeCollide(...shapes: shapes.AbstractShape[]): void
		{
			shapes.forEach((shape) => {
				
				this.RemoveShape(shape);
				this.Tweens.New(shape)
					.To({Alpha: 0}, 2)
					.WhenDone(() => shape.RemoveFromParent())
					.Start();
					
			});
		}
		
		OnTimesUp(): void
		{
			let lastTween = this.Tweens.New(null);
			lastTween.Start();
			
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.HasTrajectory() && shape.Score > 1)
				{
					let tween = this.Tweens.New(shape)
						.To({Score: (shape.Score/2)|0}, 0.5)
						.WhenDone((target) => {
							let bonus = Math.round(target.Score);
							this.Tweens.New(target).To({Alpha: 0}, 0.35).Start();
							this.DisplayScore(target.Position, bonus);
							this.Score += bonus;
						})
						.Then(shape.Scale)
						.To({x: 5, y: 5}, 0.35)
						.Then(shape)
						.WhenDone((target) => {
							this.RemoveChild(target);
							this.RemoveShape(target);
						});
						
					if (lastTween)
					{
						lastTween.Then(tween).WhenDone((t) => t.Start());
						lastTween = tween;
					}
				}
			}
			
			lastTween.Then().WhenDone(() => 
			{
				for (let shape = this.ShapesHead; shape; shape = shape.Next)
				{
					if (!shape.HasTrajectory())
					{
						let delay = core.Random(0, 0.6);
						
						this.Tweens.New(shape.Scale)
							.Delay(delay)
							.Then()
							.To({x: 5, y: 5}, 0.35)
							.Start();
							
						this.Tweens.New(shape)
							.Delay(delay)
							.Then()
							.To({Alpha: 0}, 0.25)
							.Then(shape)
							.WhenDone((target) => {
								this.RemoveChild(target);
								this.RemoveShape(target);
							})
							.Start();
					}
				}
			});
		}
		
		SpawnShape(): void
		{
			let shape = new shapes.RectangleShape(core.Random(15, this.Size.x - 15), this.Size.y - 5, 30, 30);
			shape.Color = game.config.color.inactive;
			shape.Anchor.Set(0.5, 0.5);
			shape.Alpha = 0;
			shape.Scale.Set(0.1, 0.1);
			
			let tmp = vec.Tmp;
			tmp.y = 0;
			tmp.x = core.Random(15, this.Size.x - 15);
			vec.Subtract(shape.Position, tmp, tmp);
			vec.Unit(tmp);
			vec.Scale(tmp, core.Random(-80, -60));
			vec.Clone(tmp, shape.Velocity); 
			
			this.Tweens.New(shape)
				.To({Alpha: 1}, 0.2)
				.Start();
				
			this.Tweens.New(shape.Scale)
				.To({x: 1, y: 1}, 0.2)
				.Start();
				
			this.AddShape(shape);
			this.AddChild(shape);
		}
		
		DisplayScore(position: core.IVector, score: number): void
		{
			let text = new ScoreText(position.x, position.y, (score > 0 ? '+' : '') + score);
			text.Anchor.Set(0.5, 0.5);
			text.SetColor(score > 0 ? config.color.active : config.color.inactive);

			this.AddChild(text);

			let scale = score > 0 ? 2 : 1;
			
			this.Tweens.New(text.Scale)
				.To({x: scale, y: scale}, 0.5, core.easing.OutCubic)
				.Delay(0.3)
				.Then(text)
				.To({Alpha: 0}, 0.3)
				.WhenDone(() => {
					text.RemoveFromParent();
				})
				.Start();
				
			if (position.x < 0 || position.x > this.Size.x) 
			{
				let sign = position.x > 0 ? 1 : -1;
				this.Tweens.New(text.Position)
					.To({x: position.x - sign * (text.Size.x * scale)}, 0.2)
					.Start();
			}
			else
			{
				let sign = position.y > 0 ? 1 : -1;
				this.Tweens.New(text.Position)
					.To({y: position.y - sign * (text.Size.y * scale)}, 0.2)
					.Start();
			}
		}
		
	}
	
}