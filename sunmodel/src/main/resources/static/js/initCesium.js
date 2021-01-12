/**
 * cesium 初始化
 */
//鼠标进入显示nav
// $(document).on('mousemove', function (event) {
//     let nav = $('#nav')
//     if (parseInt(event.clientY) <= nav.height() && parseInt(event.clientX) <= nav.width())
//         $('#nav').css('visibility','visible')
// })
// //鼠标离开隐藏nav
// $('#nav').on('mouseleave', function (event) {
//     $('#nav').css('visibility','hidden')
// })

let viewer = wutian.initEarth('cesiumContainer', {
    globalImagery: '谷歌',        // 图层，根据需要更改
    geocoder: true,
    homeButton: true,
    sceneModePicker: true,
    baseLayerPicker: true,
    navigationHelpButton: true,
    animation: true,
    timeline: true,
    fullscreenButton: false,
    vrButton: false,
    selectionIndicator: false,
})
viewer.shadows = true
//添加罗盘
wutian.coordinate(viewer)
viewer.extend(Cesium.viewerCesiumNavigationMixin, {})

let terrain = true
function viewTerrain () {
    console.log(terrain)
    //深度检测
    if (terrain) {
        viewer.scene.globe.depthTestAgainstTerrain = false
        terrain = false
    } else {
        //深度检测
        viewer.scene.globe.depthTestAgainstTerrain = true
        terrain = true
    }
}
