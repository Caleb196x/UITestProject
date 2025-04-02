import * as React from "react";
import './gridpanel.test.css';

export default function GridPanelExample() {
    const styles = {
      gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 3fr)", // 侧边栏 200px，主内容自适应
        gridTemplateRows: "repeat(3, 1fr)", // 头部 60px，内容自适应，底部 60px
        gap: "10px",
        padding: "10px",
        backgroundColor: "#f0f0f0", width: "800px", height: "600px",
        justifySelf: 'center',
        alignSelf: 'center',
      },
      item: {
        padding: "5px", 
        fontSize: "18px",
        borderRadius: "5px",
      },
      header: {
        gridRow: "1",
        gridColumn: "1 / -1", // 跨所有列
        background: "lightcoral",
      },
      sidebar: {
        gridRow: "2",
        gridColumn: "1 / 1",
        background: "lightgreen",
      },
      content: {
        gridRow: "2",
        gridColumn: "2 / span 2",
        background: "blue",
      },
      footer: {
        gridRow: "3",
        gridColumn: "1 / -1",
        background: "lightsalmon",
      },
    };
  
    return (
      <div>
        <div style={styles.gridContainer}>
          <div style={{ ...styles.item, ...styles.header }}>Header</div>
          <div style={{ ...styles.item, ...styles.sidebar }}>Sidebar</div>
          <div style={{ ...styles.item, ...styles.content }}>Main Content</div>
          <div style={{ ...styles.item, ...styles.footer }}>Footer</div>
        </div>
      </div>

    );
  }
