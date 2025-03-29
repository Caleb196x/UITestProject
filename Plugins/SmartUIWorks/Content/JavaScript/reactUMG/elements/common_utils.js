"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLengthUnitToSlateUnit = convertLengthUnitToSlateUnit;
exports.mergeClassStyleAndInlineStyle = mergeClassStyleAndInlineStyle;
exports.expandPaddingValues = expandPaddingValues;
exports.convertMargin = convertMargin;
exports.convertGap = convertGap;
exports.parseAspectRatio = parseAspectRatio;
exports.parseScale = parseScale;
exports.loadTextureFromImagePath = loadTextureFromImagePath;
exports.parseColor = parseColor;
exports.parseBackgroundImage = parseBackgroundImage;
exports.parseBackgroundColor = parseBackgroundColor;
exports.parseBackgroundPosition = parseBackgroundPosition;
exports.parseBackgroundProps = parseBackgroundProps;
const css_converter_1 = require("../css_converter");
const UE = require("ue");
/**
 * Converts CSS length values to SU (Slate Units) for Unreal Engine UMG
 * Supported units: px, %, em, rem (relative to parent font size)
 * @param length - CSS length string to convert (e.g., "16px", "2em")
 * @param style - React style object containing font size reference
 * @returns Converted value in SU units
 */
function convertLengthUnitToSlateUnit(length, style) {
    // get font size of parent
    let fontSize = style?.fontSize || '16px';
    if (!fontSize.endsWith('px')) {
        fontSize = '16px';
    }
    const numSize = parseInt(fontSize.replace('px', ''));
    if (length.endsWith('px')) {
        const match = length.match(/([+-]?\d+)px/);
        if (match) {
            return parseInt(match[1]);
        }
    }
    else if (length.endsWith('%')) {
        // todo@Caleb196x: 需要获取父元素的值
    }
    else if (length.endsWith('em')) {
        const match = length.match(/(\d+)em/);
        if (match) {
            return parseInt(match[1]) * numSize;
        }
    }
    else if (length.endsWith('rem')) {
        const match = length.match(/(\d+)rem/);
        if (match) {
            return parseInt(match[1]) * numSize;
        }
    }
    return 0;
}
function mergeClassStyleAndInlineStyle(props) {
    let classNameStyles = {};
    if (props.className) {
        // Split multiple classes
        const classNames = props.className.split(' ');
        for (const className of classNames) {
            // Get styles associated with this class name
            const classStyle = (0, css_converter_1.convertCssToStyles)(getCssStyleForClass(className));
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
function expandPaddingValues(paddingValues) {
    if (paddingValues.length === 2) {
        return [paddingValues[0], paddingValues[1], paddingValues[0], paddingValues[1]];
    }
    else if (paddingValues.length === 1) {
        return [paddingValues[0], paddingValues[0], paddingValues[0], paddingValues[0]];
    }
    else if (paddingValues.length === 3) {
        // padding: top right bottom
        return [paddingValues[0], paddingValues[1], paddingValues[2], paddingValues[1]];
    }
    return paddingValues;
}
function convertMargin(margin, style) {
    if (!margin) {
        return new UE.Margin(0, 0, 0, 0);
    }
    const marginValues = margin.split(' ').map(v => {
        // todo@Caleb196x: 处理margin的单位
        v = v.trim();
        return convertLengthUnitToSlateUnit(v, style);
    });
    let expandedMarginValues = expandPaddingValues(marginValues);
    // React Padding: top right bottom left
    // UMG Padding: Left, Top, Right, Bottom
    return new UE.Margin(expandedMarginValues[3], expandedMarginValues[0], expandedMarginValues[1], expandedMarginValues[2]);
}
function convertGap(gap, style) {
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
/**
 * Parses a string representing an aspect ratio and returns a number
 * @param aspectRatio - String representing aspect ratio (e.g., "16/9", "0.5", "1/1")
 * @returns Number representing aspect ratio (e.g., 1.7777777777777777)
 */
function parseAspectRatio(aspectRatio) {
    if (!aspectRatio) {
        return 1.0;
    }
    // Handle decimal format like '0.5'
    if (!isNaN(Number(aspectRatio))) {
        return Number(aspectRatio);
    }
    // Handle ratio format like '16/9' or '1/1'
    const parts = aspectRatio.split('/');
    if (parts.length === 2) {
        const numerator = Number(parts[0]);
        const denominator = Number(parts[1]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator;
        }
    }
    return 1.0;
}
function parseScale(scale) {
    if (!scale || scale === 'none') {
        return new UE.Vector2D(1, 1);
    }
    const scaleValues = scale.split(' ').map(Number);
    if (scaleValues.length === 1) {
        return new UE.Vector2D(scaleValues[0], scaleValues[0]);
    }
    else if (scaleValues.length === 2) {
        return new UE.Vector2D(scaleValues[0], scaleValues[1]);
    }
    return new UE.Vector2D(1, 1);
}
function loadTextureFromImagePath(imagePath) {
    return new UE.Texture2D();
}
function parseColor(color) {
    return new UE.Vector4d(0, 0, 0, 0);
}
function parseBackgroundImage(backgroundImage) {
    let brush = new UE.SlateBrush();
    if (typeof backgroundImage !== 'string') {
        brush.ResourceObject = backgroundImage;
        return brush;
    }
    let imagePath = backgroundImage;
    // Handle template literal with imported texture
    const templateMatch = backgroundImage.match(/`url\(\${(.*?)}\)`/);
    if (templateMatch && templateMatch[1]) {
        const textureName = templateMatch[1].trim();
        // The texture is already imported and passed directly
        // brush.ResourceObject = backgroundImage;
        return brush;
    }
    // Handle url() format if present
    const urlMatch = backgroundImage.match(/url\((.*?)\)/);
    if (urlMatch && urlMatch[1]) {
        imagePath = urlMatch[1].trim();
        // Remove quotes if present
        imagePath = imagePath.replace(/['"]/g, '');
    }
    // If not url() format, use the path directly
    else {
        imagePath = backgroundImage.trim();
        imagePath = imagePath.replace(/['"]/g, ''); // Still remove quotes if any
    }
    // Basic path validation
    if (!imagePath || imagePath.length === 0) {
        return null;
    }
    // Check for invalid characters in path
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(imagePath)) {
        console.warn(`Invalid characters in image path: ${imagePath}`);
        return null;
    }
    // Check file extension
    const validExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.tga'];
    const hasValidExtension = validExtensions.some(ext => imagePath.toLowerCase().endsWith(ext));
    if (!hasValidExtension) {
        console.warn(`Invalid image file extension: ${imagePath}`);
        return null;
    }
    // Check if file exists
    const texture = loadTextureFromImagePath(imagePath);
    if (!texture) {
        console.warn(`Failed to load texture from image path: ${imagePath}`);
    }
    brush.ResourceObject = texture;
    return brush;
}
function parseBackgroundColor(backgroundColor) {
}
function parseBackgroundPosition(backgroundPosition) {
}
function parseBackgroundProps(props) {
    // image转换成brush image
    // repeat转换成image中的tiling模式
    // position转换成alignment和padding
}
//# sourceMappingURL=common_utils.js.map