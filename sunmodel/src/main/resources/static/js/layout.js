new Vue({
    el: '#app',
    data: function (){
        return {
            mapJson:'/data/json/China.json',
            country: '',
            province: '',
            city:'',
            area:'',
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
            currentPage:1
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
                        if(typeof item === 'undefined')
                            break
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
        // 加载选择的区域
        addSelectedArea () {
            let area = ''
            let id = ''
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
            let that = this
            async function addAreaAndSta () {
                try {
                    if (that.cityNow === 'city'){       // 省份要特殊处理
                        await axios.get('/chinacode/' + area).then(function (res) {
                            if(res.status === 200) {
                                id = res.data
                            }
                        }).catch(function (err) {console.log(typeof + err)})
                    } else {
                        id = area
                    }
                    if (id != '') {
                        let path = 'https://geo.datav.aliyun.com/areas_v2/bound/'   // 使用在线的中国行政区数据
                        path  = path + id + '.json'
                        await axios.get(path).then(function (res) {
                            if(res.status === 200) {
                                that.addGeoJson(res.data,{
                                    stroke: Cesium.Color.HOTPINK,
                                    fill: Cesium.Color.PINK,
                                    strokeWidth: 3,
                                    name:id + 'district',
                                    clampToGround: true
                                },true)
                            }
                        }).catch(function (error) {console.log(typeof + error)})
                    }

                    if (id != '') {     // 加载气象站点
                        axios.get('/chinaStation/location/' + id).then(function (res) {
                            if (res.status === 200) {
                                console.log(res.data)
                                that.addGeoJson(res.data, {
                                    name: id + 'weatherStation',
                                    markerColor:Cesium.Color.ROYALBLUE,
                                    // markerSymbol:'weatherStation',
                                    markerSize:24,
                                    clampToGround: true
                                },false)
                            }
                        }).catch(function (err) {console.log(typeof + err)})
                    }

                    if (id != '') {     // 加载太阳辐射站点
                        axios.get('/sunRadiation/location/' + id).then(function (res) {
                            if (res.status === 200) {
                                console.log(res.data)
                                that.addGeoJson(res.data, {
                                    name: id + 'sunStation',
                                    markerColor:Cesium.Color.BROWN,
                                    // markerSymbol: 'sunStation',
                                    markerSize:24,
                                    clampToGround: true
                                },false)
                            }
                        }).catch(function (err) {console.log(typeof + err)})
                    }
                } catch (err) {console.log(err)
                }
            }
            addAreaAndSta()
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
        }
    },
    mounted(){
        this.getCityData()
    }
})
