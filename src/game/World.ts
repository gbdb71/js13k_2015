/// <reference path="../core/DisplayObject" />
/// <reference path="../core/Random" />
/// <reference path="../core/Timer" />
/// <reference path="../core/Tween" />

/// <reference path="Config" />

/// <reference path="shapes/AbstractShape" />
/// <reference path="shapes/RectangleShape" />

namespace game {
	
	const vec = core.vector;
	
	export class World extends core.Layer
	{
		ShapesHead: shapes.AbstractShape;
		ShapesTail: shapes.AbstractShape;
		ShapesCount: number = 0;
		
		Timers: core.TimersManager;
		Tweens: core.TweenManager;
		
		Score: number = 0;
		MoveScore: number = 1;
		TimeLeft: number = this.Config.LevelTime;
		TimeLeftText: gfx.AAText;
		IsOver: boolean = false;
		OnTimesUpCallback: Function;
		
		constructor(
			width: number, height: number,
			
			public Config = { SpawnTime: 3, LevelTime: 15}
		) {
			super(0, 0, width, height);
			this.Tweens = new core.TweenManager();
			this.Timers = new core.TimersManager();
			
			this.Timers.Repeat(this.Config.SpawnTime, this.SpawnShape, this);
			this.Timers.Delay(this.Config.LevelTime, this.OnTimesUp, this);
			this.Timers.Repeat(1, this.WarnAboutTime, this, this.Config.LevelTime - 5.5);
			
			this.TimeLeftText = new gfx.AAText(width/2, width/3);
			this.TimeLeftText.Anchor.Set(0.5, 0.5);
			this.TimeLeftText.SetColor(core.Brightness(config.color.background, 1.4));
			this.TimeLeftText.SetSize(120);
		}
		
		Update(timeDelta: number): void
		{
			this.TimeLeft -= timeDelta;
			this.Tweens.Update(timeDelta);
			this.Timers.Update(timeDelta);
			
			if (this.TimeLeft >= 0) {
				// return;
				this.TimeLeftText.SetText(this.TimeLeft.toFixed(0));
				this.UpdateShapes(timeDelta);
				this.UpdateBonuses();
			}
		}
		
		UpdateShapes(timeDelta: number): void
		{
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (!shape.World) continue;
				
				shape.Update(timeDelta);
				
				if (shape.HasTrajectory())
				{
					for (let other = shape.Next; other; other = other.Next)
					{
						if (other.HasTrajectory() && this.IsColliding(shape, other))
						{
							this.OnShapeCollide(shape, other);
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
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.HasTrajectory()) activeShapes.push(shape);
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
			if (this.ShapesTail)
			{
				this.ShapesTail.Next = shape;
				shape.Prev = this.ShapesTail;
				this.ShapesTail = shape;
			}
			else
			{
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
			
			ctx.setLineDash([3, 9]);
			ctx.lineCap = 'butt';
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
			
			ctx.globalCompositeOperation = 'xor';
			super.DrawSelf(ctx);
			
			ctx.globalCompositeOperation = 'destination-over';
			ctx['imageSmoothingEnabled'] = false;
			ctx['webkitImageSmoothingEnabled'] = false;
			this.TimeLeftText.Draw(ctx);
		}
		
		IsColliding(a: shapes.AbstractShape, b: shapes.AbstractShape): boolean
		{
			let dist = vec.Tmp;
			vec.Subtract(a.Position, b.Position, dist);

			return vec.Length(dist) < (a.Size.x + b.Size.x) / 2;
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
			this.Timers.RemoveAll();
			
			let lastTween = this.Tweens.New(null);
			lastTween.Start();
			
			for (let shape = this.ShapesHead; shape; shape = shape.Next)
			{
				if (shape.Score > 1)
				{
					let tween = this.Tweens.New(shape.Scale)
						.To({x: 2, y: 2}, 0.3, core.easing.OutCubic)
						.Then(shape)
						.To({Score: (shape.Score/2)|0}, 0.5)
						.WhenDone((target) => {
							let bonus = Math.round(target.Score);
							this.DisplayScore(target.Position, bonus);
							this.Score += bonus;
						})
						.Then(shape.Scale)
						.To({x: 5, y: 5}, 0.35)
						.Parallel(shape, (t) => t.To({Alpha: 0}, 0.35))
						.Then(shape)
						.WhenDone((target) => {
							this.RemoveChild(target);
							this.RemoveShape(target);
						});
						
					lastTween.Then(tween).WhenDone((t) => t.Start());
					lastTween = tween;
				}
			}
			
			lastTween.Then().WhenDone(() => 
			{
				if (this.OnTimesUpCallback) this.OnTimesUpCallback();
				
				for (let shape = this.ShapesHead; shape; shape = shape.Next)
				{
					if (shape.Score <= 1 && shape.World)
					{
						let delay = core.Random(0, 0.6);
						
						this.Tweens.New(shape.Scale)
							.Delay(delay)
							.Then()
							.To({x: 5, y: 5}, 0.35)
							.Parallel(shape, (t) => t.To({Alpha: 0}, 0.25))
							.Then(shape)
							.WhenDone((target) => {
								this.RemoveChild(target);
								this.RemoveShape(target);
							})
							.Start();
					}
				}
				
				this.IsOver = true;
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
			let text = new gfx.AAText(position.x, position.y, (score > 0 ? '+' : '') + score);
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
		
		WarnAboutTime(): void
		{
			this.TimeLeftText.Scale.Set(2, 2);
			this.Tweens.New(this.TimeLeftText.Scale)
				.Delay(0.1)
				.Then()
				.To({x: 1, y: 1}, 0.4)
				.Start();
		}
		
	}
	
}