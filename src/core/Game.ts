/// <reference path="IState" />

namespace core {
	
	export class Game implements IGame {
		
		States: { [name:string]: IState } = { };
		Context: CanvasRenderingContext2D;
		Canvas: HTMLCanvasElement;
		/** Seconds since last frame. */
		TimeDelta: number = 0;
		
		private ActiveState: IState;
		private RequestAnimationFrame: Function;
		private LastFrameTime: number = 0;
		private OnStateEndCallbacks: Function[] = [];
		
		constructor(public canvasId: string)
		{
			this.Canvas = <HTMLCanvasElement>document.getElementById(canvasId);
			this.Context = this.Canvas.getContext('2d');
			
			this.RequestAnimationFrame = window.requestAnimationFrame.bind(
				window, this.OnUpdate.bind(this)
			);
		}
		
		AddState(name: string, state: IState): void
		{
			this.States[name] = state;
		}
		
		Play(stateName: string): void
		{
			if (this.ActiveState)
			{
				for(let callback of this.OnStateEndCallbacks) callback();
				this.OnStateEndCallbacks = [];	
			}
			
			if (this.ActiveState = this.States[stateName]) {
				this.ActiveState.Game = this;
				this.ActiveState.Start();
				this.RequestAnimationFrame();
			}
			else {
				throw new Error();
			}	
		}
		
		AddOnStateEndCallback(cb: Function, ctx?): void
		{
			this.OnStateEndCallbacks.push(cb.bind(ctx));
		}
		
		private OnUpdate(now): void
		{
			let timeDelta = now - this.LastFrameTime;
			if (timeDelta > 50) timeDelta = 50;
			this.TimeDelta = timeDelta / 1000;
			
			this.ActiveState.Update(this.TimeDelta);
			this.ActiveState.Draw(this.Context);
			
			this.LastFrameTime = now;
			this.RequestAnimationFrame();
		}
		
	}
	
}