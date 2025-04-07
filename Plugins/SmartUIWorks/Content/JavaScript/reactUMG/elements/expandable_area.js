"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandableAreaWrapper = void 0;
const common_wrapper_1 = require("./common_wrapper");
const UE = require("ue");
const brush_parser_1 = require("./parser/brush_parser");
const common_utils_1 = require("./common_utils");
const color_parser_1 = require("./parser/color_parser");
class ExpandableAreaWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    valueConvertKeyMap = {
        'expanded': 'bIsExpanded',
        'maxHeight': 'MaxHeight',
    };
    styleKeyMap = {
        'collapsedIcon': 'CollapsedImage',
        'expandedIcon': 'ExpandedImage',
    };
    paddingKeyMap = {
        'headerPadding': 'HeaderPadding',
        'areaPadding': 'AreaPadding',
    };
    WidgetKeyMap = {
        'header': 'HeaderContent',
        'area': 'BodyContent',
    };
    convertToWidget() {
        const expandableArea = new UE.ExpandableArea();
        this.commonPropertyInitialized(expandableArea);
        for (const key in this.props) {
            if (this.valueConvertKeyMap[key]) {
                expandableArea[this.valueConvertKeyMap[key]] = this.props[key];
            }
            else if (this.styleKeyMap[key]) {
                expandableArea.Style[this.styleKeyMap[key]] = (0, brush_parser_1.parseBrush)(this.props[key]);
            }
            else if (this.WidgetKeyMap[key]) {
                // todo@Caleb196x: 添加SetHeaderContent和SetAreaContent方法
            }
            else if (this.paddingKeyMap[key]) {
                expandableArea[this.paddingKeyMap[key]] = (0, common_utils_1.convertMargin)(this.props[key], {});
            }
            else if (key === 'borderColor') {
                const rgba = (0, color_parser_1.parseColor)(this.props[key]);
                expandableArea.BorderColor.SpecifiedColor = new UE.LinearColor(rgba.r, rgba.g, rgba.b, rgba.a);
            }
            else if (key === 'borderImage') {
                expandableArea.BorderBrush = (0, brush_parser_1.parseBrush)(this.props[key]);
            }
            else if (key === 'rolloutAnimationLasts') {
                expandableArea.Style.RolloutAnimationSeconds = this.props[key];
            }
            else if (key === 'onExpansionChanged' && typeof this.props[key] === 'function') {
                expandableArea.OnExpansionChanged.Add((Area, bIsExpanded) => {
                    this.props[key](bIsExpanded);
                });
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(expandableArea);
        return expandableArea;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const expandableArea = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.ExpandableAreaWrapper = ExpandableAreaWrapper;
//# sourceMappingURL=expandable_area.js.map