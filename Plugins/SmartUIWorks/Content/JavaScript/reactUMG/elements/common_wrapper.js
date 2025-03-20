"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentWrapper = void 0;
// Base abstract class for all component wrappers
class ComponentWrapper {
    typeName;
    props;
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
    parseStyleToWidget(widget) {
        if (this.props.hasOwnProperty('style') || this.props.hasOwnProperty('className')) {
            // Handle style property
            const style = this.props.style;
            // Apply style to widget
        }
        return undefined;
    }
    commonPropertyInitialized(widget) {
        if (this.props.hasOwnProperty('title')) {
            widget.SetToolTipText(this.props.title);
        }
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        // Default empty implementation
    }
}
exports.ComponentWrapper = ComponentWrapper;
//# sourceMappingURL=common_wrapper.js.map