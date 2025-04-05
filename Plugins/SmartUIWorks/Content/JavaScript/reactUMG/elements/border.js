"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
const color_parser_1 = require("./parser/color_parser");
const brush_parser_1 = require("./parser/brush_parser");
const common_utils_1 = require("./common_utils");
class BorderWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const border = new UE.Border();
        this.commonPropertyInitialized(border);
        const backgroundColor = this.props?.backgroundColor;
        if (backgroundColor) {
            const color = (0, color_parser_1.parseColor)(backgroundColor);
            border.SetBrushColor(new UE.LinearColor(color.r, color.g, color.b, color.a));
        }
        const backgroundImage = this.props?.backgroundImage;
        if (backgroundImage) {
            const image = (0, brush_parser_1.parseBrush)(backgroundImage);
            border.SetBrush(image);
        }
        const contentColor = this.props?.contentColor;
        if (contentColor) {
            const color = (0, color_parser_1.parseColor)(contentColor);
            border.SetContentColorAndOpacity(new UE.LinearColor(color.r, color.g, color.b, color.a));
        }
        const contentHorizontalAlign = this.props?.contentHorizontalAlign;
        if (contentHorizontalAlign) {
            switch (contentHorizontalAlign) {
                case 'left':
                    border.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left);
                    break;
                case 'center':
                    border.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
                    break;
                case 'right':
                    border.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right);
                    break;
                case 'fill':
                    border.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
                    break;
                default:
                    console.warn(`Invalid content horizontal align: ${contentHorizontalAlign}`);
                    border.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
                    break;
            }
        }
        const contentVerticalAlign = this.props?.contentVerticalAlign;
        if (contentVerticalAlign) {
            switch (contentVerticalAlign) {
                case 'top':
                    border.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
                    break;
                case 'center':
                    border.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
                    break;
                case 'bottom':
                    border.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
                    break;
                case 'fill':
                    border.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
                    break;
                default:
                    console.warn(`Invalid content vertical align: ${contentVerticalAlign}`);
                    border.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
                    break;
            }
        }
        const contentPadding = this.props?.contentPadding;
        const contentMargin = this.props?.contentMargin;
        if (contentPadding || contentMargin) {
            const padding = (0, common_utils_1.convertMargin)(contentPadding || contentMargin, this.props);
            border.SetPadding(padding);
        }
        {
            let bindEvent = false;
            const onMouseButtonDown = this.props?.onMouseButtonDown;
            if (onMouseButtonDown && typeof onMouseButtonDown === 'function') {
                border.OnMouseButtonDownEvent.Bind((MyGeometry, MouseEvent) => {
                    onMouseButtonDown();
                    return new UE.EventReply();
                });
                bindEvent = true;
            }
            const onMouseButtonUp = this.props?.onMouseButtonUp;
            if (onMouseButtonUp && typeof onMouseButtonUp === 'function') {
                border.OnMouseButtonUpEvent.Bind((MyGeometry, MouseEvent) => {
                    onMouseButtonUp();
                    return new UE.EventReply();
                });
                bindEvent = true;
            }
            const onMouseMove = this.props?.onMouseMove;
            if (onMouseMove && typeof onMouseMove === 'function') {
                border.OnMouseMoveEvent.Bind((MyGeometry, MouseEvent) => {
                    onMouseMove();
                    return new UE.EventReply();
                });
                bindEvent = true;
            }
            const onMouseDoubleClick = this.props?.onMouseDoubleClick;
            if (onMouseDoubleClick && typeof onMouseDoubleClick === 'function') {
                border.OnMouseDoubleClickEvent.Bind((MyGeometry, MouseEvent) => {
                    onMouseDoubleClick();
                    return new UE.EventReply();
                });
                bindEvent = true;
            }
            if (bindEvent) {
                UE.UMGManager.SynchronizeWidgetProperties(border);
            }
        }
        return border;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const border = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.BorderWrapper = BorderWrapper;
//# sourceMappingURL=border.js.map