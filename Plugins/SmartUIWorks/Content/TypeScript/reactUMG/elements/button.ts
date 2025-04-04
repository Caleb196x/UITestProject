import * as UE from 'ue';
import { ComponentWrapper } from './common_wrapper';

export class ButtonWrapper extends ComponentWrapper {
    private readonly eventCallbacks: Record<string, Function> = {
        onClick: undefined,
        onMouseDown: undefined, 
        onMouseUp: undefined,
        onMouseEnter: undefined,
        onMouseLeave: undefined,
        onFocus: undefined,
        onBlur: undefined
    };

    private readonly eventMappings: Record<string, {event: string, handler: string}> = {
        onClick: {event: 'OnClicked', handler: 'onClick'},
        onMouseDown: {event: 'OnPressed', handler: 'onMouseDown'},
        onMouseUp: {event: 'OnReleased', handler: 'onMouseUp'}, 
        onMouseEnter: {event: 'OnHovered', handler: 'onMouseEnter'},
        onMouseLeave: {event: 'OnUnhovered', handler: 'onMouseLeave'},
        onFocus: {event: 'OnHovered', handler: 'onFocus'},
        onBlur: {event: 'OnUnhovered', handler: 'onBlur'}
    };

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    private setupEventHandler(button: UE.Button, eventName: string, handler: Function) {
        if (typeof handler === 'function') {
            const mapping = this.eventMappings[eventName];
            this.eventCallbacks[mapping.handler] = handler;
            button[mapping.event].Add(handler);
        }
    }

    private removeEventHandler(button: UE.Button, eventName: string) {
        const mapping = this.eventMappings[eventName];
        const callback = this.eventCallbacks[mapping.handler];
        if (callback) {
            button[mapping.event].Remove(callback);
        }
    }

    override convertToWidget(): UE.Widget {
        const button = new UE.Button();

        // Setup all event handlers
        for (const eventName in this.eventMappings) {
            this.setupEventHandler(button, eventName, this.props[eventName]);
        }

        // Handle disabled state
        if (this.props?.disabled) {
            button.bIsEnabled = false;
        }

        this.parseStyleToWidget(button);
        this.commonPropertyInitialized(button);

        return button;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        let propsChange = false;
        const button = widget as UE.Button;

        for (const key in newProps) {
            const oldProp = oldProps[key];
            const newProp = newProps[key];

            if (oldProp === newProp) continue;

            propsChange = true;

            if (key in this.eventMappings) {
                if (typeof newProp === 'function') {
                    this.removeEventHandler(button, key);
                    this.setupEventHandler(button, key, newProp);
                }
            } else if (key === 'disabled') {
                button.bIsEnabled = !newProp;
            }
        }

        this.commonPropertyInitialized(widget);
        return propsChange;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}