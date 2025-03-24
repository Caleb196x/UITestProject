"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollBoxWrapper = void 0;
const common_wrapper_1 = require("../common_wrapper");
const UE = require("ue");
const common_utils_1 = require("../common_utils");
class ScrollBoxWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    setupScrollBox(scrollBox, isScrollX) {
        if (isScrollX) {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Horizontal);
        }
        else {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Vertical);
        }
        // setup scrollbar thickness
        const scrollbarWidth = this.containerStyle?.scrollbarWidth || 'auto';
        const scrollbarLevel = {
            'auto': 12,
            'thin': 8
        };
        if (scrollbarWidth === 'none') {
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Collapsed);
        }
        else {
            if (scrollbarWidth in scrollbarLevel) {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel[scrollbarWidth], scrollbarLevel[scrollbarWidth]));
            }
            else if (scrollbarWidth.endsWith('px')) {
                // Extract the numeric part by removing the 'px' suffix
                const numericWidth = parseInt(scrollbarWidth.slice(0, -2));
                let thickness = new UE.Vector2D(numericWidth, numericWidth);
                scrollBox.SetScrollbarThickness(thickness);
            }
            else {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel['auto'], scrollbarLevel['auto']));
            }
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Visible);
        }
        const scrollPadding = this.containerStyle?.scrollPadding || '0px';
        scrollBox.SetScrollbarPadding((0, common_utils_1.convertMargin)(scrollPadding, this.containerStyle));
        scrollBox.SetAlwaysShowScrollbar(true);
    }
    setupAlignment(Slot, childStyle) {
        const style = this.containerStyle || {};
        const display = style?.display;
        let rowReverse = display === 'row-reverse';
        const alignSelf = childStyle?.alignSelf || 'stretch';
        const justifySelf = childStyle?.justifySelf || 'stretch';
        const scrollBoxStretchHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };
        const scrollBoxLeftHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left);
        };
        const scrollBoxRightHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right);
        };
        const scrollBoxCenterHorizontalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const scrollBoxStretchVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };
        const scrollBoxTopVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };
        const scrollBoxBottomVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };
        const scrollBoxCenterVerticalAlignmentFunc = (scrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };
        const scrollBoxJustifySelfActionMap = {
            'stretch': scrollBoxStretchHorizontalAlignmentFunc,
            'left': scrollBoxLeftHorizontalAlignmentFunc,
            'right': scrollBoxRightHorizontalAlignmentFunc,
            'center': scrollBoxCenterHorizontalAlignmentFunc,
            'start': scrollBoxLeftHorizontalAlignmentFunc,
            'end': scrollBoxRightHorizontalAlignmentFunc,
            'flex-start': scrollBoxLeftHorizontalAlignmentFunc,
            'flex-end': scrollBoxRightHorizontalAlignmentFunc,
        };
        const scrollBoxAlignSelfActionMap = {
            'stretch': scrollBoxStretchVerticalAlignmentFunc,
            'top': scrollBoxTopVerticalAlignmentFunc,
            'bottom': scrollBoxBottomVerticalAlignmentFunc,
            'center': scrollBoxCenterVerticalAlignmentFunc,
            'start': scrollBoxTopVerticalAlignmentFunc,
            'end': scrollBoxBottomVerticalAlignmentFunc,
            'flex-start': scrollBoxTopVerticalAlignmentFunc,
            'flex-end': scrollBoxBottomVerticalAlignmentFunc,
        };
        const scrollBoxSlot = Slot;
        const scrollBoxJustifySelfValue = justifySelf?.split(' ').find(v => scrollBoxJustifySelfActionMap[v]);
        if (scrollBoxJustifySelfValue) {
            scrollBoxJustifySelfActionMap[scrollBoxJustifySelfValue](scrollBoxSlot);
        }
        const scrollBoxAlignSelfValue = alignSelf?.split(' ').find(v => scrollBoxAlignSelfActionMap[v]);
        if (scrollBoxAlignSelfValue) {
            scrollBoxAlignSelfActionMap[scrollBoxAlignSelfValue](scrollBoxSlot);
        }
    }
    initScrollBoxSlot(scrollBox, Slot, childProps) {
        const childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(childProps);
        this.setupAlignment(Slot, childStyle);
        let gapPadding = (0, common_utils_1.convertGap)(this.containerStyle?.gap, this.containerStyle);
        // todo@Caleb196x: 只有父元素为border，SizeBox, ScaleBox, BackgroundBlur这些只能容纳一个子元素的容器时，padding才有意义，
        // 对于容器来说，读取margin值
        let margin = (0, common_utils_1.convertMargin)(childStyle.margin, this.containerStyle);
        margin.Left += gapPadding.X;
        margin.Right += gapPadding.X;
        margin.Top += gapPadding.Y;
        margin.Bottom += gapPadding.Y;
        Slot.SetPadding(margin);
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const scrollBox = new UE.ScrollBox();
        this.setupScrollBox(scrollBox, this.containerStyle?.overflowX === 'scroll' || this.containerStyle?.overflowX === 'auto');
        return scrollBox;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return true;
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        let scrollBox = parentItem;
        let scrollBoxSlot = scrollBox.AddChild(childItem);
        this.initScrollBoxSlot(scrollBox, scrollBoxSlot, childProps);
    }
}
exports.ScrollBoxWrapper = ScrollBoxWrapper;
//# sourceMappingURL=scrollbox.js.map