"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
class ImageWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    loadTexture(src) {
        if (!src)
            return undefined;
        // Handle texture object directly
        if (typeof src !== 'string') {
            return src;
        }
        // todo@Caleb196x: 如果是网络图片，则需要先下载到本地，同时还要加入缓存，防止每次都下载
        // Import texture from file path
        const texture = UE.KismetRenderingLibrary.ImportFileAsTexture2D(null, src);
        return texture;
    }
    setImageBrush(image, texture) {
        if (!texture)
            return;
        image.SetBrushFromTexture(texture, true);
    }
    convertToWidget() {
        const image = new UE.Image();
        const texture = this.loadTexture(this.props.src);
        // 关键问题：如何解决图片导入的问题
        // 功能设想
        // 1. 使用import image from '图片路径'的方式导入一张图片，image在UE中的类型为UTexture， 可以直接设置到img标签的src属性中
        // 2. 在img标签的src属性中写入图片路径，在创建对应widget时再导入图片
        // 
        // 实现思路：
        // 1. hook ts的import逻辑，实现导入流程
        // 2. hook js的require逻辑，实现图片的导入；只导入一次，以及通过hash值对比文件是否发生变化，如果发生变化，重新导入
        // 3. 图片导入时，首先读取图片数据，调用ImportFileAsTexture2D API来创建UTexture（创建后是否能够将UTexture保存为本地uasset资产文件？）（思考如何做异步和批量导入，做性能优化）
        // 4. 读取img的标签属性，例如src, width, height
        this.setImageBrush(image, texture);
        this.parseStyleToWidget(image);
        this.commonPropertyInitialized(image);
        return image;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const image = widget;
        let hasChanged = false;
        // Check if src has changed
        if (oldProps.src !== newProps.src) {
            const texture = this.loadTexture(newProps.src);
            this.setImageBrush(image, texture);
            hasChanged = true;
        }
        // Check if size has changed
        if (oldProps.width !== newProps.width || oldProps.height !== newProps.height) {
            // this.updateImageSize(image);
            hasChanged = true;
        }
        // Update common properties if needed
        if (hasChanged) {
            this.parseStyleToWidget(image);
            this.commonPropertyInitialized(image);
        }
        return hasChanged;
    }
    convertReactEventToWidgetEvent(reactProp, originCallback) {
        return undefined;
    }
}
exports.ImageWrapper = ImageWrapper;
//# sourceMappingURL=image.js.map