import * as UE from 'ue';
import { ComponentWrapper } from '../common_wrapper';
import { mergeClassStyleAndInlineStyle, convertMargin } from '../common_utils';

export class GridPanelWrapper extends ComponentWrapper {
    private containerStyle: any;
    private totalRows: number = 0;

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }
    // Helper method to parse grid template values
    private parseGridTemplate(template: string): Array<{type: string, value: number}> {
        const result: Array<{type: string, value: number}> = [];
        
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
        } else {
            // Handle normal space-separated values: 1fr auto 100px
            const values = template.split(/\s+/);
            for (const value of values) {
                result.push(this.parseGridValue(value));
            }
        }
        
        return result;
    }
    
    // Helper method to parse individual grid values
    private parseGridValue(value: string): {type: string, value: number} {
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

    private setupGridRowAndColumns(gridPanel: UE.GridPanel) {
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
                } else if (columnDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetColumnFill(i, 0); // Default fill value
                } else{
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetColumnFill(i, columnDef.value);
                }
            }
        }

        if (gridTemplateRows) {
            const rowDefinitions = this.parseGridTemplate(gridTemplateRows);
            this.totalRows = rowDefinitions.length;

            for (let i = 0; i < rowDefinitions.length; i++) {
                const rowDef = rowDefinitions[i];
                if (rowDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetRowFill(i, rowDef.value);
                } else if (rowDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetRowFill(i, 0); // Default fill value
                } else {
                    // todo@Caleb196x: 将像素值转换成fill值
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetRowFill(i, rowDef.value);
                }
            }
        }
    }

    private parseGridColumnOrRow(value: string) {
        let start: number = 0;
        let span: number = 0;
    
        // 处理 "auto"（默认从 1 开始，占 1 行）
        if (value === "auto") {
            return { start, span };
        }
    
        const parts = value.split("/").map(part => part.trim());
    
        // 处理单个数字格式，例如 "2"
        if (parts.length === 1) {
            if (parts[0].startsWith("span")) {
                span = parseInt(parts[0].replace("span", "").trim(), 10);
            } else {
                start = parseInt(parts[0], 10) - 1; // parts[0] 从 1 开始，所以需要减 1
                span = 1;
            }
        }
        // 处理 "2 / 4" 或 "2 / span 2"
        else if (parts.length === 2) {
            const [left, right] = parts;
    
            // 解析起始行
            let span_left = false;
            if (left.startsWith("span")) {
                span = parseInt(left.replace("span", "").trim(), 10);
                span_left = true;
            } else {
                start = left === "auto" ? 0 : parseInt(left, 10) - 1;
            }
    
            // 解析终止行或者 span
            if (right.startsWith("span")) {
                span = parseInt(right.replace("span", "").trim(), 10);
            } else {
                const num = parseInt(right, 10);
                const end = right !== "-1" ? num < this.totalRows ? num : this.totalRows : this.totalRows;
                
                if (span_left) {
                    start = end - span;
                } else {
                    span = end - start;
                }
            }
        }
    
        return { start, span };
    }

    private setupGridItemLoc(GridSlot: UE.GridSlot, childProps: any) {
        // 优先解析gridColumn和gridRow
        const childStyle = mergeClassStyleAndInlineStyle(childProps);
        const gridColumn = childStyle?.gridColumn;
        const gridRow = childStyle?.gridRow;

        let columnStart = 0, columnSpan = 1;
        let rowStart = 0, rowSpan = 1;

        if (gridColumn) {
            const {start, span} = this.parseGridColumnOrRow(gridColumn);
            columnStart = start;
            columnSpan = span;
        } else {
            const gridColumnStart = childStyle?.gridColumnStart;
            const gridColumnEnd = childStyle?.gridColumnEnd;
            let start = parseInt(gridColumnStart);
            let end = parseInt(gridColumnEnd);
            if (end < start) {
                columnSpan = 0;
            } else {
                columnSpan = end - start;
            }
            columnStart = start;
        }

        if (gridRow) {
            const {start, span} = this.parseGridColumnOrRow(gridRow);
            rowStart = start;
            rowSpan = span;
        } else {
            const gridRowStart = childStyle?.gridRowStart;
            const gridRowEnd = childStyle?.gridRowEnd;
            let start = parseInt(gridRowStart);
            let end = parseInt(gridRowEnd);
            if (end < start) {
                rowSpan = 0;
            } else {
                rowSpan = end - start;
            }
            rowStart = start;
        }

        GridSlot.SetColumn(columnStart);
        GridSlot.SetColumnSpan(columnSpan);
        GridSlot.SetRow(rowStart);
        GridSlot.SetRowSpan(rowSpan);
    }

    private setupGridAlignment(GridSlot: UE.GridSlot, childProps: any) {
        const placeSelf = childProps.style?.placeSelf;
        let hAlign = 'stretch', vAlign = 'stretch';
        if (placeSelf) {
            const [h, v] = placeSelf.split(' ').map(v => v.trim());
            hAlign = h;
            vAlign = v;
        } else {
            const alignSelf = childProps.style?.alignSelf;
            
            if (alignSelf) {
                vAlign = alignSelf;
            } else {
                vAlign = this.containerStyle?.alignItems || 'stretch';
            }

            const justifySelf = childProps.style?.justifySelf;
            if (justifySelf) {
                hAlign = justifySelf;
            } else {
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
        }

        const vAlignActionMap = {
            'start': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'end': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'top': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'bottom': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'flex-start': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'flex-end': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'center': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center),
            'stretch': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill)
        }

        hAlignActionMap[hAlign]();
        vAlignActionMap[vAlign]();
    }

    private initGridPanelSlot(Slot: UE.GridSlot, childProps: any) {
        this.setupGridItemLoc(Slot, childProps);
        this.setupGridAlignment(Slot, childProps);
        const margin = this.containerStyle?.margin;
        Slot.SetPadding(convertMargin(margin, this.containerStyle));
    }

    override convertToWidget(): UE.Widget {
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);
        const gridPanel = new UE.GridPanel();
        this.setupGridRowAndColumns(gridPanel);
        return gridPanel;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        return true;
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        const gridPanel = parentItem as UE.GridPanel;
        let gridSlot = gridPanel.AddChildToGrid(childItem);
        this.initGridPanelSlot(gridSlot, childProps);
    }
}
