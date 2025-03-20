"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBarWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class ProgressBarWrapper extends common_wrapper_1.ComponentWrapper {
    defaultProps = {
        value: 0.0,
        max: 100.0
    };
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = { ...this.defaultProps, ...props };
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
    convertToWidget() {
        const progressBar = new UE.ProgressBar();
        const { value, max } = this.props;
        this.updateProgressBar(progressBar, value, max);
        this.parseStyleToWidget(progressBar);
        this.commonPropertyInitialized(progressBar);
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
            this.parseStyleToWidget(progressBar);
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