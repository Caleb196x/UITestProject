import * as React from "react";

interface WrapBoxProps {
    width?: string;
    gap?: string
}

export const WrapBoxExample: React.FC<WrapBoxProps> = ({ width = "600px", gap = "10px" }) => {
    const wrapBoxStyle: React.CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        width: "400px",
        height: "300px",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        background: "#f0f9f0",
        color: "lightblue",
        justifyContent: "center",
        alignSelf: "center",
    };

    return <div>
        <div style={wrapBoxStyle}>
            <span> // 思路：</span>
            <span> 所有值的单位相同的情况</span>
            <span> 1. 如果值的单位是绝对长度如px, em, rem，则通过计算每个值所在所有值的比例作为fill值；</span>
            <span> 2. 如果单位是fr，则直接使用fr值；</span>
            <span> 值的单位不同，混合使用的情况</span>
            <span> 3. 如果当前值是auto, 则使用上一个值进行计算；</span>
            <span> 4. 如果是fr和其他绝对长度单位混合，将其他绝对长度单位转换成1个fr单位，并给出警告信息；</span>

        </div>
    </div>
};