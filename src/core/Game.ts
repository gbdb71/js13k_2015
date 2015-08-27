/// <reference path="IState" />

namespace core {
	
	export class Game implements IGame {
		
		States: { [name:string]: IState } = { };
		Context: CanvasRenderingContext2D;
		Canvas: HTMLCanvasElement;
		
		private ActiveState: IState;
		private RequestAnimationFrame: Function;
		private LastFrameTime: number = 0;
		
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
			if (this.ActiveState = this.States[stateName]) {
				this.ActiveState.Start(this);
				this.RequestAnimationFrame();
			}
			else {
				throw new Error();
			}	
		}
		
		private OnUpdate(now): void
		{
			let timeDelta = now - this.LastFrameTime;
			if (timeDelta > 50) timeDelta = 50;
			
			this.ActiveState.Update(timeDelta/1000);
			this.ActiveState.Draw(this.Context);
			
			this.LastFrameTime = now;
			this.RequestAnimationFrame();
		}
		
	}
	
}