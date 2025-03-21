import * as UE from 'ue';
import { ComponentWrapper } from '../common_wrapper';
import { UMGContainerType } from './container';
import { mergeClassStyleAndInlineStyle, convertMargin } from '../common_utils';

export class GridPanelWrapper extends ComponentWrapper {
    private containerStyle: any;
    private containerType: UMGContainerType;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.GridPanel;
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
        // Parse gridTemplateColumns and gridTemplateRows
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
            for (let i = 0; i < rowDefinitions.length; i++) {
                const rowDef = rowDefinitions[i];
                if (rowDef.type === 'fr') {
                    // For fr units, we use proportional sizing
                    gridPanel.SetRowFill(i, rowDef.value);
                } else if (rowDef.type === 'auto') {
                    // For auto, we use auto-sizing
                    gridPanel.SetRowFill(i, 0); // Default fill value
                } else {
                    // For fixed sizes (px, em, etc.), we set a fixed size
                    gridPanel.SetRowFill(i, rowDef.value);
                }
            }
        }
    }

    private parseGridColumnOrRow(value: string) {
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

    private setupGridItemLoc(GridSlot: UE.GridSlot, childProps: any) {
        // 优先解析gridColumn和gridRow
        const gridColumn = childProps.style?.gridColumn;
        const gridRow = childProps.style?.gridRow;

        let columnStart = 0, columnSpan = 1;
        let rowStart = 0, rowSpan = 1;

        if (gridColumn) {
            const [start, span] = this.parseGridColumnOrRow(gridColumn);
            columnStart = start;
            columnSpan = span;
        } else {
            const gridColumnStart = childProps.style?.gridColumnStart;
            const gridColumnEnd = childProps.style?.gridColumnEnd;
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
            const [start, span] = this.parseGridColumnOrRow(gridRow);
            rowStart = start;
            rowSpan = span;
        } else {
            const gridRowStart = childProps.style?.gridRowStart;
            const gridRowEnd = childProps.style?.gridRowEnd;
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
            const justifySelf = childProps.style?.justifySelf;
            if (alignSelf) {
                hAlign = alignSelf;
            }

            if (justifySelf) {
                vAlign = justifySelf;
            }
        }

        const hAlignActionMap = {
            'start': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left),
            'end': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right),
            'center': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center),
            'stretch': () => GridSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill)
        }

        const vAlignActionMap = {
            'start': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top),
            'end': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom),
            'center': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center),
            'stretch': () => GridSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill)
        }

        hAlignActionMap[hAlign]();
        vAlignActionMap[vAlign]();
    }

    private initGridPanelSlot(gridPanel: UE.GridPanel, Slot: UE.GridSlot, childProps: any) {
        // todo@Caleb196x: 处理网格布局中的子元素位置

        this.setupGridItemLoc(Slot, childProps);
        this.setupGridAlignment(Slot, childProps);
        const margin = this.containerStyle?.margin;
        Slot.SetPadding(convertMargin(margin, this.containerStyle));
    }

    override convertToWidget(): UE.Widget {
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);
        this.containerType = UMGContainerType.GridPanel;
        const gridPanel = new UE.GridPanel();
        
        // todo@Caleb196x: Configure grid columns based on gridTemplateColumns
        this.setupGridRowAndColumns(gridPanel);

        return gridPanel;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        return true;
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        const gridPanel = parentItem as UE.GridPanel;
        let gridSlot = gridPanel.AddChildToGrid(childItem);
        this.initGridPanelSlot(gridPanel, gridSlot, childProps);
    }   
}
