new Vue({
    el: '#app',
    data: function (){
        return {
            mapJson:'/data/json/China.json',
            country: '',
            province: [],
            city:[],
            area:[],
            countryTemp: '',
            cityTemp: '',
            areaTemp: '',
            countryNow: 'China',
            provinceNow:'province',
            cityNow:'city',
            areaNow:'area',
            terrain:true,
            modelName:'',
            modelItems:'',
            currentPage:1,

            nowCode:'',
            bound:'',
            radiationStations:'',

        }
    },
    methods:{
        /*
         *  布局
         */
        showView () {
            $('#view').css('visibility', 'visible')
        },

        closeView () {
            $('#view').css('visibility', 'hidden')
        },

        showDraw () {
            $('#draw').css('visibility', 'visible')
        },

        closeDraw () {
            $('#draw').css('visibility', 'hidden')
        },
        showSelectArea () {
            $('#selectArea').css('visibility')==='visible'?$('#selectArea').css('visibility','hidden'):$('#selectArea').css('visibility', 'visible')
        },
        closeLayer () {
            $('#selectArea').css('visibility', 'hidden')
        },
        viewPosition () {
            $('#mousePosition').css('visibility')==='hidden'?$('#mousePosition').css('visibility','visible'):$('#mousePosition').css('visibility','hidden')
        },

        viewShadow () {
            viewer.terrainShadows === Cesium.ShadowMode.ENABLED?viewer.terrainShadows=Cesium.ShadowMode.DISABLED:viewer.terrainShadows=Cesium.ShadowMode.ENABLED
        },

        viewNavigation () {
            $('.navigation-controls').css('visibility')==='hidden'?$('.navigation-controls').css('visibility','visible'):$('.navigation-controls').css('visibility','hidden')
            $('.compass').css('visibility')==='hidden'?$('.compass').css('visibility','visible'):$('.compass').css('visibility','hidden')
        },

        viewScale () {
            $('.distance-legend').css('visibility')==='hidden'?$('.distance-legend').css('visibility','visible'):$('.distance-legend').css('visibility','hidden')
        },

        viewToolbar () {
            $('.cesium-viewer-toolbar').css('visibility')==='hidden'?$('.cesium-viewer-toolbar').css('visibility','visible'):$('.cesium-viewer-toolbar').css('visibility','hidden')
        },

        viewTimeLine () {
            $('.cesium-viewer-timelineContainer').css('visibility')==='hidden'?$('.cesium-viewer-timelineContainer').css('visibility','visible'):$('.cesium-viewer-timelineContainer').css('visibility','hidden')
            $('.cesium-viewer-animationContainer').css('visibility')==='hidden'?$('.cesium-viewer-animationContainer').css('visibility','visible'):$('.cesium-viewer-animationContainer').css('visibility','hidden')
        },
        viewModel () {
            if ($('#modelCard').css('visibility') === 'visible' && this.modelItems.length === 0) {
                this.loadModelItems()
            }
            $('#modelCard').css('visibility')==='hidden'?$('#modelCard').css('visibility','visible'):$('#modelCard').css('visibility','hidden')
        },
        /*
         * 选择 省 市 区
         */
        // 加载China地点数据，三级
        getCityData (){
            let that = this
            axios.get(this.mapJson).then(function(response){
                if (response.status==200) {
                    let data = response.data
                    // 省市区数据分类
                    for (let item in data) {
                        if(typeof(item) == 'undefined') continue
                        if (item.match(/0000$/)) {//省
                            that.province.push({id: item, value: data[item], children: []})
                        } else if (item.match(/00$/)) {//市
                            that.city.push({id: item, value: data[item], children: []})
                        } else {//区
                            that.area.push({id: item, value: data[item]})
                        }
                    }
                    // 分类市级
                    for (let i=0;i<that.province.length;++i) {
                        for (let j=0;j<that.city.length;++j) {
                            if (that.province[i].id.slice(0, 2) === that.city[j].id.slice(0, 2)) {
                                that.province[i].children.push(that.city[j])
                            }
                        }
                    }
                    // 分类区级
                    for(let i=0;i<that.city.length;++i) {
                        for(let j=0;j<that.area.length;++j) {
                            if (that.area[j].id.slice(0, 4) === that.city[i].id.slice(0, 4)) {
                                that.city[i].children.push(that.area[j])
                            }
                        }
                    }
                }
                else{
                    console.log(response.status)
                }
            }).catch(function(error){console.log(typeof+ error)})
        },
        // 选国家
        choseCountry (e) {
            console.log(',,,')
        },
        // 选省
        choseProvince (e) {
            this.cityNow = 'city'
            this.areaNow = 'area'
            for (let i=0;i<this.province.length;++i) {
                if (e === this.province[i].id) {
                    this.provinceNow = this.province[i].value
                    this.cityTemp = this.province[i].children
                    break
                }
            }
        },
        // 选市
        choseCity (e) {
            this.areaNow = 'area'
            if (this.provinceNow === 'province') {
                alert('no province')
                return
            }
            for (let i=0;i<this.city.length;++i) {
                if (e === this.cityTemp[i].id) {
                    this.cityTempNow = this.cityTemp[i].value
                    this.areaTemp = this.cityTemp[i].children
                    break
                }
            }
        },
        // 选区
        choseBlock (e) {
            if (this.cityNow === 'city') {
                alert('no city')
                return
            }
            for (let i in this.areaTemp) {
                if (typeof(i) === 'number' && e === this.areaTemp[i].id) {
                    this.areaTempNow = this.areaTemp[i].value
                    break
                }
            }
        },
        // 加载geojson文件
        addGeoJson(geoJson, style, zoom) {
            let promise = Cesium.GeoJsonDataSource.load(geoJson,style)
            promise.then(function(dataSource) {
                viewer.dataSources.add(dataSource);
                if (zoom) {
                    viewer.zoomTo(promise)
                }
            })
        },
        addAllStations(){

        },
        async getNowCode(){
            let _this = this
            let area = ''
            if (this.areaNow != 'area'){
                area = this.areaNow
            } else if (this.cityNow != 'city') {
                area = this.cityNow
            } else if (this.provinceNow != 'province') {
                area = this.provinceNow
            } else {
                alert('no selected area')
                return
            }
            if (this.cityNow === 'city'){       // 省份要特殊处理
                await axios.get('/chinacode/' + area).then(function (res) {
                    if(res.status === 200) {
                        _this.nowCode = res.data
                    }
                }).catch(function (err) {console.log(typeof + err)})
            } else {
                this.nowCode = area
            }
        },
        // 加载选择的区域
        async addSelectedArea () {
            let _this = this
            await this.getNowCode()
            let path = 'https://geo.datav.aliyun.com/areas_v2/bound/'   // 使用在线的中国行政区数据
            path  = path + this.nowCode + '.json'
            await axios.get(path).then(function (res) {
                if(res.status === 200) {
                    _this.addGeoJson(res.data,{
                        stroke: Cesium.Color.HOTPINK,
                        fill: Cesium.Color.PINK,
                        strokeWidth: 3,
                        name:_this.nowCode + 'district',
                        clampToGround: true
                    },true)
                }
            }).catch(function (error) {console.log(typeof + error)})

            await axios.get('/chinaStation/location/' + this.nowCode).then(function (res) {
                if (res.status === 200) {
                    _this.addGeoJson(res.data, {
                        name: _this.nowCode + 'weatherStation',
                        markerColor:Cesium.Color.ROYALBLUE,
                        // markerSymbol:'weatherStation',
                        markerSize:24,
                        clampToGround: true
                    },false)
                }
            }).catch(function (err) {console.log(typeof + err)})

            await axios.get('/sunRadiation/location/' + this.nowCode).then(function (res) {
                if (res.status === 200) {
                    _this.addGeoJson(res.data, {
                        name: _this.nowCode + 'sunStation',
                        markerColor:Cesium.Color.BROWN,
                        // markerSymbol: 'sunStation',
                        markerSize:24,
                        clampToGround: true
                    },false)
                }
            }).catch(function (err) {console.log(typeof + err)})
        },
        /*
         * 选取模型组件
         */
        handleCurrentChange (val) {
            this.currentName = val
        },

        //搜索模型
        searchModel () {
            _this = this
            if(_this.modelName = '') {
                _this.loadModelItems()
            } else {
                axios.get()
            }
        },
        loadModelItems () {
            _this = this
            axios.get('/modelItem/all').then(function (res) {
                if (res.status === 200) {
                    _this.modelItems = res.data;
                }
            })
        },
        visitModel () {
            window.location.href = 'model'
        },
        loadRadiationSSD () {
            let _this = this
            if(this.nowCode != ''){
                axios.get('/ssd/location/' + this.nowCode).then((res)=>{
                    if(res.status === 200){
                        _this.radiationStations = res.data
                    }
                })
            } else {
                alert("no target area")
            }
        },
        loadBound () {
            let _this = this
            axios.get('/sunRadiation/bound/' + this.nowCode).then(function (res) {
                if(res.status === 200) {
                    _this.bound = res.data
                }
            })
        },
        returnImgae() {
            var mycanvas = document.getElementById("canvasMap");
            return mycanvas.toDataURL("image/png");
        },
        async loadKriging(date){
            let _this = this
            await this.getNowCode()

            await axios.get('/ssd/location/' + this.nowCode).then((res)=>{
                if(res.status === 200){
                    _this.radiationStations = res.data
                }
            })
            await axios.get('/sunRadiation/bound/' + this.nowCode).then(function (res) {
                if(res.status === 200) {
                    _this.bound = res.data
                }
            })

            let canvas = document.getElementById("canvasMap")
            canvas.width = 2000
            canvas.height = 2000
            let t = []
            let x = []
            let y = []
            for(let i=0;i<this.radiationStations.length;++i){
                t.push(this.radiationStations[i].data[date])
                x.push(this.radiationStations[i].coordinates['0'])
                y.push(this.radiationStations[i].coordinates['1'])
            }

            if(!t || !x || !y){
                alert('no data')
                return
            }

            let variogram = kriging.train(t, x, y, "exponential", 0, 100);

            let grid = kriging.grid(this.bound.coordinates[0], variogram, 0.05);

            let colors = ["#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00", "#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00", "#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400", "#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900", "#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00", "#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300", "#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800", "#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00", "#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200", "#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700", "#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00", "#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100", "#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402", "#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414", "#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826", "#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38", "#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B", "#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D", "#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170", "#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283", "#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696", "#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA", "#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD", "#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1", "#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4", "#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"];


            kriging.plot(canvas, grid, [73.4766, 135.088], [18.1055, 53.5693], colors);
            viewer.dataSources.removeAll()
            let layer = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
                url: this.returnImgae(),
                rectangle: new Cesium.Rectangle(
                    Cesium.Math.toRadians(73.4766),
                    Cesium.Math.toRadians(18.1055),
                    Cesium.Math.toRadians(135.088),
                    Cesium.Math.toRadians(53.5693)
                )
            }));
            layer.alpha = 0.4
            viewer.zoomTo(layer)
            // viewer.imageryLayers
        },
    },
    mounted(){
        this.getCityData()
        // this.loadKriging('2010-1')
    }
})
