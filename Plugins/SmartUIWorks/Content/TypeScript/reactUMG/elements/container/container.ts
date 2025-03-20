import * as UE from 'ue';
import { ComponentWrapper } from "../common_wrapper";
import { convertCssToStyles } from 'reactUMG/css_converter';

enum UMGContainerType {
    ScrollBox,
    GridPanel, 
    HorizontalBox,
    VerticalBox,
    WrapBox
}

export class ContainerWrapper extends ComponentWrapper {
    private containerStyle: any;
    private containerType: UMGContainerType;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
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
        const gridTemplate = this.containerStyle?.gridTemplate;

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

    private setupScrollBox(scrollBox: UE.ScrollBox, isScrollX: boolean) {
        if (isScrollX) {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Horizontal);
        } else {
            scrollBox.SetOrientation(UE.EOrientation.Orient_Vertical);
        }

        // setup scrollbar thickness
        const scrollbarWidth = this.containerStyle?.scrollbarWidth || 'auto';
        const scrollbarLevel = {
            'auto': 12,
            'thin': 8
        }

        if (scrollbarWidth === 'none') {
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Collapsed);
        } else {
            if (scrollbarWidth in scrollbarLevel) {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel[scrollbarWidth], scrollbarLevel[scrollbarWidth]));
            } else if (scrollbarWidth.endsWith('px')) {
                // Extract the numeric part by removing the 'px' suffix
                const numericWidth = parseInt(scrollbarWidth.slice(0, -2));
                let thickness = new UE.Vector2D(numericWidth, numericWidth);
                scrollBox.SetScrollbarThickness(thickness);
            } else {
                scrollBox.SetScrollbarThickness(new UE.Vector2D(scrollbarLevel['auto'], scrollbarLevel['auto']));
            }
            scrollBox.SetScrollBarVisibility(UE.ESlateVisibility.Visible);
        }

        const scrollPadding = this.containerStyle?.scrollPadding || '0px';
        scrollBox.SetScrollbarPadding(this.convertMargin(scrollPadding));
        scrollBox.SetAlwaysShowScrollbar(true);
    }

    override convertToWidget(): UE.Widget { 
        let classNameStyles = {};
        if (this.props.className) {
            // Split multiple classes
            const classNames = this.props.className.split(' ');
            for (const className of classNames) {
                // Get styles associated with this class name
                const classStyle = convertCssToStyles(getCssStyleForClass(className));
                // todo@Caleb196x: 解析classStyle
                if (classStyle) {
                    // Merge the class styles into our style object
                    classNameStyles = { ...classNameStyles, ...classStyle };
                }
            }
        }

        // Merge className styles with inline styles, giving precedence to inline styles
        const mergedStyle = { ...classNameStyles, ...(this.props.style || {}) };
        
        this.containerStyle = mergedStyle;

        const display = mergedStyle?.display || 'flex';
        const flexDirection = mergedStyle?.flexDirection || 'row';
        const overflow = mergedStyle?.overflow || 'visible';
        const overflowX = mergedStyle?.overflowX || 'visible';
        const overflowY = mergedStyle?.overflowY || 'visible';

        // todo@Caleb196x: 处理flex-flow参数

        let widget: UE.Widget;
        // Convert to appropriate UMG container based on style
        if (overflow === 'scroll' || overflow === 'auto' ||
            overflowX === 'scroll' || overflowX === 'auto' ||
            overflowY === 'scroll' || overflowY === 'auto'
        ) {
            widget = new UE.ScrollBox();
            this.containerType = UMGContainerType.ScrollBox;
            this.setupScrollBox(widget as UE.ScrollBox,
                 overflowX === 'scroll' || overflowX === 'auto'
            );
        } else if (display === 'grid') {
            // grid panel
            widget = new UE.GridPanel();
            this.containerType = UMGContainerType.GridPanel;
            // todo@Caleb196x: Configure grid columns based on gridTemplateColumns
            this.setupGridRowAndColumns(widget as UE.GridPanel);
            
        } else if (display === 'flex') {
            const flexWrap = mergedStyle?.flexWrap || 'nowrap';
            if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {
                widget = new UE.WrapBox();
                this.containerType = UMGContainerType.WrapBox;
                let wrapBox = widget as UE.WrapBox;

                wrapBox.Orientation = 
                    (flexDirection === 'column'|| flexDirection === 'column-reverse')
                    ? UE.EOrientation.Orient_Vertical : UE.EOrientation.Orient_Horizontal;

            } else if (flexDirection === 'row' || flexDirection === 'row-reverse') {

                widget = new UE.HorizontalBox();
                this.containerType = UMGContainerType.HorizontalBox;

            } else if (flexDirection === 'column' || flexDirection === 'column-reverse') {

                widget = new UE.VerticalBox();
                this.containerType = UMGContainerType.VerticalBox;

            }
        } else if (display === 'block') {
            widget = new UE.VerticalBox();
            this.containerType = UMGContainerType.VerticalBox;
        }

        return widget;
    }

    private convertPixelToSU(pixel: string): number {
        // todo@Caleb196x: 将react中的单位转换为SU单位(UMG中的单位值)
        // get font size of parent
        let fontSize = this.containerStyle?.fontSize || '16px';
        if (!fontSize.endsWith('px')) {
            fontSize = '16px';
        }

        const numSize = parseInt(fontSize.replace('px', '')); 
        if (pixel.endsWith('px')) {
            const match = pixel.match(/(\d+)px/);
            if (match) {
                return parseInt(match[1]);
            }
        } else if (pixel.endsWith('%')) {
            // todo@Caleb196x: 需要获取父元素的值
        } else if (pixel.endsWith('em')) {
            const match = pixel.match(/(\d+)em/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        } else if (pixel.endsWith('rem')) {
            const match = pixel.match(/(\d+)rem/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        }

        return 0; 
    }
    
    private setupAlignment(Slot: UE.PanelSlot, childProps: any) {
        const style = this.containerStyle || {};
        const justifyContent = childProps.style?.justifyContent || style.justifyContent || 'flex-start';
        const alignItems = childProps.style?.alignItems || style.alignItems || 'stretch';
        const display = style.display;
        let rowReverse = display === 'row-reverse';
        const flexValue = childProps.style?.flex || 0;
        const alignSelf = childProps.style?.alignSelf || 'stretch';
        const justifySelf = childProps.style?.justifySelf || 'stretch';

        // Set horizontal alignment based on justifyContent
        const hStartSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left);
        };
        const hEndSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right);
        };
        const hCenterSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };
        const hStretchSetHorizontalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };

        const hSpaceBetweenSetAlginFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill));
        };

        const hJustifySelfActionMap = {
            'flex-start': hStartSetHorizontalAlignmentFunc,
            'flex-end': hEndSetHorizontalAlignmentFunc,
            'left': hStartSetHorizontalAlignmentFunc,
            'right': hEndSetHorizontalAlignmentFunc,
            'start': hStartSetHorizontalAlignmentFunc,
            'end': hEndSetHorizontalAlignmentFunc,
            'center': hCenterSetHorizontalAlignmentFunc,
            'stretch': hStretchSetHorizontalAlignmentFunc,
            'space-between': hSpaceBetweenSetAlginFunc
        };

        const hStartSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };

        const hEndSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };

        const hCenterSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };

        const hStretchSetVerticalAlignmentFunc = (horizontalBoxSlot: UE.HorizontalBoxSlot) => {
            horizontalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };

        const hAlignSelfActionMap = {
            'stretch': hStretchSetVerticalAlignmentFunc,
            'center': hCenterSetVerticalAlignmentFunc,
            'flex-start': hStartSetVerticalAlignmentFunc,
            'flex-end': hEndSetVerticalAlignmentFunc,
            'start': hStartSetVerticalAlignmentFunc,
            'end': hEndSetVerticalAlignmentFunc,
            'left': hStartSetVerticalAlignmentFunc,
            'right': hEndSetVerticalAlignmentFunc
        }

        const vSpaceBetweenSetAlginFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetSize(new UE.SlateChildSize(flexValue, UE.ESlateSizeRule.Fill));
        };

        const vStartSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        };

        const vEndSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        };

        const vCenterSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        };

        const vStretchSetVerticalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        };

        const vJustifySelfActionMap = {
            'flex-start': vStartSetVerticalAlignmentFunc,
            'flex-end': vEndSetVerticalAlignmentFunc,
            'start': vStartSetVerticalAlignmentFunc,
            'end': vEndSetVerticalAlignmentFunc,
            'left': vStartSetVerticalAlignmentFunc,
            'right': vEndSetVerticalAlignmentFunc,

            'center': vCenterSetVerticalAlignmentFunc,
            'stretch': vStretchSetVerticalAlignmentFunc,
            'space-between': vSpaceBetweenSetAlginFunc
        };
        
        const vStartSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Right : UE.EHorizontalAlignment.HAlign_Left);
        };

        const vEndSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(rowReverse ? UE.EHorizontalAlignment.HAlign_Left : UE.EHorizontalAlignment.HAlign_Right);
        };

        const vCenterSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        };

        const vStretchSetHorizontalAlignmentFunc = (verticalBoxSlot: UE.VerticalBoxSlot) => {
            verticalBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        };

        const vAlignSelfActionMap = {
            'stretch': vStretchSetHorizontalAlignmentFunc,
            'center': vCenterSetHorizontalAlignmentFunc,
            'flex-start': vStartSetHorizontalAlignmentFunc,
            'flex-end': vEndSetHorizontalAlignmentFunc,
            'start': vStartSetHorizontalAlignmentFunc,
            'end': vEndSetHorizontalAlignmentFunc,
            'left': vStartSetHorizontalAlignmentFunc,
            'right': vEndSetHorizontalAlignmentFunc
        }

        const scrollBoxStretchHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Fill);
        }

        const scrollBoxLeftHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Left);
        }

        const scrollBoxRightHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Right);
        }

        const scrollBoxCenterHorizontalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetHorizontalAlignment(UE.EHorizontalAlignment.HAlign_Center);
        }

        const scrollBoxStretchVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Fill);
        }

        const scrollBoxTopVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Top);
        }

        const scrollBoxBottomVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => {
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Bottom);
        }

        const scrollBoxCenterVerticalAlignmentFunc = (scrollBoxSlot: UE.ScrollBoxSlot) => { 
            scrollBoxSlot.SetVerticalAlignment(UE.EVerticalAlignment.VAlign_Center);
        }

        const scrollBoxJustifySelfActionMap = {
            'stretch': scrollBoxStretchHorizontalAlignmentFunc,
            'left': scrollBoxLeftHorizontalAlignmentFunc,
            'right': scrollBoxRightHorizontalAlignmentFunc,
            'center': scrollBoxCenterHorizontalAlignmentFunc,
            'start': scrollBoxLeftHorizontalAlignmentFunc,
            'end': scrollBoxRightHorizontalAlignmentFunc,
            'flex-start': scrollBoxLeftHorizontalAlignmentFunc,
            'flex-end': scrollBoxRightHorizontalAlignmentFunc,
        }

        const scrollBoxAlignSelfActionMap = {
            'stretch': scrollBoxStretchVerticalAlignmentFunc,
            'top': scrollBoxTopVerticalAlignmentFunc,
            'bottom': scrollBoxBottomVerticalAlignmentFunc,
            'center': scrollBoxCenterVerticalAlignmentFunc,
            'start': scrollBoxTopVerticalAlignmentFunc,
            'end': scrollBoxBottomVerticalAlignmentFunc,
            'flex-start': scrollBoxTopVerticalAlignmentFunc,
            'flex-end': scrollBoxBottomVerticalAlignmentFunc,
        }

        if (this.containerType === UMGContainerType.HorizontalBox) {
            const horizontalBoxSlot = Slot as UE.HorizontalBoxSlot;

            if (justifyContent == 'space-between') {
                hSpaceBetweenSetAlginFunc(horizontalBoxSlot);
            }

            const hJustifySelfValue = justifySelf?.split(' ').find(v => hJustifySelfActionMap[v]);
            if (hJustifySelfValue) {
                hJustifySelfActionMap[hJustifySelfValue](horizontalBoxSlot);
            }

            const hAlignSelfValue = alignSelf?.split(' ').find(v => hAlignSelfActionMap[v]);
            if (hAlignSelfValue) {
                hAlignSelfActionMap[hAlignSelfValue](horizontalBoxSlot);
            }
        } else if (this.containerType === UMGContainerType.VerticalBox) {
            const verticalBoxSlot = Slot as UE.VerticalBoxSlot;

            if (justifyContent == 'space-between') {
                vSpaceBetweenSetAlginFunc(verticalBoxSlot);
            }

            const vJustifySelfValue = justifySelf?.split(' ').find(v => vJustifySelfActionMap[v]);
            if (vJustifySelfValue) {
                vJustifySelfActionMap[vJustifySelfValue](verticalBoxSlot);
            }

            const vAlignSelfValue = alignSelf?.split(' ').find(v => vAlignSelfActionMap[v]);
            if (vAlignSelfValue) {
                vAlignSelfActionMap[vAlignSelfValue](verticalBoxSlot);
            }
        } else if (this.containerType === UMGContainerType.ScrollBox) {
            const scrollBoxSlot = Slot as UE.ScrollBoxSlot;

            const scrollBoxJustifySelfValue = justifySelf?.split(' ').find(v => scrollBoxJustifySelfActionMap[v]);
            if (scrollBoxJustifySelfValue) {
                scrollBoxJustifySelfActionMap[scrollBoxJustifySelfValue](scrollBoxSlot);
            }

            const scrollBoxAlignSelfValue = alignSelf?.split(' ').find(v => scrollBoxAlignSelfActionMap[v]);
            if (scrollBoxAlignSelfValue) {
                scrollBoxAlignSelfActionMap[scrollBoxAlignSelfValue](scrollBoxSlot);
            }
        }
    }

    private expandPaddingValues(paddingValues: number[]): number[] {
        if (paddingValues.length === 2) {
            return [paddingValues[0], paddingValues[1], paddingValues[0], paddingValues[1]];
        } else if (paddingValues.length === 1) {
            return [paddingValues[0], paddingValues[0], paddingValues[0], paddingValues[0]];
        } else if (paddingValues.length === 3) {
            // padding: top right bottom
            return [paddingValues[0], paddingValues[1], paddingValues[2], paddingValues[1]];
        }

        return paddingValues;
    }

    private convertMargin(margin: string): UE.Margin {
        if (!margin) {
            return new UE.Margin(0, 0, 0, 0);
        }

        const marginValues = margin.split(' ').map(v => {
            // todo@Caleb196x: 处理margin的单位
            v = v.trim();
            return this.convertPixelToSU(v);
        });

        let expandedMarginValues = this.expandPaddingValues(marginValues);

        // React Padding: top right bottom left
        // UMG Padding: Left, Top, Right, Bottom
        return new UE.Margin(expandedMarginValues[3], expandedMarginValues[0], expandedMarginValues[1], expandedMarginValues[2]);
    }

    private convertGap(gap: string) {
        if (!gap) {
            return new UE.Vector2D(0, 0);
        }
        const gapValues = gap.split(' ').map(v => {
            // todo@Caleb196x: 处理react的单位
            v = v.trim();
            return this.convertPixelToSU(v);
        });

        if (gapValues.length === 2) {
            // gap: row column
            // innerSlotPadding: x(column) y(row)
            return new UE.Vector2D(gapValues[1], gapValues[0]);
        }

        return new UE.Vector2D(gapValues[0], gapValues[0]);
    }

    private initSlot(Slot: UE.PanelSlot, childProps: any) {
        this.setupAlignment(Slot, childProps);
        let gapPadding = this.convertGap(this.containerStyle?.gap);
        // todo@Caleb196x: 只有父元素为border，SizeBox, ScaleBox, BackgroundBlur这些只能容纳一个子元素的容器时，padding才有意义，
        // 对于容器来说，读取margin值
        let margin = this.convertMargin(childProps.style?.margin); 
        margin.Left += gapPadding.X;
        margin.Right += gapPadding.X;
        margin.Top += gapPadding.Y;
        margin.Bottom += gapPadding.Y;

        (Slot as any).SetPadding(margin);
    }

    private initWrapBoxSlot(wrapBox: UE.WrapBox, Slot: UE.WrapBoxSlot, childProps: any) {
        const gap = this.containerStyle?.gap;
        wrapBox.SetInnerSlotPadding(this.convertGap(gap));

        const justifyContentActionMap = {
            'flex-start': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Left,
            'flex-end': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Right,
            'center': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Center,
            'stretch': () => wrapBox.HorizontalAlignment = UE.EHorizontalAlignment.HAlign_Fill
        }

        // WrapBox中定义的justifyContent决定了子元素的对齐方式
        const justifyContent = this.containerStyle?.justifyContent;
        if (justifyContent) {
            justifyContent.split(' ')
                .filter(value => justifyContentActionMap[value])
                .forEach(value => justifyContentActionMap[value]());
        }

        const margin = this.containerStyle?.margin;
        Slot.SetPadding(this.convertMargin(margin));
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
        Slot.SetPadding(this.convertMargin(margin));
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        const backgroundImage = this.containerStyle?.backgroundImage;
        const backgroundColor = this.containerStyle?.backgroundColor;
        if (backgroundImage || backgroundColor) {
            let border = new UE.Border();
            // todo@Caleb196x: 加载图片
            border.SetBrush(backgroundImage);
            border.AddChild(childItem);
            childItem = border;
        }

        const addChildActionMap = {
            [UMGContainerType.HorizontalBox]: (horizontalBox: UE.HorizontalBox, childItem: UE.Widget) => {
                let horizontalBoxSlot = horizontalBox.AddChildToHorizontalBox(childItem);
                this.initSlot(horizontalBoxSlot, childProps);
            },
            [UMGContainerType.VerticalBox]: (verticalBox: UE.VerticalBox, childItem: UE.Widget) => {
                let verticalBoxSlot = verticalBox.AddChildToVerticalBox(childItem);
                this.initSlot(verticalBoxSlot, childProps);
            },
            [UMGContainerType.WrapBox]: (wrapBox: UE.WrapBox, childItem: UE.Widget) => {
                let wrapBoxSlot = wrapBox.AddChildToWrapBox(childItem);
                this.initWrapBoxSlot(wrapBox, wrapBoxSlot, childProps);
            },
            [UMGContainerType.GridPanel]: (gridPanel: UE.GridPanel, childItem: UE.Widget) => {
                let gridSlot = gridPanel.AddChildToGrid(childItem);
                this.initGridPanelSlot(gridPanel, gridSlot, childProps);
            },
            [UMGContainerType.ScrollBox]: (scrollBox: UE.ScrollBox, childItem: UE.Widget) => {
                let scrollBoxSlot = scrollBox.AddChild(childItem);
                this.initSlot(scrollBoxSlot, childProps);
            }
        };

        if (this.containerType in addChildActionMap) {
            addChildActionMap[this.containerType](parentItem as any, childItem);
        }
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        return;
    }

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function) : Function {
        return undefined;
    }
}