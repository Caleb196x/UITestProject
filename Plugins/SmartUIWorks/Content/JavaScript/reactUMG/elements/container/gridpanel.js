"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPanelWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("../common_wrapper");
const common_utils_1 = require("../common_utils");
class GridPanelWrapper extends common_wrapper_1.ComponentWrapper {
    containerStyle;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    // Helper method to parse grid template values
    parseGridTemplate(template) {
        const result = [];
        // Handle repeat syntax: repeat(3, 1fr)
        if (template.includes('repeat(')) {
            const repeatRegex = /repeat\((\d+),\s*([^)]+)\)/g;
            let match;
            while ((match = repeatRegex.exec(template)) !== null) {
                const count = parseInt(match[1], 10);
                const value = match[2].trim();
                // Create the specified number of identical definitions
                for (let i = 0; i < count; i++) {
                    result.push(this.parseGridValue(value));
                }
            }
        }
        else {
            // Handle normal space-separated values: 1fr auto 100px
            const values = template.split(/\s+/);
            for (const value of values) {
                result.push(this.parseGridValue(value));
            }
        }
        return result;
    }
    // Helper method to parse individual grid values
    parseGridValue(value) {
        if (value === 'auto') {
            return { type: 'auto', value: 0 };
        }
        // Match numeric value and unit
        const match = value.match(/^(\d*\.?\d+)([a-z%]*)$/);
        if (match) {
            let numValue = parseFloat(match[1]);
            const unit = match[2] || 'px';
            if (unit === 'em' || unit === 'rem') {
                numValue = numValue * 16;
            }
            // todo@Caleb196x: 需要知道父控件的宽度和长度所占像素值，然后根据px值转换成占比值fr
            return { type: unit, value: numValue };
        }
        // Default fallback
        return { type: 'fr', value: 1 };
    }
    setupGridRowAndColumns(gridPanel) {
        const gridTemplateColumns = this.containerStyle?.gridTemplateColumns;
        const gridTemplateRows = this.containerStyle?.gridTemplateRows;
        // todo@Caleb196x: 目前只处理gridTemplateColumns和gridTemplateRows两个参数
        // 指出的单位有fr, repeat(3, 1fr)
        if (gridTemplateColumns) {
            const columnDefinitions = this.parseGridTemplate(gridTemplateColumns);
            for (let i = 0; i < columnDefinitions.length; i++) {
                const columnDef = columnDefinitions[i];
                if (columnDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetColumnFill(i, columnDef.value);
                }
                else if (columnDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetColumnFill(i, 0); // Default fill value
                }
                else {
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetColumnFill(i, columnDef.value);
                }
            }
        }
        if (gridTemplateRows) {
            const rowDefinitions = this.parseGridTemplate(gridTemplateRows);
            for (let i = 0; i < rowDefinitions.length; i++) {
                const rowDef = rowDefinitions[i];
                if (rowDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetRowFill(i, rowDef.value);
                }
                else if (rowDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetRowFill(i, 0); // Default fill value
                }
                else {
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetRowFill(i, rowDef.value);
                }
            }
        }
    }
    parseGridColumnOrRow(value) {
        const values = value.split('/').map(v => v.trim());
        if (values.length === 2) {
            let start = parseInt(values[0]);
            let end = parseInt(values[1]);
            if (end < start) {
                return [start, 0];
            }
            return [start, end - start];
        }
        return [0, 1];
    }
    setupGridItemLoc(GridSlot, childProps) {
        // 优先解析gridColumn和gridRow
        const gridColumn = childProps.style?.gridColumn;
        const gridRow = childProps.style?.gridRow;
        let columnStart = 0, columnSpan = 1;
        let rowStart = 0, rowSpan = 1;
        if (gridColumn) {
            const [start, span] = this.parseGridColumnOrRow(gridColumn);
            columnStart = start;
            columnSpan = span;
        }
        else {
            const gridColumnStart = childProps.style?.gridColumnStart;
            const gridColumnEnd = childProps.style?.gridColumnEnd;
            let start = parseInt(gridColumnStart);
            let end = parseInt(gridColumnEnd);
            if (end < start) {
                columnSpan = 0;
            }
            else {
                columnSpan = end - start;
            }
            columnStart = start;
        }
        if (gridRow) {
            const [start, span] = this.parseGridColumnOrRow(gridRow);
            rowStart = start;
            rowSpan = span;
        }
        else {
            const gridRowStart = childProps.style?.gridRowStart;
            const gridRowEnd = childProps.style?.gridRowEnd;
            let start = parseInt(gridRowStart);
            let end = parseInt(gridRowEnd);
            if (end < start) {
                rowSpan = 0;
            }
            else {
                rowSpan = end - start;
            }
            rowStart = start;
        }
        GridSlot.SetColumn(columnStart);
        GridSlot.SetColumnSpan(columnSpan);
        GridSlot.SetRow(rowStart);
        GridSlot.SetRowSpan(rowSpan);
    }
    setupGridAlignment(GridSlot, childProps) {
        const placeSelf = childProps.style?.placeSelf;
        let hAlign = 'stretch', vAlign = 'stretch';
        if (placeSelf) {
            const [h, v] = placeSelf.split(' ').map(v => v.trim());
            hAlign = h;
            vAlign = v;
        }
        else {
            const alignSelf = childProps.style?.alignSelf;
            if (alignSelf) {
                vAlign = alignSelf;
            }
            else {
                vAlign = this.containerStyle?.alignItems || 'stretch';
            }
            const justifySelf = childProps.style?.justifySelf;
            if (justifySelf) {
                hAlign = justifySelf;
            }
            else {
                hAlign = this.containerStyle?.justifyContent || 'stretch';
            }
        }
        const hAlignActionMap = {
            'start': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'end': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'left': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'right': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'flex-start': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'flex-end': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'center': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'stretch': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill)
        };
        const vAlignActionMap = {
            'start': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'end': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'left': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'right': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'flex-start': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'flex-end': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'center': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center),
            'stretch': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill)
        };
        hAlignActionMap[hAlign]();
        vAlignActionMap[vAlign]();
    }
    initGridPanelSlot(gridPanel, Slot, childProps) {
        this.setupGridItemLoc(Slot, childProps);
        this.setupGridAlignment(Slot, childProps);
        const margin = this.containerStyle?.margin;
        Slot.SetPadding((0, common_utils_1.convertMargin)(margin, this.containerStyle));
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        const gridPanel = new UE.GridPanel();
        this.setupGridRowAndColumns(gridPanel);
        return gridPanel;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return true;
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        const gridPanel = parentItem;
        let gridSlot = gridPanel.AddChildToGrid(childItem);
        this.initGridPanelSlot(gridPanel, gridSlot, childProps);
    }
}
exports.GridPanelWrapper = GridPanelWrapper;
//# sourceMappingURL=gridpanel.js.map