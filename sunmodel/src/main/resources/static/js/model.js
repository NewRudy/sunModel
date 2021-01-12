new Vue({
    el: '#app',
    data:function (){
        return{
            code:'320000',
            bound:'',

            name: 'Angstrom-Prescott',
            description:'',
            detail:'',
            author:'',
            classifications:'',

            targetGeoJson:'',

            weatherStations:[],
            weatherStaValue:'',
            weatherParameters:['日照时数','相对湿度','降水量','蒸发量','风向','风速','气压','气温'],
            date:[],
            dateValue:'',
            weatherParValue:'',
            weatherData:'',

            radiationStations:[],
            radiationStationTemp:'',
            radiationStaValue:'',
            radiationData:'',
            sunRadiation:'',
            assessmentItems:['SSE','MSE','RMSE','R-square'],
            assessmentItemValue:'',
        }
    },
    methods:{
        loadModelItems() {
            let _this = this
            axios.get('/modelItem/' + this.name).then(function (res) {
                if (res.status === 200) {
                    let temp = res.data[0]
                    _this.name = temp.name
                    _this.description = temp.description
                    _this.detail = temp.detail
                    _this.author = temp.author
                    _this.classifications = temp.classifications
                }
            }).catch(function (err){console.log(err)})
        },
        loadWeatherStations(){
            let _this = this
            axios.get('/chinaStation/location/' + this.code).then(function (res) {
                if(res.status === 200){
                    console.log(res.data)
                }
            }).catch(function (err){console.log(err)})
        },
        loadStationSSD() {
            let _this = this
            axios.get('/ssd/location/' + this.code).then(function (res) {
                if(res.status === 200) {
                    _this.weatherData = res.data
                    _this.weatherStations = []
                    _this.date = []
                    for(let i=0;i<_this.weatherData.length;++i){
                        if(!_this.weatherStations.includes(_this.weatherData[i]['code']))
                            _this.weatherStations.push(_this.weatherData[i]['code'])
                        if(!_this.date.includes(_this.weatherData[i]['date']))
                            _this.date.push(_this.weatherData[i]['date'])
                    }
                }
            })
        },
        loadRadiationStations () {
            let _this = this
            axios.get('/sunRadiation/data/' + this.code).then(function (res) {
                if(res.status === 200) {
                    _this.radiationData = res.data
                    for(let i=0;i<_this.radiationData.length;++i){
                        let temp = {}
                        temp['code'] = _this.radiationData[i]['code']
                        temp['coordinates'] = _this.radiationData[i]['coordinates']
                        _this.radiationStations.push(temp)
                    }
                }
            })
        },
        drawLine(element, data,title,startDate) {
            var myChart=echarts.init(document.getElementById(element));
            myChart.setOption(option = {
                title: {
                    text: title
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    data: data.map(function (item) {
                        return item[0];
                    })
                },
                yAxis: {
                    splitLine: {
                        show: false
                    }
                },
                toolbox: {
                    left: 'center',
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                dataZoom: [{
                    startValue: startDate
                }, {
                    type: 'inside'
                }],
                visualMap: {
                    top: 10,
                    right: 10,
                    pieces: [{
                        gt: 0,
                        lte: 2,
                        color: '#096'
                    }, {
                        gt: 2,
                        lte: 4,
                        color: '#ffde33'
                    }, {
                        gt: 4,
                        lte: 6,
                        color: '#ff9933'
                    }, {
                        gt: 6,
                        lte: 8,
                        color: '#cc0033'
                    }, {
                        gt: 8,
                        lte: 10,
                        color: '#660099'
                    }, {
                        gt: 10,
                        color: '#7e0023'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: {
                    name: title,
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: 50
                        }, {
                            yAxis: 100
                        }, {
                            yAxis: 150
                        }, {
                            yAxis: 200
                        }, {
                            yAxis: 300
                        }]
                    }
                }
            });
        },
        displayWeatherSta () {
            if(this.weatherStaValue && this.weatherParValue && this.dateValue){
                let temp;
                for(let i = 0;i<this.weatherData.length;++i) {
                    if(this.weatherStaValue === this.weatherData[i]['code'] && this.dateValue === this.weatherData[i]['date']){
                        temp = this.weatherData[i]['data']
                        break
                    }
                }
                let title = this.weatherStaValue + ' ' + this.dateValue
                let data = []
                for(let i in temp){
                    data.push([i,parseFloat(temp[i])*0.1])
                }
                console.log(data)
                this.drawLine('weatherImage',data,title,this.dateValue + '-01')
            } else {
                alert('you need to select more')
            }
        },
        displayRadiationSta () {
            if(this.radiationStaValue) {
                let temp = [];
                for(let i=0;i<this.radiationData.length;++i){
                    if(this.radiationStaValue === this.radiationData[i]['code']){
                        for(let j in this.radiationData[i]) {
                            if(typeof j != 'undefined')
                                temp.push(j,this.radiationData[i][j])
                        }
                        break
                    }
                }
                console.log(temp)
                let title = this.radiationStaValue
                console.log(temp)
                this.drawLine('radiationImage',temp,title,temp[0][0])
            }
        },

        invoke () {
            $('#result').css('display','block')
        },

        loadBound(){
            axios.get('/sunRadiation/bound/' + this.code).then(function (res) {
                if(res.status === 200) {
                    this.bound = res.data
                }
            })
        },
        visualization(){
            this.bound = this.loadBound();
        }

    },
    created () {
        this.loadModelItems()
        this.loadStationSSD()
        this.loadRadiationStations()
    }
})
