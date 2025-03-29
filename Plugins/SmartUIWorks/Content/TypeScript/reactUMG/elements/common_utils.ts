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
            const match = length.match(/([+-]?\d+)px/);
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

    let expandedMarginValues = expandPaddingValues(marginValues);

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

/**
 * Parses a string representing an aspect ratio and returns a number
 * @param aspectRatio - String representing aspect ratio (e.g., "16/9", "0.5", "1/1")
 * @returns Number representing aspect ratio (e.g., 1.7777777777777777)
 */
export function parseAspectRatio(aspectRatio: string) {
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

export function parseScale(scale: string) : UE.Vector2D {
    if (!scale || scale === 'none') {
        return new UE.Vector2D(1, 1);
    }

    const scaleValues = scale.split(' ').map(Number);
    if (scaleValues.length === 1) {
        return new UE.Vector2D(scaleValues[0], scaleValues[0]);
    } else if (scaleValues.length === 2) {
        return new UE.Vector2D(scaleValues[0], scaleValues[1]);
    }

    return new UE.Vector2D(1, 1);
}

export function loadTextureFromImagePath(imagePath: string) : UE.Texture2D | undefined {
    // todo@Caleb196x: 定制化导入函数，传入参数为相对于Content/JavaScript的绝对路径名，提高导入性能
    const texture = UE.KismetRenderingLibrary.ImportFileAsTexture2D(null, imagePath);
    if (texture) {
        return texture;
    } else {
        console.warn(`Failed to load texture from image path: ${imagePath}`);
    }
    return undefined;
}

export function parseBackgroundImage(backgroundImage: string) : UE.SlateBrush | undefined {
    let brush = new UE.SlateBrush();
    if (typeof backgroundImage !== 'string') {
        brush.ResourceObject = backgroundImage as UE.Texture2D;
        return brush;
    }

    let imagePath = backgroundImage;

    // Handle template literal with imported texture
    const templateMatch = backgroundImage.match(/`url\(\${(.*?)}\)`/);
    if (templateMatch && templateMatch[1]) {
        const textureName = templateMatch[1].trim();
        imagePath = textureName;
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
    const hasValidExtension = validExtensions.some(ext => 
        imagePath.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
        console.warn(`Invalid image file extension: ${imagePath}`);
        return null;
    }

    // Check if file exists
    const texture = loadTextureFromImagePath(imagePath);
    if (!texture) {
        console.warn(`Failed to load texture from image path: ${imagePath}`);
    } else {
        brush.ResourceObject = texture;
    }

    return brush;
}

export function parseBackgroundColor(backgroundColor: string) : UE.LinearColor {
    const color = parseColor(backgroundColor);
    return new UE.LinearColor(color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a);
}

export function parseBackgroundPosition(backgroundPosition: string) : any {

}

function parseBackgroundRepeat(backgroundRepeat: string) : any {

}

function parseBackgroundName(background: string) : any {

}

export function parseBackgroundProps(props: any): any {
    // image转换成brush image
    // repeat转换成image中的tiling模式
    // position转换成alignment和padding
}

type RGBA = { r: number; g: number; b: number; a: number };

// 预定义颜色名称到 RGBA 的映射表（部分示例）
const namedColors: Record<string, RGBA> = {
  red: { r: 255, g: 0, b: 0, a: 1 },
  green: { r: 0, g: 128, b: 0, a: 1 },
  blue: { r: 0, g: 0, b: 255, a: 1 },
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  // 可扩展更多预定义颜色...
};

/**
 * 将 CSS 颜色值转换为标准化 RGBA 对象
 * @param color 支持所有 CSS 颜色格式的字符串
 * @returns 标准化 RGBA 对象
 */
export function parseColor(color: string): RGBA {
  const trimmed = color.trim().toLowerCase();

  // 1. 处理预定义颜色名称
  if (namedColors[trimmed]) {
    return { ...namedColors[trimmed] };
  }

  // 2. 处理十六进制格式 (#RGB, #RRGGBB, #RRGGBBAA)
  if (trimmed.startsWith('#')) {
    return parseHex(trimmed);
  }

  // 3. 处理 rgb/rgba 格式
  if (trimmed.startsWith('rgb')) {
    return parseRGBFunction(trimmed);
  }

  // 4. 处理 hsl/hsla 格式
  if (trimmed.startsWith('hsl')) {
    return parseHSLFunction(trimmed);
  }

  // 5. 处理特殊值
  if (trimmed === 'currentcolor') {
    throw new Error('currentColor cannot be converted to static RGBA');
  }

  throw new Error(`Invalid color format: ${color}`);
}

// 解析十六进制颜色 (#rgb, #rrggbb, #rrggbbaa)
function parseHex(hex: string): RGBA {
  const hexClean = hex.replace(/^#/, '');
  
  // 扩展简写格式
  const expanded = hexClean.length === 3 || hexClean.length === 4
    ? hexClean.split('').map(c => c + c).join('')
    : hexClean;

  const parseChannel = (start: number, end: number) => 
    parseInt(expanded.slice(start, end), 16) || 0;

  return {
    r: parseChannel(0, 2),
    g: parseChannel(2, 4),
    b: parseChannel(4, 6),
    a: expanded.length >= 8 
      ? parseChannel(6, 8) / 255 
      : 1
  };
}

// 解析 rgb/rgba 函数
function parseRGBFunction(rgbStr: string): RGBA {
  const match = rgbStr.match(/rgba?\(([^)]+)\)/);
  if (!match) throw new Error('Invalid RGB format');

  const components = match[1].split(/[,/]\s*/).map(parseComponent);
  
  return {
    r: parseRGBComponent(components[0]),
    g: parseRGBComponent(components[1]),
    b: parseRGBComponent(components[2]),
    a: components[3] !== undefined ? clampAlpha(components[3]) : 1
  };
}

// 解析 HSL/HSLA 函数
function parseHSLFunction(hslStr: string): RGBA {
  const match = hslStr.match(/hsla?\(([^)]+)\)/);
  if (!match) throw new Error('Invalid HSL format');

  const components = match[1].split(/[,/]\s*/).map(parseComponent);
  const [h, s, l, a = 1] = components;
  
  const rgb = hslToRgb(
    clampHue(h),
    clampPercentage(s),
    clampPercentage(l)
  );
  
  return {
    r: Math.round(rgb[0] * 255),
    g: Math.round(rgb[1] * 255),
    b: Math.round(rgb[2] * 255),
    a: clampAlpha(a)
  };
}

// HSL 到 RGB 的转换算法
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;
  
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [
    (r + m),
    (g + m),
    (b + m)
  ];
}

// 辅助函数
const parseComponent = (s: string) => parseFloat(s.replace('%', ''));
const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));
const clampHue = (h: number) => ((h % 360) + 360) % 360;
const clampPercentage = (n: number) => clamp(n / 100, 0, 1);
const clampAlpha = (a: number) => clamp(a, 0, 1);

const parseRGBComponent = (value: number) => {
  return value > 1 && value <= 100  // 百分比格式
    ? Math.round((value / 100) * 255)
    : clamp(value, 0, 255);
};

// 使用示例
console.log(parseColor('#f00'));             // { r: 255, g: 0, b: 0, a: 1 }
console.log(parseColor('rgba(255, 50%, 0, 0.5)')); // { r: 255, g: 128, b: 0, a: 0.5 }
console.log(parseColor('hsl(180, 50%, 50%)')); // { r: 64, g: 191, b: 191, a: 1 }
console.log(parseColor('transparent'));       // { r: 0, g: 0, b: 0, a: 0 }