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
        margin?: CssType.Property.Padding | undefined;
        padding?: CssType.Property.Padding | undefined;
        cursor?: CssType.Property.Cursor | undefined; // todo@Caleb196x: 替换成React的cursor定义
        justifySelf?: CssType.Property.JustifySelf | undefined;
        alignSelf?: CssType.Property.AlignSelf | undefined;
        width?: (string & {}) | number | undefined;
        height?: (string & {}) | number | undefined;
        maxWidth?: (string & {}) | number | undefined;
        maxHeight?: (string & {}) | number | undefined;
        minWidth?: (string & {}) | number | undefined;
        minHeight?: (string & {}) | number | undefined;
        aspectRatio?: (string & {}) | number | undefined;
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
        clickMethod?: 'down-up' | 'down' | 'up' | 'precise-click' | undefined;
        touchMethod?: 'down-up' | 'down' | 'precise-tap' | undefined;
        pressMethod?: 'down-up' | 'press' | 'release' | undefined;
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
        minCellSize?: RecursivePartial<Vector2D> | undefined;
        cellPadding?: RecursivePartial<Margin> |
                        CssType.Property.Padding | undefined;
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
    
    interface SizeBoxProp extends PanelProps {
        width?: (string & {}) | number | undefined;
        height?: (string & {}) | number | undefined;
        minWidth?: (string & {}) | number | undefined;
        minHeight?: (string & {}) | number | undefined;
        maxWidth?: (string & {}) | number | undefined;
        maxHeight?: (string & {}) | number | undefined;
        minAspectRatio?: (string & {}) | number | undefined;
        maxAspectRatio?: (string & {}) | number | undefined;
    }

    class SizeBox extends React.Component<SizeBoxProp> {
        nativePtr: UE.SizeBox;
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
        color?: CssType.Property.Color | undefined;
        drawType?: 'box' | 'border' | 'image' | 'rounded-box' | 'none' | undefined;
        tiling?: CssType.Property.BackgroundRepeat | undefined;
        outline?: OutlineSetting | undefined;
        margin?: CssType.Property.Margin | undefined;
        padding?: CssType.Property.Padding | undefined;
    }

    interface BorderProp extends CommonProps {
        backgroundColor?: CssType.Property.Color | undefined;
        backgroundImage?: ImageStyle | undefined;
        contentColor?: CssType.Property.Color | undefined;
        contentHorizontalAlign?: 'left' | 'center' | 'right' | 'fill' | undefined;
        contentVerticalAlign?: 'top' | 'center' | 'bottom' | 'fill' | undefined;
        contentPadding?: CssType.Property.Padding | undefined;
        contentMargin?: CssType.Property.Margin | undefined;

        onMouseButtonDown?: () => void;
        onMouseButtonUp?: () => void;
        onMouseMove?: () => void;
        onMouseDoubleClick?: () => void;
    }

    class Border extends React.Component<BorderProp> {
        nativePtr: UE.Border;
    }

    interface SliderCommonProp extends CommonProps {
        value?: number | undefined;
        stepSize?: number | undefined;

        locked?: boolean | undefined;
        useMouseStep?: boolean | undefined;
        controllerLock?: boolean | undefined;
        focusable?: boolean | undefined;

        sliderBarColor?: CssType.Property.Color | undefined;
        sliderThumbColor?: CssType.Property.Color | undefined;

        barThickness?: number | undefined;
        normalBarBackground?: ImageStyle | undefined;
        hoverBarBackground?: ImageStyle | undefined;
        disabledBarBackground?: ImageStyle | undefined;
        normalThumbBackground?: ImageStyle | undefined;
        hoveredThumbBackground?: ImageStyle | undefined;
        disabledThumbBackground?: ImageStyle | undefined;

        valueBinding?: () => number;
        onValueChanged?: (InValue: number) => void;
        onMouseCaptureBegin?: () => void;
        onMouseCaptureEnd?: () => void;
        onControllerCaptureBegin?: () => void;
        onControllerCaptureEnd?: () => void;
    }

    interface RadialSliderProp extends SliderCommonProp {
        defaultValue?: number | undefined;
        thumbStartAngle?: number | undefined;
        thumbEndPointAngle?: number | undefined;
        thumbAngularOffset?: number | undefined;

        showSliderThumb?: boolean | undefined;
        showSliderHand?: boolean | undefined;

        valueTags?: number[] | undefined;
        sliderProgressColor?: CssType.Property.Color | undefined;
        backgroundColor?: CssType.Property.Color | undefined;
    }

    class RadialSlider extends React.Component<RadialSliderProp> {
        nativePtr: UE.RadialSlider;
    }

    interface SliderProp extends SliderCommonProp {
        minValue?: number | undefined;
        maxValue?: number | undefined;
        indentHandle?: boolean | undefined;
        orientation?: 'horizontal' | 'vertical' | undefined;
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
        minDesiredWidth?: number | undefined;
        clearKeyboardFocusOnCommit?: boolean | undefined;
        selectAllTextOnCommit?: boolean | undefined;

        keyboardType?: 'number' | 'web' | 'email' | 'password' | 'alpha-numberic' | undefined;
        textAlign?: 'left' | 'center' | 'right' | undefined;

        arrowBackground?: ImageStyle | undefined;
        normalBackground?: ImageStyle | undefined;
        activeBackground?: ImageStyle | undefined;
        hoveredBackground?: ImageStyle | undefined;
        activeFillBackground?: ImageStyle | undefined;
        hoveredFillBackground?: ImageStyle | undefined;
        inactiveFillBackground?: ImageStyle | undefined;
        textPadding?: CssType.Property.Padding | undefined;
        insetPadding?: CssType.Property.Padding | undefined;
        // todo@Caleb196x: 添加字体样式
        foregroundColor?: CssType.Property.Color | undefined;

        valueBinding?: () => number;
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
        enableRadius?: boolean | undefined;
        image?: ImageStyle | undefined;
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
        image?: ImageStyle | undefined;
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
        expanded?: boolean | undefined;
        maxHeight?: number | undefined;
        rolloutAnimationLasts?: number | undefined;
        // style
        headerPadding?: CssType.Property.Padding | undefined;
        areaPadding?: CssType.Property.Padding | undefined;

        collapsedIcon?: ImageStyle | undefined;
        expandedIcon?: ImageStyle | undefined;

        borderImage?: ImageStyle | undefined;
        borderColor?: CssType.Property.Color | undefined;

        // content
        header?: React.ReactNode | undefined;
        area?: React.ReactNode | undefined;
        // todo@Caleb196x: 添加SetHeaderContent和SetAreaContent方法
        // 可以通过传入ref组件赋值给header和area
        onExpansionChanged?: (IsExpanded: boolean) => void;
    }

    class ExpandableArea extends React.Component<ExpandableAreaProp> {
        nativePtr: UE.ExpandableArea;
        header: React.ReactNode;
        area: React.ReactNode;
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
        barHorizontalBackground?: ImageStyle | undefined;
        barVerticalBackground?: ImageStyle | undefined;
        normalThumbBackground?: ImageStyle | undefined;
        hoveredThumbBackground?: ImageStyle | undefined;
        draggedThumbBackground?: ImageStyle | undefined;
        verticalTopSlotBackground?: ImageStyle | undefined;
        verticalBottomSlotBackground?: ImageStyle | undefined;
        horizontalLeftSlotBackground?: ImageStyle | undefined;
        horizontalRightSlotBackground?: ImageStyle | undefined;
    }

    class ScrollBox extends React.Component<ScrollBoxProp> {
        nativePtr: UE.ScrollBox;
        children: React.ReactNode;
    }

    interface ButtonProp extends CommonProps {
        textColor?: CssType.Property.Color | undefined;
        backgroundColor?: CssType.Property.Color | undefined;

        background?: ImageStyle | undefined;
        hoveredBackground?: ImageStyle | undefined;
        pressedBackground?: ImageStyle | undefined;
        disabledBackground?: ImageStyle | undefined;

        normalPadding?: CssType.Property.Padding | undefined;
        pressedPadding?: CssType.Property.Padding | undefined;

        pressedSound?: any | undefined;
        hoveredSound?: any | undefined;

        focusable?: boolean | undefined;
        // event
        onClick?: () => void;
        onPressed?: () => void;
        onReleased?: () => void;
        onHovered?: () => void;
        onUnhovered?: () => void;
    }

    class Button extends React.Component<ButtonProp> {

    }

    type comboBoxItemSelectionType = 'key-press' | 'navigation' | 'mouse-click' | 'direct' | 'default';
    interface ComboBoxStyle {
        rowPadding?: CssType.Property.Padding | undefined;
        contentPadding?: CssType.Property.Padding | undefined;
        pressedSound?: any | undefined;
        selectionChangeSound?: any | undefined;

        backgroundImage?: ImageStyle | undefined;
        hoveredBackgroundImage?: ImageStyle | undefined;
        pressedBackgroundImage?: ImageStyle | undefined;
        disabledBackgroundImage?: ImageStyle | undefined;

        downArrowBackground?: ImageStyle | undefined;
        downArrowPadding?: CssType.Property.Padding | undefined;
        downArrowAlign?: CssType.Property.AlignSelf | undefined;
    }

    interface ComboBoxItemStyle {
        textColor?: CssType.Property.Color | undefined;
        selectedTextColor?: CssType.Property.Color | undefined;

        focusedBackground?: ImageStyle | undefined;
        activeBackground?: ImageStyle | undefined;
        activeHoveredBackground?: ImageStyle | undefined;
        inactiveBackground?: ImageStyle | undefined;
        inactiveHoveredBackground?: ImageStyle | undefined;

        menuRowBackground?: ImageStyle | undefined;
        evenMenuRowBackground?: ImageStyle | undefined;
        oddMenuRowBackground?: ImageStyle | undefined;
    }

    interface comboBoxScollBarStyle {
        thickness?: number | undefined;
        horizontalBackground?: ImageStyle | undefined;
        verticalBackground?: ImageStyle | undefined;
        normalThumb?: ImageStyle | undefined;
        hoveredThumb?: ImageStyle | undefined;
        draggedThumb?: ImageStyle | undefined;
    }

    interface ComboBoxProp extends CommonProps {
        options?: string[] | undefined;
        selectedOption?: string | undefined;
        contentPadding?: CssType.Property.Padding | undefined;
        maxListHeight?: number | undefined;
        hasDownArrow?: boolean | undefined;
        enableGamepadNavigation?: boolean | undefined;

        comboBoxStyle?: ComboBoxStyle | undefined;
        itemStyle?: ComboBoxItemStyle | undefined;
        scrollBarStyle?: comboBoxScollBarStyle | undefined;
        
        // todo@Caleb196x: 添加字体font

        // events
        onOpened?: () => void;
        onSelectionChanged?: (item: string, selectionType: comboBoxItemSelectionType) => void;
    }

    class ComboBox extends React.Component<ComboBoxProp> {
        nativePtr: UE.ComboBoxString;
    }

    interface CheckboxProp extends CommonProps {
        checked?: boolean | undefined;
        type?: 'checkbox' | 'toggle' | 'default' | undefined;
        padding?: CssType.Property.Padding | undefined;
        color?: CssType.Property.Color | undefined;
        uncheckedBackground?: ImageStyle | undefined;
        uncheckedHoveredBackground?: ImageStyle | undefined;
        uncheckedPressedBackground?: ImageStyle | undefined;
        checkedBackground?: ImageStyle | undefined;
        checkedHoveredBackground?: ImageStyle | undefined;
        checkedPressedBackground?: ImageStyle | undefined;
        undeterminedBackground?: ImageStyle | undefined;
        undeterminedHoveredBackground?: ImageStyle | undefined;
        undeterminedPressedBackground?: ImageStyle | undefined;
        normalBackground?: ImageStyle | undefined;
        normalHoveredBackground?: ImageStyle | undefined;
        normalPressedBackground?: ImageStyle | undefined;

        checkSound?: any | undefined;
        uncheckSound?: any | undefined;
        hoveredSound?: any | undefined;

        // events
        checkStateBinding?: () => boolean;
        onCheckStateChanged?: (InChecked: boolean) => void;
    }

    class Checkbox extends React.Component<CheckboxProp> {
        native: UE.CheckBox;
    }

    /**
     * ProgressBar components
     */
    type ProgressBarType = 'left-to-right' | 'right-to-left' 
                            | 'top-to-bottom' | 'bottom-to-top' | 'fill-from-center'
                            | 'fill-from-center-x' | 'fill-from-center-y' | 'default';
    interface ProgressBarProp extends CommonProps {
        precent?: number | undefined;
        barType?: ProgressBarType | undefined;
        isMarquee?: boolean | undefined;
        enableFillAnimation?: boolean | undefined;
        fillColor?: CssType.Property.Color | undefined;

        background?: ImageStyle | undefined;
        fillBackground?: ImageStyle | undefined;
        marqueeBackground?: ImageStyle | undefined;

        precentBinding?: () => number;
        fillColorBinding?: () => CssType.Property.Color;
    }

    class ProgressBar extends React.Component<ProgressBarProp> {
        native: UE.ProgressBar;
    }

    /**
     * ListView components
     */
    interface ListViewProp extends PanelProps {

    }
    class ListView extends React.Component<ListViewProp> {}

    interface ListViewItemProp extends PanelProps {

    }

    class ListViewItem extends React.Component<ListViewItemProp> {}


    /**
     * TreeView components
     */
    interface TreeViewProp extends PanelProps {

    }
    class TreeView extends React.Component<TreeViewProp> {}

    interface TreeViewItemProp extends PanelProps {

    }
    class TreeViewItem extends React.Component<TreeViewItemProp> {}
    

    /**
     * TileView components
     */
    interface TileViewProp extends PanelProps {

    }
    class TileView extends React.Component<TileViewProp> {}

    interface TileViewItemProp extends PanelProps {

    }

    class TileViewItem extends React.Component<TileViewItemProp> {}

    /**
     * Animation components
     */
    interface SpineProp extends CommonProps {

    }

    class Spine extends React.Component<SpineProp> {}

    interface RiveProp extends CommonProps {

    }

    class Rive extends React.Component<RiveProp> {}

    /**
     * Audio components
     */
}