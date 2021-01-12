// // var position = Cesium.Cartesian3.fromDegrees(116.43299999999988, 39.915999999999954,100)
// // var entity = viewer.entities.add({
// //     position: position,
// //     //加载蓝色小圆点
// //     point: {
// //         color: Cesium.Color.BLUE,    //点位颜色
// //         pixelSize: 5                //像素点大小
// //     },
// //     billboard: {
// //         show: true, // default
// //         pixelOffset: new Cesium.Cartesian2(10, -10), // default: (0, 0)
// //         // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
// //         horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // default
// //         verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
// //         // 按距离缩放
// //         scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1, 10000, 0.0),
// //         scale: 2.0, // default: 1.0
// //         color: Cesium.Color.RED, // default: WHITE
// //         rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
// //         alignedAxis: Cesium.Cartesian3.ZERO, // default
// //         width: 32, // default: undefined
// //         height: 32, // default: undefined
// //     }
// // });
// let geojsonOptions = {
//     clampToGround: true
// }
// let dataPromise = Cesium.GeoJsonDataSource.load('../data/test.json',geojsonOptions)
// dataPromise.then(function (dataSource) {
//     viewer.dataSources.add(dataSource)
//     viewer.flyTo(dataSource)
//     // // 设置符号
//     // SetSymbol(dataSource)
//     // $('baselayter').addEventListener('change', funciton (e) {
//     //     dataSource.show = e.target.checked
//     // })
// })
// function SetSymbol(dataSource) {
//
//     // Get the array of entities
//     var neighborhoodEntities = dataSource.entities.values;
//     for (var i = 0; i < neighborhoodEntities.length; i++) {
//         var entity = neighborhoodEntities[i];
//
//         if (Cesium.defined(entity.polygon)) {
//             // entity styling code here
//             // Use geojson neighborhood value as entity name
//             entity.name = entity.properties.ENGLISH;
//
//             // Set the polygon material to a random, translucent color.
//             entity.polygon.material = Cesium.Color.fromRandom({
//                 // red: 0.5,
//                 // maximumGreen: 0.9,
//                 // minimumBlue: 0.1,
//                 alpha: 0.4
//             });
//
//             // Generate Polygon position
//             var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//             //获取多边形中心,以便放置注记
//             var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
//             polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
//
//             entity.position = polyCenter;
//
//             // 生成注记
//             entity.label = {
//                 text: entity.name,
//                 showBackground: true,
//                 scale: 0.7,
//                 horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
//                 verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//                 heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//                 distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100.0, 2000000.0),
//                 disableDepthTestDistance: 10000.0
//             };
//         }
//     }
// }
// // viewer.camera.flyTo({
// //     destination: Cesium.Cartesian3.fromDegrees(116.43299999999988, 39.915999999999954,10000)
// // });
// console.log(',,,')
