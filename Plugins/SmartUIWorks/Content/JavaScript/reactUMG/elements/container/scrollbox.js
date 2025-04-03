"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollBoxWrapper = void 0;
const common_wrapper_1 = require("../common_wrapper");
const UE = require("ue");
const common_utils_1 = require("../common_utils");
class ScrollBoxWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    isScrollX;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    setupScrollBox(scrollBox) {
        if (this.isScrollX) {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Horizontal);
        }
        else {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Vertical);
        }
        // setup scrollbar thickness
        const scrollbarWidth = this.containerStyle?.scrollbarWidth || 'auto';
        const scrollbarLevel = {
            'auto': 14,
            'thin': 10
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
                scrollBox.SetScrollbarThickness(new UE.Vector2D(numericWidth, numericWidth));
            }
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Visible);
        }
        const scrollPadding = this.containerStyle?.scrollPadding || '0px';
        scrollBox.SetScrollbarPadding((0, common_utils_1.convertMargin)(scrollPadding, this.containerStyle));
        const onScroll = this.containerStyle?.onScroll;
        if (onScroll && typeof onScroll === 'function') {
            scrollBox.OnUserScrolled.Add((CurrentOffset) => { onScroll(CurrentOffset); });
        }
    }
    setupAlignment(Slot, childStyle) {
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
        const scrollBoxHorizontalActionMap = {
            'stretch': scrollBoxStretchHorizontalAlignmentFunc,
            'left': scrollBoxLeftHorizontalAlignmentFunc,
            'right': scrollBoxRightHorizontalAlignmentFunc,
            'center': scrollBoxCenterHorizontalAlignmentFunc,
            'start': scrollBoxLeftHorizontalAlignmentFunc,
            'end': scrollBoxRightHorizontalAlignmentFunc,
            'flex-start': scrollBoxLeftHorizontalAlignmentFunc,
            'flex-end': scrollBoxRightHorizontalAlignmentFunc,
        };
        const scrollBoxVerticalActionMap = {
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
        if (this.isScrollX) {
            const scrollBoxAlignSelfValue = alignSelf?.split(' ').find(v => scrollBoxVerticalActionMap[v]);
            if (scrollBoxAlignSelfValue) {
                scrollBoxVerticalActionMap[scrollBoxAlignSelfValue](scrollBoxSlot);
            }
            else {
                const alignItems = this.containerStyle?.alignItems || 'stretch';
                const scrollBoxAlignItemsValue = alignItems?.split(' ').find(v => scrollBoxVerticalActionMap[v]);
                scrollBoxVerticalActionMap[scrollBoxAlignItemsValue](scrollBoxSlot);
            }
        }
        else {
            const value = alignSelf?.split(' ').find(v => scrollBoxHorizontalActionMap[v]);
            if (value) {
                scrollBoxHorizontalActionMap[value](scrollBoxSlot);
            }
            else {
                const alignItems = this.containerStyle?.alignItems || 'stretch';
                const value = alignItems?.split(' ').find(v => scrollBoxHorizontalActionMap[v]);
                scrollBoxHorizontalActionMap[value](scrollBoxSlot);
            }
        }
    }
    initScrollBoxSlot(scrollBox, Slot, childProps) {
        const childStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(childProps);
        this.setupAlignment(Slot, childStyle);
        let margin = (0, common_utils_1.convertMargin)(childStyle.margin, this.containerStyle);
        Slot.SetPadding(margin);
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const overflow = this.containerStyle?.overflow;
        const flexDirection = this.containerStyle?.flexDirection || 'column';
        this.isScrollX = this.containerStyle?.overflowX === 'scroll'
            || this.containerStyle?.overflowX === 'auto'
            || flexDirection === 'row';
        const scrollBox = new UE.ScrollBox();
        this.setupScrollBox(scrollBox);
        if (overflow === 'hidden' || overflow === 'clip') {
            scrollBox.SetClipping(UE.EWidgetClipping.ClipToBounds);
        }
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