"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBlockWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class TextBlockWrapper extends common_wrapper_1.ComponentWrapper {
    richTextSupportTags = ['a', 'code', 'mark', 'article', 'strong', 'em', 'del'];
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    isRichTextContent(content) {
        if (typeof content === 'string')
            return false;
        if (Array.isArray(content)) {
            return content.some(child => typeof child === 'object' &&
                this.richTextSupportTags.includes(child.type));
        }
        return typeof content === 'object' &&
            this.richTextSupportTags.includes(content.type);
    }
    convertToRichText(content) {
        if (typeof content === 'string')
            return content;
        if (Array.isArray(content)) {
            return content.map(child => this.convertToRichText(child)).join('');
        }
        const tag = content.type;
        const children = content.props.children;
        const childContent = this.convertToRichText(children);
        return `<${tag}>${childContent}</>`;
    }
    createRichTextBlock(content) {
        const richTextBlock = new UE.RichTextBlock();
        const styleSet = UE.DataTable.Find('/Game/NewDataTable.NewDataTable');
        const richText = this.convertToRichText(content);
        richTextBlock.SetText(richText);
        richTextBlock.SetTextStyleSet(styleSet);
        return richTextBlock;
    }
    createTextBlock(text) {
        const textBlock = new UE.TextBlock();
        textBlock.SetText(text);
        return textBlock;
    }
    convertToWidget() {
        const content = this.props.children;
        let widget;
        if (this.isRichTextContent(content)) {
            widget = this.createRichTextBlock(content);
        }
        else {
            widget = this.createTextBlock(typeof content === 'string' ? content : '');
        }
        this.commonPropertyInitialized(widget);
        return widget;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        if (!('children' in newProps) || newProps.children === oldProps.children) {
            return false;
        }
        const content = this.convertToRichText(newProps.children);
        if (widget instanceof UE.TextBlock) {
            widget.SetText(content);
        }
        else if (widget instanceof UE.RichTextBlock) {
            widget.SetText(content);
        }
        return true;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.TextBlockWrapper = TextBlockWrapper;
//# sourceMappingURL=textblock.js.map