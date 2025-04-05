"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentWrapper = void 0;
const UE = require("ue");
const puerts = require("puerts");
const common_props_parser_1 = require("./parser/common_props_parser");
// Base abstract class for all component wrappers
class ComponentWrapper {
    typeName;
    props;
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
    commonPropertyInitialized(widget) {
        const widgetProps = (0, common_props_parser_1.convertCommonPropsToWidgetProps)(this.props);
        puerts.merge(widget, widgetProps);
        UE.UMGManager.SynchronizeWidgetProperties(widget);
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        // Default empty implementation
    }
}
exports.ComponentWrapper = ComponentWrapper;
//# sourceMappingURL=common_wrapper.js.map