//绘制工具初始化
var drawTool = new DrawTool({
    viewer: viewer,
    hasEdit: true
});

//清楚当前的cesium的鼠标事件
function clearHandle () {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas); //获取地图对象
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)//移除事件
}

function drawPoint () {
    if (!drawTool) return
    clearHandle()
    drawTool.startDraw({
        type: "billboard",
        style: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            image:'../img/close.png'
        },
        success: function (evt) {}
    });
}

function  drawRectangle () {
    if (!drawTool) return
    clearHandle()
    drawTool.startDraw({
        type: "rectangle",
        style: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        success: function (evt) {}
    });
}

function drawPolyline () {
    if (!drawTool) return
    clearHandle()
    drawTool.startDraw({
        type: "polyline",
        style: {
            material: Cesium.Color.YELLOW,
            clampToGround: true
        },
        success: function (evt) {}
    });
}

function  drawPolygon () {
    if (!drawTool) return
    clearHandle()
    drawTool.startDraw({
        type: "polygon",
        style: {
            clampToGround: true,
            material: Cesium.Color.YELLOW,
        },
        success: function (evt) {}
    });
}

function  drawCircle () {
    if (!drawTool) return
    clearHandle()
    drawTool.startDraw({
        type: "circle",
        style: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        success: function (evt) {}
    });
}

function clearAll () {
    if (drawTool) {
        drawTool.destroy();
    }
}

function clearDraw () {
    $('#draw').css('visibility','hidden')
}
