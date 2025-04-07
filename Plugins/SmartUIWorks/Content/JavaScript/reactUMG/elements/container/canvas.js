"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasWrapper = void 0;
const common_wrapper_1 = require("../common_wrapper");
const UE = require("ue");
const common_utils_1 = require("../common_utils");
class CanvasWrapper extends common_wrapper_1.ComponentWrapper {
    predefinedAnchors;
    containerStyle;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
        this.predefinedAnchors = {
            // 预设16种锚点
            'top left': { min_x: 0, min_y: 0, max_x: 0, max_y: 0 },
            'top center': { min_x: 0.5, min_y: 0, max_x: 0.5, max_y: 0 },
            'top right': { min_x: 1, min_y: 0, max_x: 1, max_y: 0 },
            'center left': { min_x: 0, min_y: 0.5, max_x: 0, max_y: 0.5 },
            'center center': { min_x: 0.5, min_y: 0.5, max_x: 0.5, max_y: 0.5 },
            'center right': { min_x: 1, min_y: 0.5, max_x: 1, max_y: 0.5 },
            'bottom left': { min_x: 0, min_y: 1, max_x: 0, max_y: 1 },
            'bottom center': { min_x: 0.5, min_y: 1, max_x: 0.5, max_y: 1 },
            'bottom right': { min_x: 1, min_y: 1, max_x: 1, max_y: 1 },
            'top fill': { min_x: 0, min_y: 0, max_x: 1, max_y: 0 },
            'center fill': { min_x: 0, min_y: 0.5, max_x: 1, max_y: 0.5 },
            'bottom fill': { min_x: 0, min_y: 1, max_x: 1, max_y: 1 },
            'top span-all': { min_x: 0, min_y: 0, max_x: 1, max_y: 0 },
            'center span-all': { min_x: 0, min_y: 0.5, max_x: 1, max_y: 0.5 },
            'bottom span-all': { min_x: 0, min_y: 1, max_x: 1, max_y: 1 },
            'span-all left': { min_x: 0, min_y: 0, max_x: 0, max_y: 1 },
            'span-all center': { min_x: 0.5, min_y: 0, max_x: 0.5, max_y: 1 },
            'span-all right': { min_x: 1, min_y: 0, max_x: 1, max_y: 1 },
            'fill left': { min_x: 0, min_y: 0, max_x: 0, max_y: 1 },
            'fill center': { min_x: 0.5, min_y: 0, max_x: 0.5, max_y: 1 },
            'fill right': { min_x: 1, min_y: 0, max_x: 1, max_y: 1 },
            'fill': { min_x: 0, min_y: 0, max_x: 1, max_y: 1 },
            'span-all': { min_x: 0, min_y: 0, max_x: 1, max_y: 1 },
            // todo@Caleb196x: 添加更多CSS描述
        };
    }
    convertToWidget() {
        this.containerStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(this.props);
        // todo@Caleb196x: 添加size, scale, background等属性的解析
        return new UE.CanvasPanel();
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return true;
    }
    appendChildItem(parentItem, childItem, childItemTypeName, childProps) {
        let canvasPanel = parentItem;
        const canvasSlot = canvasPanel.AddChildToCanvas(childItem);
        const mergedStyle = (0, common_utils_1.mergeClassStyleAndInlineStyle)(childProps);
        const positionAnchor = mergedStyle?.positionAnchor;
        const offsetAnchor = mergedStyle?.offsetAnchor;
        const width = mergedStyle?.width || 'none';
        const height = mergedStyle?.height || 'none';
        const scale = mergedStyle?.scale || 1.0;
        const aspectRatio = mergedStyle?.aspectRatio || 'auto';
        let positionAnchors = null;
        if (positionAnchor) {
            positionAnchors = this.predefinedAnchors[positionAnchor];
        }
        else if (offsetAnchor) {
            positionAnchors = this.predefinedAnchors[offsetAnchor];
        }
        if (positionAnchors) {
            canvasSlot.SetAnchors(new UE.Anchors(new UE.Vector2D(positionAnchors.min_x, positionAnchors.min_y), new UE.Vector2D(positionAnchors.max_x, positionAnchors.max_y)));
        }
        else {
            canvasSlot.SetAnchors(new UE.Anchors(new UE.Vector2D(0, 0), new UE.Vector2D(0, 0)));
        }
        // loction
        const top = mergedStyle?.top || '0px';
        const left = mergedStyle?.left || '0px';
        const right = mergedStyle?.right || '0px';
        const bottom = mergedStyle?.bottom || '0px';
        const topSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(top, this.containerStyle);
        const leftSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(left, this.containerStyle);
        if (!(positionAnchor?.includes('fill')) || !(positionAnchor?.includes('span-all'))) {
            canvasSlot.SetPosition(new UE.Vector2D(leftSU, topSU));
        }
        else {
            const rightSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(right, this.containerStyle);
            const bottomSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(bottom, this.containerStyle);
            canvasSlot.SetOffsets(new UE.Margin(leftSU, topSU, rightSU, bottomSU));
        }
        if (width !== 'none' && height !== 'none') {
            const widthSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(width, this.containerStyle);
            const heightSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(height, this.containerStyle);
            canvasSlot.SetSize(new UE.Vector2D(widthSU * scale, heightSU * scale));
        }
        else if (width !== 'none' && height === 'none') {
            const widthSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(width, this.containerStyle);
            if (aspectRatio !== 'auto') {
                const desiredHeight = widthSU / (0, common_utils_1.parseAspectRatio)(aspectRatio);
                canvasSlot.SetSize(new UE.Vector2D(widthSU * scale, desiredHeight * scale));
            }
            else {
                canvasSlot.SetSize(new UE.Vector2D(widthSU * scale, widthSU * scale));
            }
        }
        else if (height !== 'none' && width === 'none') {
            const heightSU = (0, common_utils_1.convertLengthUnitToSlateUnit)(height, this.containerStyle);
            if (aspectRatio !== 'auto') {
                const desiredWidth = heightSU * (0, common_utils_1.parseAspectRatio)(aspectRatio);
                canvasSlot.SetSize(new UE.Vector2D(desiredWidth * scale, heightSU * scale));
            }
            else {
                canvasSlot.SetSize(new UE.Vector2D(heightSU * scale, heightSU * scale));
            }
        }
        else {
            canvasSlot.SetAutoSize(true);
        }
        return;
    }
}
exports.CanvasWrapper = CanvasWrapper;
//# sourceMappingURL=canvas.js.map