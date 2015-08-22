/// <reference path="IState" />

namespace core {
	
	export class Game implements IGame {
		
		States: { [name:string]: IState } = { };
		Context: CanvasRenderingContext2D;
		
		private ActiveState: IState;
		private RequestAnimationFrame: Function;
		private LastFrameTime: number;
		
		constructor(
			public Canvas: HTMLCanvasElement
		) {
			this.Context = Canvas.getContext('2d');
			
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
			
			this.ActiveState.Update(timeDelta);
			this.ActiveState.Draw(this.Context);
			
			this.LastFrameTime = now;
			this.RequestAnimationFrame();
		}
		
	}
	
}