"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBarWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
const brush_parser_1 = require("./parser/brush_parser");
const color_parser_1 = require("./parser/color_parser");
const common_utils_1 = require("./common_utils");
class ProgressBarWrapper extends common_wrapper_1.ComponentWrapper {
    defaultProps = {
        value: 0.0,
        max: 100.0
    };
    usingNativeProgressBar = false;
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = { ...this.defaultProps, ...props };
        this.usingNativeProgressBar = this.typeName === 'ProgressBar';
    }
    calculatePercent(value, max) {
        // Ensure max is not 0 to avoid division by zero
        max = max || this.defaultProps.max;
        // Clamp value between 0 and max
        value = Math.max(0, Math.min(value, max));
        return value / max;
    }
    updateProgressBar(progressBar, value, max) {
        const percent = this.calculatePercent(value, max);
        progressBar.SetPercent(percent);
    }
    initReactProgressBar(progressBar) {
        if (!progressBar) {
            return;
        }
        const { value, max } = this.props;
        this.updateProgressBar(progressBar, value, max);
        const style = this.props?.style;
        if (style) {
            const parsedBackground = (0, common_utils_1.parseBackgroundProps)(style);
            if (parsedBackground?.image) {
                progressBar.WidgetStyle.BackgroundImage = parsedBackground.image;
            }
            if (parsedBackground?.color) {
                progressBar.FillColorAndOpacity = parsedBackground.color;
            }
        }
    }
    initNativeProgressBar(progressBar) {
        if (!progressBar) {
            return;
        }
        const backgroundImageMap = {
            'background': 'BackgroundImage',
            'fillBackground': 'FillImage',
            'marqueeBackground': 'MarqueeImage',
        };
        for (const [key, value] of Object.entries(this.props)) {
            if (backgroundImageMap[key]) {
                progressBar.WidgetStyle[backgroundImageMap[key]] = (0, brush_parser_1.parseBrush)(value);
            }
            else if (key === 'enableFillAnimation') {
                progressBar.WidgetStyle.EnableFillAnimation = value;
            }
            else if (key === 'fillColor') {
                const color = (0, color_parser_1.parseColor)(value);
                progressBar.FillColorAndOpacity.R = color.r;
                progressBar.FillColorAndOpacity.G = color.g;
                progressBar.FillColorAndOpacity.B = color.b;
                progressBar.FillColorAndOpacity.A = color.a;
            }
            else if (key === 'barType') {
                switch (value) {
                    case 'left-to-right':
                        progressBar.BarFillType = UE.EProgressBarFillType.LeftToRight;
                        break;
                    case 'right-to-left':
                        progressBar.BarFillType = UE.EProgressBarFillType.RightToLeft;
                        break;
                    case 'top-to-bottom':
                        progressBar.BarFillType = UE.EProgressBarFillType.TopToBottom;
                        break;
                    case 'bottom-to-top':
                        progressBar.BarFillType = UE.EProgressBarFillType.BottomToTop;
                        break;
                    case 'fill-from-center':
                        progressBar.BarFillType = UE.EProgressBarFillType.FillFromCenter;
                        break;
                    case 'fill-from-center-x':
                        progressBar.BarFillType = UE.EProgressBarFillType.FillFromCenterHorizontal;
                        break;
                    case 'fill-from-center-y':
                        progressBar.BarFillType = UE.EProgressBarFillType.FillFromCenterVertical;
                        break;
                    default:
                        progressBar.BarFillType = UE.EProgressBarFillType.LeftToRight;
                        break;
                }
            }
            else if (key === 'precentBinding' && typeof value === 'function') {
                progressBar.PercentDelegate.Bind(value);
            }
            else if (key === 'fillColorBinding' && typeof value === 'function') {
                progressBar.FillColorAndOpacityDelegate.Bind(() => {
                    const color = (0, color_parser_1.parseColor)(value());
                    const linearColor = new UE.LinearColor();
                    linearColor.R = color.r;
                    linearColor.G = color.g;
                    linearColor.B = color.b;
                    linearColor.A = color.a;
                    return linearColor;
                });
            }
            else if (key === 'precent') {
                progressBar.SetPercent(value);
            }
            else if (key === 'isMarquee') {
                progressBar.SetIsMarquee(value);
            }
        }
    }
    convertToWidget() {
        const progressBar = new UE.ProgressBar();
        this.commonPropertyInitialized(progressBar);
        if (this.usingNativeProgressBar) {
            this.initNativeProgressBar(progressBar);
        }
        else {
            this.initReactProgressBar(progressBar);
        }
        UE.UMGManager.SynchronizeWidgetProperties(progressBar);
        return progressBar;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const progressBar = widget;
        let hasChanged = false;
        // Check if value or max have changed
        if (oldProps.value !== newProps.value || oldProps.max !== newProps.max) {
            this.updateProgressBar(progressBar, newProps.value, newProps.max);
            hasChanged = true;
        }
        // Update common properties if needed
        if (hasChanged) {
            this.commonPropertyInitialized(progressBar);
        }
        return hasChanged;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.ProgressBarWrapper = ProgressBarWrapper;
//# sourceMappingURL=progress_bar.js.map