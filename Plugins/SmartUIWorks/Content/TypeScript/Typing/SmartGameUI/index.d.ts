declare module "SmartGameUI" {
    import * as UE from "ue";
    import * as React from 'react';

    type RecursivePartial<T> = {
        [P in keyof T]?:
        T[P] extends (infer U)[] ? RecursivePartial<U>[] : // If the property is an array, apply RecursivePartial to the array's element type.
        T[P] extends object ? RecursivePartial<T[P]> : // If the property is an object, apply RecursivePartial to the object type.
        T[P]; // Otherwise, keep the property type as is.
    };

    type CursorType = 'arrow' | 'crosshair' | 'hand' | 'grab' | 'text'
                        | 'grabbing' | 'move' | 'not-allowed'
                        | 'col-resize' | 'row-resize' | 'diagonal-resize' 
                        | 'back-diagonal-resize' | 'pick' | 'default' | 'none';
                        
    type VisibilityType = 'visible' | 'hidden' | 'collapsed' | 'hit-test-invisible' | 'self-hit-test-invisible';

    type TransformAnchorType = 'top-left' | 'top-center' | 'top-right' 
                            | 'bottom-left' | 'bottom-center' | 'bottom-right'
                            | 'center-left' | 'center' | 'center-right'
                            | RecursivePartial<Vector2D>;

    type AlignmentType = 'left' | 'center' | 'right' | 'fill';

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

    interface Style {
        padding?: RecursivePartial<Margin>;
        alignHorizontal?: AlignmentType;
        alignVertical?: AlignmentType;
        width?: number;
        height?: number;
        color?: string;
    }

    export interface CommonProps {
        toolTip?: string;
        isEnabled?: boolean;
        transform?: RecursivePartial<Transform>;
        transformAnchor?: TransformAnchorType
        cursor?: CursorType;
        opacity?: number;
        visibility?: VisibilityType;
        volatil?: boolean;
        pixelSnapping?: boolean;
        style?: Style;
        toolTipBinding?: () => string;
        isEnabledBinding?: () => boolean;
        visibilityBinding?: () => VisibilityType;
    }

    export interface PanelProps extends CommonProps {
        children?: React.ReactNode;
        
    }
    
    interface OverlayProps extends PanelProps {
    }

    class Overlay extends React.Component<OverlayProps> {
        nativePtr: UE.Overlay;
    }
}