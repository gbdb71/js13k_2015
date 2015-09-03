/// <reference path="DisplayObject" />

namespace core {
	
	export interface IInputEventReceiver
	{
		(point: core.Vector, event: Event): void;
	}
	
	export interface IInputController
	{
		OnPointerDown(point: Vector): void;
		OnPointerMove(point: Vector): void;
		OnPointerUp(point: Vector): void;
		Update(): void;
	}

	function TranslateMouseEvent(receiver: IInputEventReceiver, ctx: any, event: MouseEvent)
	{
		let x = event.pageX, y = event.pageY;
		
		let rect = (<HTMLElement>event.target).getBoundingClientRect();
		let point = new core.Vector(x - rect.left, y - rect.top);
		receiver.call(ctx, point, event);
	}
	
	function TranslateTouchEvent(receiver: IInputEventReceiver, ctx: any, event: TouchEvent)
	{
		let x = 0 , y = 0;
		
		if (event.type !== 'touchend')
		{
			x = event.targetTouches[0].pageX,
			y = event.targetTouches[0].pageY;
			
			let rect = (<HTMLElement>event.target).getBoundingClientRect();
			x -= rect.left;
			y -= rect.top;
		}
		
		receiver.call(ctx, vector.New(x, y), event);
		event.preventDefault();
	}
	
	export function MakeMouseEventTranslator(receiver: IInputEventReceiver, ctx: any): EventListener
	{
		return TranslateMouseEvent.bind(null, receiver, ctx);
	}
	
	export function MakeTouchEventTranslator(receiver: IInputEventReceiver, ctx: any): EventListener
	{
		return TranslateTouchEvent.bind(null, receiver, ctx);
	}

	export class GenericInputController implements IInputController
	{
		OnDownListeners: Array<{object: core.DisplayObject, action: Function}> = [];
		
		WhenPointerDown(object: core.DisplayObject, action: Function): GenericInputController
		{
			this.OnDownListeners.push({object, action});
			return this;
		}
		
		OnPointerDown(point: Vector): void
		{
			for (let {object, action} of this.OnDownListeners)
			{
				if (object.IsPointInside(point))
				{
					action();
				}
			}
		}
		
		OnPointerMove(point: Vector): void {}
		OnPointerUp(point: Vector): void {}
		Update(): void {}
	}
	
}