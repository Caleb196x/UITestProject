"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniformGridWrapper = void 0;
const UE = require("ue");
const common_wrapper_1 = require("./common_wrapper");
const common_utils_1 = require("./common_utils");
class UniformGridWrapper extends common_wrapper_1.ComponentWrapper {
    constructor(type, props) {
        super();
        this.typeName = type;
        this.props = props;
    }
    convertToWidget() {
        const uniformGrid = new UE.UniformGridPanel();
        this.commonPropertyInitialized(uniformGrid);
        const minCellSize = this.props?.minCellSize;
        if (minCellSize) {
            uniformGrid.SetMinDesiredSlotWidth(minCellSize.x);
            uniformGrid.SetMinDesiredSlotHeight(minCellSize.y);
        }
        const cellPadding = this.props?.cellPadding;
        if (cellPadding) {
            let padding = null;
            if (typeof cellPadding === 'object') {
                padding = new UE.Margin(cellPadding.top, cellPadding.right, cellPadding.bottom, cellPadding.left);
            }
            else if (typeof cellPadding === 'string') {
                padding = (0, common_utils_1.convertMargin)(cellPadding, this.props?.style);
            }
            if (padding) {
                uniformGrid.SetSlotPadding(padding);
            }
        }
        return uniformGrid;
    }
    updateWidgetProperty(widget, oldProps, newProps, updateProps) {
        const overlay = widget;
        let propsChange = false;
        return propsChange;
    }
}
exports.UniformGridWrapper = UniformGridWrapper;
//# sourceMappingURL=uniform_grid.js.map