"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactUMG = void 0;
const Reconciler = require("react-reconciler");
const puerts = require("puerts");
const UE = require("ue");
const base_components_1 = require("./base_components");
/**
 * Compares two values for deep equality.
 *
 * This function checks if two values are strictly equal, and if they are objects,
 * it recursively checks their properties for equality, excluding the 'children'
 * and 'Slot' properties.
 *
 * @param x - The first value to compare.
 * @param y - The second value to compare.
 * @returns True if the values are deeply equal, false otherwise.
 */
function deepEquals(x, y) {
    if (x === y)
        return true;
    if (!(x instanceof Object) || !(y instanceof Object))
        return false;
    for (var p in x) { // all x[p] in y
        if (p == 'children' || p == 'Slot')
            continue;
        if (!deepEquals(x[p], y[p]))
            return false;
    }
    for (var p in y) {
        if (p == 'children' || p == 'Slot')
            continue;
        if (!x.hasOwnProperty(p))
            return false;
    }
    return true;
}
class UEWidget {
    type;
    props;
    callbackRemovers;
    nativePtr;
    slot;
    nativeSlotPtr;
    reactWrapper;
    constructor(type, props) {
        this.type = type;
        this.props = props;
        this.callbackRemovers = {};
        try {
            this.init(type, props);
        }
        catch (e) {
            console.error("create " + type + " throw " + e);
        }
    }
    init(type, props) {
        console.log("UEWidget: ", type, props);
        // create react
        this.reactWrapper = (0, base_components_1.CreateReactComponentWrapper)(type, props);
        if (this.reactWrapper) {
            this.nativePtr = (0, base_components_1.createUMGWidgetFromReactComponent)(this.reactWrapper);
            return;
        }
        let classPath = exports.lazyloadComponents[type];
        if (classPath) {
            //this.nativePtr = asyncUIManager.CreateComponentByClassPathName(classPath);
            this.nativePtr = UE.NewObject(UE.Class.Load(classPath));
        }
        else {
            this.nativePtr = new UE[type]();
        }
        let myProps = {};
        for (const key in props) {
            let val = props[key];
            if (key == 'Slot') {
                this.slot = val;
            }
            else if (typeof val === 'function') {
                this.bind(key, val);
            }
            else if (key !== 'children') {
                myProps[key] = val;
            }
        }
        //console.log("UEWidget", type, JSON.stringify(myProps))
        puerts.merge(this.nativePtr, myProps);
        //console.log(type + ' inited')
    }
    bind(name, callback) {
        console.log("bind: ", name, callback);
        let nativePtr = this.nativePtr;
        let prop = nativePtr[name];
        if (typeof prop.Add === 'function') {
            prop.Add(callback);
            this.callbackRemovers[name] = () => {
                prop.Remove(callback);
            };
        }
        else if (typeof prop.Bind == 'function') {
            prop.Bind(callback);
            this.callbackRemovers[name] = () => {
                prop.Unbind();
            };
        }
        else {
            console.warn("unsupport callback " + name);
        }
    }
    update(oldProps, newProps) {
        console.log("update: ", oldProps, newProps);
        if (this.reactWrapper) {
            (0, base_components_1.updateUMGWidgetPropertyUsingReactComponentProperty)(this.nativePtr, this.reactWrapper, oldProps, newProps);
            return;
        }
        let myProps = {};
        let propChange = false;
        for (var key in newProps) {
            let oldProp = oldProps[key];
            let newProp = newProps[key];
            if (key != 'children' && oldProp != newProp) {
                if (key == 'Slot') {
                    this.slot = newProp;
                    //console.log("update slot..", this.toJSON());
                    puerts.merge(this.nativeSlotPtr, newProp);
                    UE.UMGManager.SynchronizeSlotProperties(this.nativeSlotPtr);
                }
                else if (typeof newProp === 'function') {
                    this.unbind(key);
                    this.bind(key, newProp);
                }
                else {
                    myProps[key] = newProp;
                    propChange = true;
                }
            }
        }
        if (propChange) {
            //console.log("update props", this.toJSON(), JSON.stringify(myProps));
            puerts.merge(this.nativePtr, myProps);
            UE.UMGManager.SynchronizeWidgetProperties(this.nativePtr);
        }
    }
    unbind(name) {
        console.log("unbind: ", name);
        let remover = this.callbackRemovers[name];
        this.callbackRemovers[name] = undefined;
        if (remover) {
            remover();
        }
    }
    unbindAll() {
        console.log("unbindAll: ", this.callbackRemovers);
        for (var key in this.callbackRemovers) {
            this.callbackRemovers[key]();
        }
        this.callbackRemovers = {};
    }
    appendChild(child) {
        console.log("appendChild: ", child.type);
        // for 'select' and 'option' tags
        if (!this.nativePtr && this.reactWrapper) {
            return;
        }
        if (this.nativePtr instanceof UE.ListView
            || this.type === 'div'
            || this.type === 'canvas') {
            if (this.reactWrapper) {
                this.reactWrapper.appendChildItem(this.nativePtr, child.nativePtr, child.type, child.props);
            }
            return;
        }
        if (this.nativePtr instanceof UE.PanelWidget) {
            let nativeSlot = this.nativePtr.AddChild(child.nativePtr);
            //console.log("appendChild", (await this.nativePtr).toJSON(), (await child.nativePtr).toJSON());
            child.nativeSlot = nativeSlot;
        }
    }
    removeChild(child) {
        console.log("removeChild: ", child.type);
        child.unbindAll();
        this.nativePtr.RemoveChild(child.nativePtr);
        //console.log("removeChild", (await this.nativePtr).toJSON(), (await child.nativePtr).toJSON())
    }
    set nativeSlot(value) {
        this.nativeSlotPtr = value;
        //console.log('setting nativeSlot', value.toJSON());
        if (this.slot) {
            puerts.merge(this.nativeSlotPtr, this.slot);
            UE.UMGManager.SynchronizeSlotProperties(this.nativeSlotPtr);
        }
    }
}
class UEWidgetRoot {
    nativePtr;
    Added;
    constructor(nativePtr) {
        this.nativePtr = nativePtr;
    }
    appendChild(child) {
        let nativeSlot = this.nativePtr.AddChild(child.nativePtr);
        child.nativeSlot = nativeSlot;
    }
    removeChild(child) {
        child.unbindAll();
        this.nativePtr.RemoveChild(child.nativePtr);
    }
    addToViewport(z) {
        if (!this.Added) {
            this.nativePtr.AddToViewport(z);
            this.Added = true;
        }
    }
    removeFromViewport() {
        this.nativePtr.RemoveFromViewport();
    }
    getWidget() {
        return this.nativePtr;
    }
}
const hostConfig = {
    getRootHostContext() {
        return {};
    },
    //CanvasPanel()的parentHostContext是getRootHostContext返回的值
    getChildHostContext(parentHostContext) {
        return parentHostContext; //no use, share one
    },
    appendInitialChild(parent, child) {
        parent.appendChild(child);
    },
    appendChildToContainer(container, child) {
        container.appendChild(child);
    },
    appendChild(parent, child) {
        parent.appendChild(child);
    },
    createInstance(type, props, rootContainer, hostContext, internalHandle) {
        return new UEWidget(type, props);
    },
    createTextInstance(text) {
        return new UEWidget("TextBlock", { Text: text });
    },
    finalizeInitialChildren() {
        return false;
    },
    getPublicInstance(instance) {
        console.warn('getPublicInstance');
        return instance;
    },
    prepareForCommit(containerInfo) {
        //log('prepareForCommit');
    },
    resetAfterCommit(container) {
        // container.addToViewport(0);
    },
    resetTextContent(instance) {
        console.error('resetTextContent not implemented!');
    },
    shouldSetTextContent(type, props) {
        return false;
    },
    commitTextUpdate(textInstance, oldText, newText) {
        if (oldText != newText) {
            textInstance.update({}, { Text: newText });
        }
    },
    //return false表示不更新，真值将会出现到commitUpdate的updatePayload里头
    prepareUpdate(instance, type, oldProps, newProps) {
        try {
            return !deepEquals(oldProps, newProps);
        }
        catch (e) {
            console.error(e.message);
            return true;
        }
    },
    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
        try {
            instance.update(oldProps, newProps);
        }
        catch (e) {
            console.error("commitUpdate fail!, " + e);
        }
    },
    removeChildFromContainer(container, child) {
        console.error('removeChildFromContainer');
        container.removeChild(child);
    },
    removeChild(parent, child) {
        parent.removeChild(child);
    },
    clearContainer(container) {
    },
    getCurrentEventPriority() {
        return 0;
    },
    getInstanceFromNode(node) {
        return undefined;
    },
    beforeActiveInstanceBlur() {
    },
    afterActiveInstanceBlur() {
    },
    prepareScopeUpdate(scopeInstance, instance) { },
    getInstanceFromScope(scopeInstance) { return null; },
    detachDeletedInstance(node) { },
    //useSyncScheduling: true,
    supportsMutation: true,
    isPrimaryRenderer: true,
    supportsPersistence: false,
    supportsHydration: false,
    // shouldDeprioritizeSubtree: undefined,
    // setTimeout: undefined,
    // clearTimeout: undefined,
    // cancelDeferredCallback: undefined,
    noTimeout: undefined,
    preparePortalMount() {
        // Implement if needed
    },
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    // scheduleDeferredCallback: undefined,
};
const reconciler = Reconciler(hostConfig);
let coreWidget;
exports.ReactUMG = {
    render: function (reactElement) {
        if (coreWidget == undefined) {
            throw new Error("init with SmartUICoreWidget first!");
        }
        let root = new UEWidgetRoot(coreWidget);
        const container = reconciler.createContainer(root, 0, null, false, false, "", null, null);
        reconciler.updateContainer(reactElement, container, null, null);
        return root;
    },
    init: function (inCoreWidget) {
        coreWidget = inCoreWidget;
    },
    release: function () {
        coreWidget.ReleaseJsEnv();
    }
};
//# sourceMappingURL=reactumg.js.map