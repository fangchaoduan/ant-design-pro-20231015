import React, { HTMLAttributes, useEffect, useRef } from 'react';

import styled from 'styled-components';
interface TheContainerStyleProps {
  leftWidth?: string;
  draggableWidth?: string;
}
const TheContainerStyle = styled.div<TheContainerStyleProps>`
  width: 100%;
  height: 100%;
  overflow: hidden;

  // 左侧区域;
  //@leftWidth: 20%;
  /* @draggableWidth: 5px; */
  .left-resize-item {
    float: left;
    width: calc(
      ${(props) => props.leftWidth || `20%`} - ${(props) => props?.draggableWidth || `5px`}
    );
    height: 100%;
  }
  // 可拖动的条;
  .resize-draggable-item {
    float: left;
    box-sizing: border-box;
    width: ${(props) => props?.draggableWidth || `5px`};
    height: 100%;

    background-image: linear-gradient(180deg, #f0f0f0 3px, transparent 3px);
    background-repeat: repeat-y;
    background-size: 100% 5px;

    background-clip: content-box;
    border-right: 2px solid transparent;

    border-left: 2px solid transparent;
    cursor: w-resize;

    &:hover {
      background-image: linear-gradient(180deg, skyblue 3px, transparent 3px);
      background-clip: content-box !important;
    }
  }
  // 右侧区域;
  .right-resize-item {
    float: right;
    width: calc(
      100% - ${(props) => props.leftWidth || `20%`} - ${(props) => props?.draggableWidth || `5px`}
    );
    height: 100%;
  }
`;

export interface DynamicLayoutProps extends HTMLAttributes<HTMLDivElement> {
  leftLayout?: any; //左侧布局组件;
  children?: any; //右侧布局组件;
}

const DynamicLayout: React.FC<DynamicLayoutProps> = (props) => {
  // 把特殊的几个属性值移除掉;
  const theProps = { ...props };
  delete theProps.children;
  delete theProps.leftLayout;

  const boxRef = useRef(null);
  const leftRef = useRef(null);
  const resizeRef = useRef(null);
  const rightRef = useRef(null);

  type TheDOM = HTMLDivElement | null;
  const handleResize = (
    theBoxElement: TheDOM,
    theLeftElement: TheDOM,
    theResizeElement: TheDOM,
    theRightElement: TheDOM,
  ) => {
    if (!theResizeElement || !theLeftElement || !theResizeElement || !theRightElement) {
      console.log(`布局元素有问题`, theResizeElement);
      return;
    }
    console.log(`theBoxElement-->`, theBoxElement);

    theResizeElement.onmousedown = (theEvent: any) => {
      let startX = theEvent.clientX;
      theResizeElement.left = theResizeElement.offsetLeft;
      document.onmousemove = (event) => {
        let endX = event.clientX;

        let moveLen = theResizeElement.left + (endX - startX);
        let maxT = theBoxElement.clientWidth - theResizeElement.offsetWidth;
        let theLimitingLength = 150; //左右两侧长度;
        if (moveLen < theLimitingLength) {
          moveLen = theLimitingLength;
        }
        if (moveLen > maxT - theLimitingLength) {
          moveLen = maxT - theLimitingLength;
        }

        theResizeElement.style.left = moveLen;
        theLeftElement.style.width = `${moveLen}px`;
        theRightElement.style.width = `${theBoxElement.clientWidth - moveLen - 5}px`;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        theResizeElement?.releaseCapture?.();
      };
      theResizeElement?.setCapture?.();
      return false;
    };
  };
  useEffect(() => {
    if (!(boxRef.current && leftRef.current && resizeRef.current && rightRef.current)) {
      return;
    }
    handleResize(boxRef.current, leftRef.current, resizeRef.current, rightRef.current);
  }, [boxRef.current, leftRef.current, resizeRef.current, rightRef.current]);

  return (
    <TheContainerStyle className="resize-box-container" ref={boxRef}>
      <div className="left-resize-item" ref={leftRef}>
        {props?.leftLayout}
      </div>
      <div className="resize-draggable-item" ref={resizeRef}></div>
      <div className="right-resize-item" ref={rightRef}>
        {props?.children}
      </div>
    </TheContainerStyle>
  );
};

export default DynamicLayout;
