import * as UE from 'ue';
import { ComponentWrapper } from "../common_wrapper";
import { mergeClassStyleAndInlineStyle } from '../common_utils';
 import { WrapBoxWrapper } from './wrapbox';
import { GridPanelWrapper } from './gridpanel';
import { ScrollBoxWrapper } from './scrollbox';
import { FlexWrapper } from './flex';

export enum UMGContainerType {
    ScrollBox,
    GridPanel,
    Flex,
    HorizontalBox,
    VerticalBox,
    WrapBox, 
    StackBox
}

export class ContainerWrapper extends ComponentWrapper {
    private containerStyle: any;
    private containerType: UMGContainerType;
    private commonWrapper: ComponentWrapper;
    constructor(type: string, props: any) {
        super();
        this.typeName = type;
        this.props = props;
        this.containerType = UMGContainerType.HorizontalBox;
    }

    override convertToWidget(): UE.Widget { 
        this.containerStyle = mergeClassStyleAndInlineStyle(this.props);

        const display = this.containerStyle?.display || 'flex';
        const overflow = this.containerStyle?.overflow || 'visible';
        const overflowX = this.containerStyle?.overflowX || 'visible';
        const overflowY = this.containerStyle?.overflowY || 'visible';
        const flexWrap = this.containerStyle?.flexWrap || 'nowrap';

        let widget: UE.Widget;
        // Convert to appropriate UMG container based on style
        if (overflow === 'scroll' || overflowY === 'scroll' || overflowX === 'scroll' 
            || overflowX === 'auto' || overflow === 'auto'  || overflowY === 'auto') 
        {
            let scrollBoxWrapper = new ScrollBoxWrapper(this.typeName, this.props);
            widget = scrollBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.ScrollBox;
            this.commonWrapper = scrollBoxWrapper;
        } else if (display === 'grid') {

            // grid panel
            let gridPanelWrapper = new GridPanelWrapper(this.typeName, this.props);
            widget = gridPanelWrapper.convertToWidget();
            this.containerType = UMGContainerType.GridPanel;
            this.commonWrapper = gridPanelWrapper;

        } else if (flexWrap === 'wrap' || flexWrap === 'wrap-reverse') {

            let wrapBoxWrapper = new WrapBoxWrapper(this.typeName, this.props);
            widget = wrapBoxWrapper.convertToWidget();
            this.containerType = UMGContainerType.WrapBox;
            this.commonWrapper = wrapBoxWrapper;
        } else {
            let flexWrapper = new FlexWrapper(this.typeName, this.props);
            widget = flexWrapper.convertToWidget();
            this.containerType = UMGContainerType.HorizontalBox;
            this.commonWrapper = flexWrapper;
        }

        return widget;
    }

    override appendChildItem(parentItem: UE.Widget, childItem: UE.Widget, childItemTypeName: string, childProps?: any): void {
        // 1. 设置父容器的clip属性
        // 2. 根据width, height添加size box并设置大小
        // 3. 根据objectFit添加scale box并设置缩放
        // 
        this.commonWrapper.appendChildItem(parentItem, childItem, childItemTypeName, childProps);
    }

    override updateWidgetProperty(widget: UE.Widget, oldProps : any, newProps: any, updateProps: Record<string, any>) : boolean {
        return;
    }
}