import { convertCssToStyles } from '../css_converter';
import * as UE from 'ue';
/**
 * Converts CSS length values to SU (Slate Units) for Unreal Engine UMG
 * Supported units: px, %, em, rem (relative to parent font size)
 * @param length - CSS length string to convert (e.g., "16px", "2em")
 * @param style - React style object containing font size reference
 * @returns Converted value in SU units
 */
export function convertLengthUnitToSlateUnit(length: string, style: any): number {
        // get font size of parent
        let fontSize = style?.fontSize || '16px';
        if (!fontSize.endsWith('px')) {
            fontSize = '16px';
        }

        const numSize = parseInt(fontSize.replace('px', '')); 
        if (length.endsWith('px')) {
            const match = length.match(/(\d+)px/);
            if (match) {
                return parseInt(match[1]);
            }
        } else if (length.endsWith('%')) {
            // todo@Caleb196x: 需要获取父元素的值
        } else if (length.endsWith('em')) {
            const match = length.match(/(\d+)em/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        } else if (length.endsWith('rem')) {
            const match = length.match(/(\d+)rem/);
            if (match) {
                return parseInt(match[1]) * numSize;
            }
        }

        return 0; 
}

export function mergeClassStyleAndInlineStyle(props: any) {
    let classNameStyles = {};
    if (props.className) {
        // Split multiple classes
        const classNames = props.className.split(' ');
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
    const mergedStyle = { ...classNameStyles, ...(props.style || {}) };
    return mergedStyle;
}

/**
 * Expands padding values into umg padding values from css padding values
 * @param paddingValues 
 * @returns umg padding values
 */
export function expandPaddingValues(paddingValues: number[]): number[] {
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

export function convertMargin(margin: string, style: any): UE.Margin {
    if (!margin) {
        return new UE.Margin(0, 0, 0, 0);
    }

    const marginValues = margin.split(' ').map(v => {
        // todo@Caleb196x: 处理margin的单位
        v = v.trim();
        return convertLengthUnitToSlateUnit(v, style);
    });

    let expandedMarginValues = this.expandPaddingValues(marginValues);

    // React Padding: top right bottom left
    // UMG Padding: Left, Top, Right, Bottom
    return new UE.Margin(expandedMarginValues[3], expandedMarginValues[0], expandedMarginValues[1], expandedMarginValues[2]);
}

export function convertGap(gap: string, style: any): UE.Vector2D {
    if (!gap) {
        return new UE.Vector2D(0, 0);
    }
    const gapValues = gap.split(' ').map(v => {
        // todo@Caleb196x: 处理react的单位
        v = v.trim();
        return convertLengthUnitToSlateUnit(v, style);
    });

    if (gapValues.length === 2) {
        // gap: row column
        // innerSlotPadding: x(column) y(row)
        return new UE.Vector2D(gapValues[1], gapValues[0]);
    }

    return new UE.Vector2D(gapValues[0], gapValues[0]);
}