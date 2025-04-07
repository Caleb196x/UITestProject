import * as UE from 'ue';
import { ComponentWrapper } from './common_wrapper';
import { parseColor } from './parser/color_parser';

export class SpineWrapper extends ComponentWrapper {
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
    }

    override convertToWidget(): UE.Widget {
        const spine = new UE.SpineWidget();
        this.commonPropertyInitialized(spine);

        const initSkin = this.props?.initSkin as string;
        if (initSkin && initSkin !== '') {
            spine.SetSkin(initSkin);
        }

        const color = this.props?.color;
        if (color) {
            const rgba = parseColor(color);
            spine.Color.R = rgba.r;
            spine.Color.G = rgba.g;
            spine.Color.B = rgba.b;
            spine.Color.A = rgba.a;
        }

        let atlasLoaded = false;
        const atlas = this.props?.atlas;
        if (atlas) {
            spine.Atlas = UE.UMGManager.LoadSpineAtlas(spine, atlas);
            atlasLoaded = true;
        }

        const skel = this.props?.skel;
        if (skel) {
            spine.SkeletonData = UE.UMGManager.LoadSpineSkeleton(spine, skel);
            if (!atlasLoaded) {
                const atlasPath = skel.replace('.json', '.atlas').replace('.skel', '.atlas');
                spine.Atlas = UE.UMGManager.LoadSpineAtlas(spine, atlasPath);
                atlasLoaded = true;
            }
        }

        const onBeforeUpdateWorldTransform = this.props?.onBeforeUpdateWorldTransform;
        if (onBeforeUpdateWorldTransform && typeof onBeforeUpdateWorldTransform === 'function') {
            spine.BeforeUpdateWorldTransform.Add(onBeforeUpdateWorldTransform);
        }

        const onAfterUpdateWorldTransform = this.props?.onAfterUpdateWorldTransform;
        if (onAfterUpdateWorldTransform && typeof onAfterUpdateWorldTransform === 'function') {
            spine.AfterUpdateWorldTransform.Add(onAfterUpdateWorldTransform);
        }

        const onAnimationStart = this.props?.onAnimationStart;
        if (onAnimationStart && typeof onAnimationStart === 'function') {
            spine.AnimationStart.Add(onAnimationStart);
        }

        const onAnimationEnd = this.props?.onAnimationEnd;
        if (onAnimationEnd && typeof onAnimationEnd === 'function') {
            spine.AnimationEnd.Add(onAnimationEnd);
        }

        const onAnimationComplete = this.props?.onAnimationComplete;
        if (onAnimationComplete && typeof onAnimationComplete === 'function') {
            spine.AnimationComplete.Add(onAnimationComplete);
        }
        
        const onAnimationEvent = this.props?.onAnimationEvent;
        if (onAnimationEvent && typeof onAnimationEvent === 'function') {
            spine.AnimationEvent.Add(onAnimationEvent);
        }

        const onAnimationInterrupt = this.props?.onAnimationInterrupt;
        if (onAnimationInterrupt && typeof onAnimationInterrupt === 'function') {
            spine.AnimationInterrupt.Add(onAnimationInterrupt);
        }

        const onAnimationDispose = this.props?.onAnimationDispose;
        if (onAnimationDispose && typeof onAnimationDispose === 'function') {
            spine.AnimationDispose.Add(onAnimationDispose);
        }
        
        spine.SetAnimation(0, 'jump', true);

        UE.UMGManager.SynchronizeWidgetProperties(spine);

        return spine;
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps: any, newProps: any, updateProps: Record<string, any>): boolean {
        return true;
    }
    
    
}
