import * as React from "react";
interface ScrollBoxProps {
    width?: string;
    height?: string;
}

export const ScrollBoxExample: React.FC<ScrollBoxProps> = ({ width = "400px", height = "300px" }) => {
    const scrollBoxStyle: React.CSSProperties = {
        width: "400px",
        height: "300px",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#f0f9f9",
        scrollbarWidth: "thin", // 适用于 Firefox
        scrollbarColor: "#888 #f9f9f9", // 适用于 Firefox
        color: 'blueviolet'
    };

    const scrollBarStyle = `
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;

    return (
        <div style={{justifyContent: 'center', alignItems: 'center'}}>
            <style>{scrollBarStyle}</style>
            <div style={scrollBoxStyle}>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                <span>- 思路：所有值的单位相同的情况</span>
                


            </div>
        </div>
    );
};
