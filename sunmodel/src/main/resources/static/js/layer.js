function  addGeojson(geoJson, style) {
    let promise = Cesium.GeoJsonDataSource.load(geoJson,style)
    promise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);

        // //Get the array of entities
        // let entities = dataSource.entities.values;
        //
        // let colorHash = {};
        // console.log(entities)
        // for (let i = 0; i < entities.length; i++) {
        //     //For each entity, create a random color based on the state name.
        //     //Some states have multiple entities, so we store the color in a
        //     //hash so that we use the same color for the entire state.
        //     let entity = entities[i]
        //     let name = entity.name
        //     let color = colorHash[name]
        //     if (!color) {
        //         color = Cesium.Color.fromRandom({
        //             alpha : 1.0
        //         });
        //         colorHash[name] = color;
        //     }
        //
        //     //Set the polygon material to our random color.
        //     entity.polygon.material = color
        //     // //Remove the outlines.
        //     // entity.polygon.outline = false;
        //
        //     //Extrude the polygon based on the state's population.  Each entity
        //     //stores the properties for the GeoJSON feature it was created from
        //     //Since the population is a huge number, we divide by 50.
        //     // entity.polygon.extrudedHeight = entity.properties.Shape_Area / 100000.0;
        // }
    })
    viewer.zoomTo(promise);
}

function addWeatherStations() {
    axios.get("/data/json/sunRadiation.json").then(function (res) {
        if(res.status === 200) {
             console.log(res.data)
            addGeojson(res.data, {
                stroke: Cesium.Color.HOTPINK,
                fill: Cesium.Color.PINK,
                strokeWidth: 3,
                // markerSymbol: 'station',
                clampToGround: true
            })
        }
    }).catch(function(error){console.log(typeof+ error)})
}

// function addChina() {
//     var promise = Cesium.IonResource.fromAssetId(209056).then(function (
//         resource
//     ) {
//         return Cesium.GeoJsonDataSource.load(resource);
//     });
//     promise.then(function(dataSource) {
//         viewer.dataSources.add(dataSource);
//
//         //Get the array of entities
//         let entities = dataSource.entities.values;
//
//         let colorHash = {};
//         console.log(entities)
//         for (let i = 0; i < entities.length; i++) {
//             //For each entity, create a random color based on the state name.
//             //Some states have multiple entities, so we store the color in a
//             //hash so that we use the same color for the entire state.
//             let entity = entities[i]
//             let name = entity.name
//             let color = colorHash[name]
//             if (!color) {
//                 color = Cesium.Color.fromRandom({
//                     alpha : 1.0
//                 });
//                 colorHash[name] = color;
//             }
//
//             //Set the polygon material to our random color.
//             entity.polygon.material = color
//             // //Remove the outlines.
//             // entity.polygon.outline = false;
//
//             //Extrude the polygon based on the state's population.  Each entity
//             //stores the properties for the GeoJSON feature it was created from
//             //Since the population is a huge number, we divide by 50.
//             // entity.polygon.extrudedHeight = entity.properties.Shape_Area / 100000.0;
//         }
//     })
//     viewer.zoomTo(promise);
// }

function addChina() {
    axios.get("/data/json/China_polygon.json").then(function (res) {
        if(res.status === 200) {
            console.log(res.data)
            addGeojson(res.data, {
                stroke: Cesium.Color.HOTPINK,
                fill: Cesium.Color.PINK,
                strokeWidth: 3,
                markerSymbol: 'China',
                clampToGround: true
            })
        }
    }).catch(function(error){console.log(typeof+ error)})
}

function addPolygonByName () {
    axios.get("/polygons/南京").then(function (res) {
        if (res.status === 200) {
            console.log(res.data)
            viewer.dataSources.add(Cesium.GeoJsonDataSource.load(res.data, {
                stroke: Cesium.Color.HOTPINK,
                fill: Cesium.Color.PINK,
                strokeWidth: 3,
                markerSymbol: 'area',
                clampToGround: true
            }))
        }
    }).catch(function(error){console.log(typeof+ error)})
}
