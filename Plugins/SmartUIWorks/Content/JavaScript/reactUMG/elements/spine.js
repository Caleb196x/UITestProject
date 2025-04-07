"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpineWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
const color_parser_1 = require("./parser/color_parser");
class SpineWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const spine = new UE.SpineWidget();
        this.commonPropertyInitialized(spine);
        const initSkin = this.props?.initSkin;
        if (initSkin && initSkin !== '') {
            spine.SetSkin(initSkin);
        }
        const color = this.props?.color;
        if (color) {
            const rgba = (0, color_parser_1.parseColor)(color);
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
        const initAnimation = this.props?.initAnimation;
        if (initAnimation && initAnimation !== '') {
            spine.SetAnimation(0, initAnimation, true);
        }
        const eventKeyMap = {
            'onAnimationStart': 'AnimationStart',
            'onAnimationEnd': 'AnimationEnd',
            'onAnimationComplete': 'AnimationComplete',
            'onAnimationEvent': 'AnimationEvent',
            'onAnimationInterrupt': 'AnimationInterrupt',
            'onAnimationDispose': 'AnimationDispose',
            'onBeforeUpdateWorldTransform': 'BeforeUpdateWorldTransform',
            'onAfterUpdateWorldTransform': 'AfterUpdateWorldTransform',
        };
        for (const [key, value] of Object.entries(this.props)) {
            if (eventKeyMap[key] && typeof value === 'function') {
                spine[eventKeyMap[key]].Add(value);
            }
        }
        UE.UMGManager.SynchronizeWidgetProperties(spine);
        return spine;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        return true;
    }
}
exports.SpineWrapper = SpineWrapper;
//# sourceMappingURL=spine.js.map