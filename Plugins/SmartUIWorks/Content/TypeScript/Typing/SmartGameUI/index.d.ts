declare module "SmartGameUI" {
    import * as UE from "ue";
    import * as React from 'react';
    import * as CssType from 'csstype';

    type RecursivePartial<T> = {
        [P in keyof T]?:
        T[P] extends (infer U)[] ? RecursivePartial<U>[] : // If the property is an array, apply RecursivePartial to the array's element type.
        T[P] extends object ? RecursivePartial<T[P]> : // If the property is an object, apply RecursivePartial to the object type.
        T[P]; // Otherwise, keep the property type as is.
    };

    type TextCommitType = 'default' | 'enter' | 'mouse-focus' | 'clear';

    interface Vector2D {
        x: number;
        y: number;
    }

    interface Margin {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    interface Transform {
        translation: Vector2D;
        shear: Vector2D;
        scale: Vector2D;
        angle: number;
    }

    /**
     * Style properties of widget
     */
    interface Style {
        margin?: RecursivePartial<Margin>;
        cursor?: CssType.Property.Cursor | undefined; // todo@Caleb196x: 替换成React的cursor定义
        justifySelf?: CssType.Property.JustifySelf | undefined;
        alignSelf?: CssType.Property.AlignSelf | undefined;
        width?: (string & {}) | number | undefined;
        height?: (string & {}) | number | undefined;
        maxWidth?: (string & {}) | number | undefined;
        maxHeight?: (string & {}) | number | undefined;
        minWidth?: (string & {}) | number | undefined;
        minHeight?: (string & {}) | number | undefined;
        transform?: CssType.Property.Transform | undefined;
        translate?: CssType.Property.Translate | undefined;
        rotate?: CssType.Property.Rotate | undefined;
        opacity?: CssType.Property.Opacity | undefined;
        objectFit?: CssType.Property.ObjectFit | undefined;
        scale?: CssType.Property.Scale | undefined;
        visibility?: CssType.Property.Visibility | undefined;
        color?: CssType.Property.Color | undefined;
        gridRow?: CssType.Property.GridRow | undefined;
        gridColumn?: CssType.Property.GridColumn | undefined;
        autoSize?: boolean | undefined;
        zIndex?: CssType.Property.ZIndex | undefined;
        disable?: boolean | undefined;
        positionX?: (string & {}) | number | undefined;
        positionY?: (string & {}) | number | undefined;
        positionAnchor?: (string & {})| undefined;
        flex?: CssType.Property.Flex | undefined;
    }

    /**
     * Common properties of widget
     */
    export interface CommonProps {
        toolTip?: string | undefined;
        title?: string | undefined;
        disable?: boolean | undefined;
        hitTest?: 'self-invisible' | 'self-children-invisible' | 'none' | undefined;
        volatil?: boolean | undefined;
        pixelSnapping?: boolean | undefined;
        style?: Style;
        toolTipBinding?: () => string;
        titleBinding?: () => string;
        disableBinding?: () => boolean;
        visibilityBinding?: () => string;
    }

    /**
     * Panel widgets properties
     */
    export interface PanelProps extends CommonProps {
        children?: React.ReactNode;
        display?: CssType.Property.Display | undefined;
        flexDirection?: CssType.Property.FlexDirection | undefined;
        justifyContent?: CssType.Property.JustifyContent | undefined;
        alignItems?: CssType.Property.AlignItems | undefined;
        alignContent?: CssType.Property.AlignContent | undefined;
        overflow?: CssType.Property.Overflow | undefined;
        overflowX?: CssType.Property.OverflowX | undefined;
        overflowY?: CssType.Property.OverflowY | undefined;
        flexFlow?: CssType.Property.FlexFlow | undefined;
        gap?: CssType.Property.Gap | undefined;
        rowGap?: CssType.Property.RowGap | undefined;
        columnGap?: CssType.Property.ColumnGap | undefined;
        gridTemplateColumns?: CssType.Property.GridTemplateColumns | undefined;
        gridTemplateRows?: CssType.Property.GridTemplateRows | undefined;
        background?: CssType.Property.Background | undefined;
        backgroundImage?: CssType.Property.BackgroundImage | undefined;
        backgroundSize?: CssType.Property.BackgroundSize | undefined;
        backgroundPosition?: CssType.Property.BackgroundPosition | undefined;
        backgroundRepeat?: CssType.Property.BackgroundRepeat | undefined;
        backgroundAttachment?: CssType.Property.BackgroundAttachment | undefined;
        backgroundColor?: CssType.Property.BackgroundColor | undefined;
    }
    
    interface OverlayProps extends PanelProps {
    }

    class Overlay extends React.Component<OverlayProps> {
        nativePtr: UE.Overlay;
    }

    interface ScaleBoxProp extends PanelProps {
        stretch?: 'contain' | 'cover' | 'fill' | 'scale-y' | 'scale-x' | 'custom';
        scale?: number;
    }

    class ScaleBox extends React.Component<ScaleBoxProp> {
        nativePtr: UE.ScaleBox;
    }

    interface UniformGridProp extends PanelProps {
        cellSize?: Vector2D;
        cellPadding?: RecursivePartial<Margin>;
    }

    class UniformGrid extends React.Component<UniformGridProp> {
        nativePtr: UE.UniformGridPanel;
    }

    interface InvalidationBoxProp extends PanelProps {
        cache?: boolean | undefined;
    }

    class InvalidationBox extends React.Component<InvalidationBoxProp> {
        nativePtr: UE.InvalidationBox;
    }

    interface RetainerBoxProp extends PanelProps {
        retainRender?: boolean | undefined;
        renderOnInvalidate?: boolean | undefined;
        renderOnPhase?: boolean | undefined;
        phase?: number | undefined;
        phaseCount?: number | undefined;
    }

    class RetainerBox extends React.Component<RetainerBoxProp> {
        nativePtr: UE.RetainerBox;
    }
    
    interface SafeZoneProp extends PanelProps {
        padLeft?: boolean | undefined;
        padRight?: boolean | undefined;
        padTop?: boolean | undefined;
        padBottom?: boolean | undefined;
    }

    class SafeZone extends React.Component<SafeZoneProp> {
        nativePtr: UE.SafeZone;
    }

    interface OutlineSetting {
        cornerRadio?: RecursivePartial<Margin> | undefined;
        outlineColor?: CssType.Property.Color | undefined;
        width?: number | undefined;
        type?: 'fix-radius' | 'half-height-radius' | 'none' | undefined;
    }

    interface ImageStyle {
        image?: any | undefined;
        imageSize?: RecursivePartial<Vector2D> | undefined;
        tintColor?: CssType.Property.Color | undefined;
        burshColor?: CssType.Property.Color | undefined;
        drawType?: 'box' | 'border' | 'image' | 'rounded-box' | 'none' | undefined;
        tiling?: 'no-tiling' | 'horizontal' | 'vertical' | 'both' | undefined;
        outline?: OutlineSetting | undefined;
        margin?: RecursivePartial<Margin> | undefined;
    }

    interface BorderProp extends CommonProps {
        backgroundColor?: CssType.Property.Color | undefined;
        imageStyle?: ImageStyle | undefined;
        burshColor?: CssType.Property.Color | undefined;
     }

    class Border extends React.Component<BorderProp> {
        nativePtr: UE.Border;
    }

    interface RadialSliderProp extends CommonProps {
        value?: number | undefined;
        defaultValue?: number | undefined;
        handleStartAngle?: number | undefined;
        handleEndAngle?: number | undefined;
        angularOffset?: number | undefined;
        barColor?: CssType.Property.Color | undefined;
        progressColor?: CssType.Property.Color | undefined;
        backgroundColor?: CssType.Property.Color | undefined;
        stepSize?: number | undefined;
        showSliderHandle?: boolean | undefined;
        showSliderHand?: boolean | undefined;
        locked?: boolean | undefined;
        useMouseStep?: boolean | undefined;
        controllerLock?: boolean | undefined;
        barThickness?: number | undefined;
        normalBarImageStyle?: ImageStyle | undefined;
        hoverBarImageStyle?: ImageStyle | undefined;
        normalHandleImageStyle?: ImageStyle | undefined;
        hoverHandleImageStyle?: ImageStyle | undefined;
    }

    class RadialSlider extends React.Component<RadialSliderProp> {
        nativePtr: UE.RadialSlider;
    }

    interface SliderProp extends CommonProps {
        value?: number | undefined;
        minValue?: number | undefined;
        maxValue?: number | undefined;
        orientation?: 'horizontal' | 'vertical' | undefined;
        barColor?: CssType.Property.Color | undefined;
        handleColor?: CssType.Property.Color | undefined;
        stepSize?: number | undefined;
        locked?: boolean | undefined;
        useMouseStep?: boolean | undefined;
        controllerLock?: boolean | undefined;
        barThickness?: number | undefined;
        normalBarImageStyle?: ImageStyle | undefined;
        hoverBarImageStyle?: ImageStyle | undefined;
        normalHandleImageStyle?: ImageStyle | undefined;
        hoverHandleImageStyle?: ImageStyle | undefined;
    }

    class Slider extends React.Component<SliderProp> {
        nativePtr: UE.Slider;
    }
    
    interface SpinBoxProp extends CommonProps {
        value?: number | undefined;
        minValue?: number | undefined;
        maxValue?: number | undefined;
        minSliderValue?: number | undefined;
        maxSliderValue?: number | undefined;

        minFractionDigits?: number | undefined;
        maxFractionDigits?: number | undefined;
        useDeltaSnap?: boolean | undefined;
        enableSlider?: boolean | undefined;
        deltaValue?: number | undefined;
        sliderExponent?: number | undefined;
        arrowImageStyle?: ImageStyle | undefined;
        backgroundImage?: ImageStyle | undefined;
        activeBackgroundImage?: ImageStyle | undefined;
        hoveredBackgroundImage?: ImageStyle | undefined;
        activeFillImage?: ImageStyle | undefined;
        hoveredFillImage?: ImageStyle | undefined;
        inactiveFillImage?: ImageStyle | undefined;
        textPadding?: RecursivePartial<Margin> | undefined;
        textAlign?: 'left' | 'center' | 'right' | undefined;
        foregroundColor?: CssType.Property.Color | undefined;
        insetPadding?: RecursivePartial<Margin> | undefined;

        onValueChanged?: (InValue: number) => void;
        onValueCommitted?: (InValue: number, CommitMethod: TextCommitType) => void;
        onBeginSliderMovement?: () => void;
        onEndSliderMovement?: (InValue: number) => void;
    }

    class SpinBox extends React.Component<SpinBoxProp> {
        nativePtr: UE.SpinBox;
    }

    interface CircularThrobberProp extends CommonProps {
        radius?: number | undefined;
        pieces?: number | undefined;
        period?: number | undefined;
        imageStyle?: ImageStyle | undefined;
    }
    
    class CircularThrobber extends React.Component<CircularThrobberProp> {
        nativePtr: UE.CircularThrobber;
    }

    interface ThrobberProp extends CommonProps {
        pieces?: number | undefined;
        period?: number | undefined;
        animationHorizontal?: boolean | undefined;
        animationVertical?: boolean | undefined;
        animationOpacity?: boolean | undefined;
        imageStyle?: ImageStyle | undefined;
    }

    class Throbber extends React.Component<ThrobberProp> {
        nativePtr: UE.Throbber;
    }
    
    interface SpacerProp extends CommonProps {
        size?: RecursivePartial<Vector2D> | undefined;
    }

    class Spacer extends React.Component<SpacerProp> {
        nativePtr: UE.Spacer;
    }
    
    interface ExpandableAreaProp extends CommonProps {
        isExpanded?: boolean | undefined;
        maxHeight?: number | undefined;
        headerPadding?: RecursivePartial<Margin> | undefined;
        areaPadding?: RecursivePartial<Margin> | undefined;
        collapsedIcon?: ImageStyle | undefined;
        expandedIcon?: ImageStyle | undefined;
        rolloutAnimationLasts?: number | undefined;
        headerImage?: ImageStyle | undefined;
        headerColor?: CssType.Property.Color | undefined;
        header?: React.ReactNode | undefined;
        area?: React.ReactNode | undefined;
        // todo@Caleb196x: 添加SetHeaderContent和SetAreaContent方法
        // 可以通过传入ref组件赋值给header和area
        onExpansionChanged?: (IsExpanded: boolean) => void;
    }

    class ExpandableArea extends React.Component<ExpandableAreaProp> {
    }
    
    interface ScrollBoxProp extends PanelProps {
        orientation?: 'horizontal' | 'vertical' | undefined;
        barThickness?: number | undefined;
        barPadding?: RecursivePartial<Margin> | undefined;
        alwaysShowBars?: boolean | undefined;
        alwaysShowBarTrack?: boolean | undefined;
        visibility?: CssType.Property.Visibility | undefined;
        allowDragging?: boolean | undefined;
        allowOverscroll?: boolean | undefined;
        navigationDestination?: 'into-view' | 'center' | 'top-left' | 'bottom-right' | undefined;
        barHorizontalImage?: ImageStyle | undefined;
        barVerticalImage?: ImageStyle | undefined;
        normalThumbImage?: ImageStyle | undefined;
        hoveredThumbImage?: ImageStyle | undefined;
        draggedThumbImage?: ImageStyle | undefined;
        verticalTopSlotImage?: ImageStyle | undefined;
        verticalBottomSlotImage?: ImageStyle | undefined;
        horizontalLeftSlotImage?: ImageStyle | undefined;
        horizontalRightSlotImage?: ImageStyle | undefined;
    }
}