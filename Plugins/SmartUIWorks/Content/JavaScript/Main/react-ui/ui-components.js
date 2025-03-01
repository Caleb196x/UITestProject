"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
const React = __importStar(require("react"));
const react_umg_1 = require("react-umg");
let SlotOfProgressBar = {
    Size: {
        Value: 100,
        SizeRule: 1
    },
    Padding: {
        Left: 100,
        Right: 10,
    },
};
class StatusBar extends React.Component {
    constructor(props) {
        super(props);
        if ((props.initialPercent || 0) < 0) {
            throw new Error('initialPercent < 0');
        }
        this.state = {
            percent: props.initialPercent || 0.5
        };
    }
    get color() {
        return { R: 1 - this.state.percent, G: 0, B: this.state.percent };
    }
    onIncrement = () => this.setState({ percent: this.state.percent + 0.01 });
    onDecrement = () => this.setState({ percent: this.state.percent - 0.01 });
    render() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(react_umg_1.TextBlock, { Text: `${this.props.name}(${this.state.percent.toFixed(2)})` }),
            React.createElement(react_umg_1.ProgressBar, { Percent: this.state.percent, Slot: SlotOfProgressBar, FillColorAndOpacity: this.color, CategoryName: `${this.props.name}` }),
            React.createElement(react_umg_1.Button, { OnClicked: this.onIncrement }, "+"),
            React.createElement(react_umg_1.Button, { OnClicked: this.onDecrement }, "-")));
    }
}
exports.StatusBar = StatusBar;
//# sourceMappingURL=ui-components.js.map