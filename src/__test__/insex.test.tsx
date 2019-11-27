import React from 'react'
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"

import MarkTool, { Shape } from '../index'

let container = null
beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
});

afterEach(() => {
    unmountComponentAtNode(container)
    container.remove();
    container = null;
});

test("onReady call", () => {
    const onReady = jest.fn();
    act(() => {
        render(<MarkTool
            onReady={onReady}
            onChange={onChange => { }}
            value={[]}
            selected={0} />, container)
    });
    expect(onReady).toHaveBeenCalledTimes(1)
});

test("data init", () => {
    let changeData = null;
    const initData = {
        selected: 1,
        shapeList: [{
            anchors: [[0, 0]],
            over: false,
            type: 'line',
        }, {
            anchors: [[0, 0]],
            over: false,
            type: 'line',
        }]
    }
    act(() => {
        render(<MarkTool
            onChange={e => { changeData = e }}
            value={initData.shapeList as Shape[]}
            selected={initData.selected} />, container);
    });
    expect(changeData).toStrictEqual(initData);
});

test("data init. selected > shapeList.length", () => {
    let changeData = null;
    const initData = {
        selected: 1,
        shapeList: [{
            anchors: [[0, 0]],
            over: false,
            type: 'line',
        }]
    }
    act(() => {
        render(<MarkTool
            onChange={e => { changeData = e }}
            value={initData.shapeList as Shape[]}
            selected={initData.selected} />, container)
    });
    initData.selected = 0
    expect(changeData).toStrictEqual(initData)
});

test("createShape", () => {
    let changeData = null;
    act(() => {
        render(<MarkTool
            onReady={({ createShape }) => {
                createShape({ shapeType: 'line', color: '#fff000' })
            }}
            onChange={e => { changeData = e }}
            value={[]}
            selected={0} />, container)
    });
    expect(changeData).toStrictEqual({
        shapeList:
            [{
                anchors: [],
                color: '#fff000',
                over: false,
                type: 'line',
                data: undefined
            }],
        selected: 0
    })
});

test("deleteShape", () => {
    let changeData = null;
    act(() => {
        render(<MarkTool
            onReady={({ deleteShape }) => {
                deleteShape(0)
            }}
            onChange={e => { changeData = e }}
            value={[{ "anchors": [[0, 0], [0, 0]], "color": "#fff000", "over": false, "type": "polygon" }, { "anchors": [[0, 0], [0, 0]], "color": "#fff000", "over": false, "type": "polygon" }]}
            selected={0} />, container)
    });
    expect(changeData).toStrictEqual({
        shapeList:
            [{
                anchors: [[0, 0], [0, 0]],
                color: '#fff000',
                over: false,
                type: 'polygon',
            }],
        selected: 0
    })
});

test("line", () => {
    let changeData = null;
    act(() => {
        render(<MarkTool
            onReady={({ createShape }) => {
                createShape({ shapeType: 'line', color: '#fff000' })
            }}
            onChange={e => { changeData = e }}
            value={[]}
            selected={0} />, container)
    });
    const markTool = document.querySelector("[data-testid=MarkTool]");
    act(() => {
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
    });
    expect(JSON.stringify(changeData)).toStrictEqual('{"shapeList":[{"anchors":[[0,0],[0,0]],"color":"#fff000","over":false,"type":"line"}],"selected":0}')

    act(() => {
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
        markTool.dispatchEvent(new MouseEvent("dblclick", {
            bubbles: true,
        }));
    });
    expect(JSON.stringify(changeData)).toStrictEqual('{"shapeList":[{"anchors":[[0,0],[0,0]],"color":"#fff000","over":true,"type":"line"}],"selected":0}')
});

test("polygon", () => {
    let changeData = null;
    act(() => {
        render(<MarkTool
            onReady={({ createShape }) => {
                createShape({ shapeType: 'polygon', color: '#fff000' })
            }}
            onChange={e => { changeData = e }}
            value={[]}
            selected={0} />, container)
    });
    const markTool = document.querySelector("[data-testid=MarkTool]");
    act(() => {
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
    });
    expect(JSON.stringify(changeData)).toStrictEqual('{"shapeList":[{"anchors":[[0,0],[0,0]],"color":"#fff000","over":false,"type":"polygon"}],"selected":0}')

    act(() => {
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
        markTool.dispatchEvent(new MouseEvent("dblclick", {
            bubbles: true,
        }));
    });
    expect(JSON.stringify(changeData)).toStrictEqual('{"shapeList":[{"anchors":[[0,0],[0,0],[0,0]],"color":"#fff000","over":true,"type":"polygon"}],"selected":0}')
});

test("sides", () => {
    let changeData = null;
    act(() => {
        render(<MarkTool
            onReady={({ createShape }) => {
                createShape({ shapeType: 'sides', color: '#fff000' })
            }}
            onChange={e => { changeData = e }}
            value={[]}
            selected={0} />, container)
    });
    const markTool = document.querySelector("[data-testid=MarkTool]");
    act(() => {
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
    });
    expect(JSON.stringify(changeData)).toStrictEqual('{"shapeList":[{"anchors":[[0,0],[0,0]],"color":"#fff000","over":false,"type":"sides"}],"selected":0}')

    act(() => {
        markTool.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
        }));
    });
    expect(JSON.stringify(changeData)).toStrictEqual('{"shapeList":[{"anchors":[[0,0],[0,0]],"color":"#fff000","over":true,"type":"sides"}],"selected":0}')
});