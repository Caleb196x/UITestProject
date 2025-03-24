import * as UE from 'ue';
import { ComponentWrapper } from './common_wrapper';

export class ProgressBarWrapper extends ComponentWrapper {
    private readonly defaultProps = {
        value: 0.0,
        max: 100.0
    };

    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = {...this.defaultProps, ...props};
    }

    private calculatePercent(value: number, max: number): number {
        // Ensure max is not 0 to avoid division by zero
        max = max || this.defaultProps.max;
        // Clamp value between 0 and max
        value = Math.max(0, Math.min(value, max));
        return value / max;
    }

    private updateProgressBar(progressBar: UE.ProgressBar, value: number, max: number) {
        const percent = this.calculatePercent(value, max);
        progressBar.SetPercent(percent);
    }

    override convertToWidget(): UE.Widget {
        const progressBar = new UE.ProgressBar();
        const { value, max } = this.props;
        
        this.updateProgressBar(progressBar, value, max);
        this.parseStyleToWidget(progressBar);
        this.commonPropertyInitialized(progressBar);
        
        return progressBar;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        const progressBar = widget as UE.ProgressBar;
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

    override convertReactEventToWidgetEvent(reactProp: string, originCallback: Function): Function {
        return undefined;
    }
}