"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerWrapper = exports.UMGContainerType = void 0;
const common_wrapper_1 = require("../common_wrapper");
const common_utils_1 = require("../common_utils");
const wrapbox_1 = require("./wrapbox");
const gridpanel_1 = require("./gridpanel");
const scrollbox_1 = require("./scrollbox");
const flex_1 = require("./flex");
var UMGContainerType;
(function (UMGContainerType) {
    UMGContainerType[UMGContainerType["ScrollBox"] = 0] = "ScrollBox";
    UMGContainerType[UMGContainerType["GridPanel"] = 1] = "GridPanel";
    UMGContainerType[UMGContainerType["Flex"] = 2] = "Flex";
    UMGContainerType[UMGContainerType["HorizontalBox"] = 3] = "HorizontalBox";
    UMGContainerType[UMGContainerType["VerticalBox"] = 4] = "VerticalBox";
    UMGContainerType[UMGContainerType["WrapBox"] = 5] = "WrapBox";
})(UMGContainerType || (exports.UMGContainerType = UMGContainerType = {}));
class ContainerWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    containerType;
    commonWrapper;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const display = this.containerStyle?.display || 'flex';
        const overflow = this.containerStyle?.overflow || 'visible';
        const overflowX = this.containerStyle?.overflowX || 'visible';
        const overflowY = this.containerStyle?.overflowY || 'visible';
        const flexWrap = this.containerStyle?.flexWrap || 'nowrap';
        // todo@Caleb196x: 处理flex-flow参数
        let widget;
        // Convert to appropriate UMG container based on style
        if (overflow === 'scroll' || overflow === 'auto' ||
            overflowX === 'scroll' || overflowX === 'auto' ||
            overflowY === 'scroll' || overflowY === 'auto') {
            let scrollBoxWrapper = new scrollbox_1.ScrollBoxWrapper(this.typeName, this.props);
            widget = scrollBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.ScrollBox;
            this.commonWrapper = scrollBoxWrapper;
        }
        else if (display === 'grid') {
            // grid panel
            let gridPanelWrapper = new gridpanel_1.GridPanelWrapper(this.typeName, this.props);
            widget = gridPanelWrapper.convertToWidget();
            this.containerType = UMGContainerType.GridPanel;
            this.commonWrapper = gridPanelWrapper;
        }
        else if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {
            let wrapBoxWrapper = new wrapbox_1.WrapBoxWrapper(this.typeName, this.props);
            widget = wrapBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.WrapBox;
            this.commonWrapper = wrapBoxWrapper;
        }
        else {
            let flexWrapper = new flex_1.FlexWrapper(this.typeName, this.props);
            widget = flexWrapper.convertToWidget();
            this.containerType = UMGContainerType.HorizontalBox;
            this.commonWrapper = flexWrapper;
        }
        return widget;
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        this.commonWrapper.appendChildItem(parentItem, childItem, childItemTypeName, childProps);
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return;
    }
}
exports.ContainerWrapper = ContainerWrapper;
//# sourceMappingURL=container.js.map