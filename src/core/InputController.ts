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
	
	/** TODO: Remove this workaround */
	let LAST_TOUCH_POS = new Vector();
	
	function TranslateTouchEvent(receiver: IInputEventReceiver, ctx: any, event: TouchEvent)
	{
		let x = 0 , y = 0;
		
		if (event.type !== 'touchend')
		{
			x = event.targetTouches[0].pageX,
			y = event.targetTouches[0].pageY;
			
			let rect = (<HTMLElement>event.target).getBoundingClientRect();
			
			LAST_TOUCH_POS.Set(x - rect.top, y - rect.left);
		}
		
		receiver.call(ctx, LAST_TOUCH_POS.Clone(), event);
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

	type InputAction = {object: core.DisplayObject, action: Function};
	
	export class GenericInputController implements IInputController
	{
		OnDownListeners: Array<InputAction> = [];
		OnUpListeners: Array<InputAction> = [];
		
		WhenPointerDown(object: core.DisplayObject, action: Function): GenericInputController
		{
			this.OnDownListeners.push({object, action});
			return this;
		}
		
		WhenPointerClick(object: core.DisplayObject, action: Function): GenericInputController
		{
			let timeOfDownEvent = 0;
			
			this.OnDownListeners.push({object, action: () => timeOfDownEvent = Date.now()});
			this.OnUpListeners.push({object, action: function()
			{
				if (Date.now() - timeOfDownEvent < 450)
				{
					action();
				}
					
			}});
			
			return this;
		}
		
		OnPointerDown(point: Vector): void
		{
			this.HandleEvent(this.OnDownListeners, point);
		}
		
		OnPointerMove(point: Vector): void
		{
			
		}
		
		OnPointerUp(point: Vector): void
		{
			this.HandleEvent(this.OnUpListeners, point);
		}
		
		private HandleEvent(listeners: Array<InputAction>, point: IVector): void
		{
			for (let {object, action} of listeners)
			{
				if (object.IsPointInside(point))
				{
					action();
				}
			}
		}
		
		Update(): void {}
	}
	
}