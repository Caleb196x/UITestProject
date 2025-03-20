import * as UE from 'ue';
import * as puerts from 'puerts'
import { convertCssToStyles } from '../css_converter';

// Base abstract class for all component wrappers
export abstract class ComponentWrapper {
    typeName: string;
    props: any;

    abstract convertToWidget(): UE.Widget;
    abstract updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean;
    convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }

    parseStyleToWidget(widget: UE.Widget) {
        if (this.props.hasOwnProperty('style') || this.props.hasOwnProperty('className')) {
            // Handle style property
            const style = this.props.style;
            // Apply style to widget
        }
        return undefined;
    }

    commonPropertyInitialized(widget: UE.Widget) {
        if (this.props.hasOwnProperty('title')) {
            widget.SetToolTipText(this.props.title as string);
        }
    }

    appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any) {
        // Default empty implementation
    }
}