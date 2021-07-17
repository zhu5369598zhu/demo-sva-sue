<template>
</template>

<script>
    let echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/line')
    require('echarts/lib/component/title')
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/legend')
    require('echarts/lib/component/dataZoom')
    require('echarts/lib/component/toolbox')
    export default {
        props: {
            category: {
                type: Array
            },
            series: {
                type: Array
            },
            title_text:{

            },
             option : {
                 type: Object,
                 default()
                 {
                 return {
                     title: {
                         text: this.title_text,
                         x: 'left',
                         y: '10px'
                     },
                     tooltip: {
                         trigger: 'axis'
                     },
                     toolbox: {
                         show: true,
                         feature: {
                             magicType: {show: true, type: ['line']},
                             restore: {show: true},
                             saveAsImage: {show: true}
                         }
                     },
                     calculable: true,
                     xAxis: [
                         {
                             type: 'category',
                             axisLine: {
                                 lineStyle: {
                                     type: 'solid',
                                     color: '#000',
                                     width: '1'
                                 }
                             },
                             axisLabel: {
                                 textStyle: {
                                     color: 'black'
                                 }
                             },
                             boundaryGap: true,
                             data:this.category
                         }
                     ],
                     yAxis: [
                         {
                             type: 'value',
                             axisLine: {
                                 lineStyle: {
                                     type: 'solid',
                                     color: '#000',
                                     width: '1'
                                 }
                             },
                             axisLabel: {
                                 textStyle: {
                                     color: 'black'
                                 }
                             }
                         }
                     ],
                     dataZoom: [
                         // {
                         //     type: 'slider',
                         //     show: true,
                         //     xAxisIndex: [0],
                         //     start: 1,
                         //     end: 100
                         // },
                         // {
                         //     type: 'slider',
                         //     show: true,
                         //     yAxisIndex: [0],
                         //     left: '93%',
                         //     start: 1,
                         //     end: 100
                         // },
                         {
                             type: 'inside',
                             xAxisIndex: [0],
                             start: 1,
                             end: 100
                         },
                         {
                             type: 'inside',
                             yAxisIndex: [0],
                             start: 1,
                             end: 100
                         }
                     ],
                     series: [
                         {
                             type: 'line',
                             smooth: true,
                             itemStyle: {
                                 normal: {
                                     color: '#257ae2',
                                     label: {
                                         show: false
                                     },
                                     labelLine: {
                                         show: false
                                     }
                                 }
                             },
                             data:this.series
                         }
                     ]
                 };
            }
            }
        },
        data () {
            return {
                chart: null
            }
        },
        components: {
            echarts
        },
        methods: {
            initChart (chartElement,time,acceleration) {
                if(this.Chart)
                {
                    this.Chart.clear()

                }
                this.Chart = echarts.init(document.getElementById(chartElement))
                this.Chart.setOption(this.option,true)

                this.Chart.setOption({
                    xAxis: {
                        data:time
                    },
                    series: [{
                        data:acceleration
                    }]
                });

                    window.addEventListener('resize', function () {
                        this.Chart.resize()
                    }.bind(this))

            },
            update_option(time,acceleration)
            {
                this.Chart.setOption({
                    xAxis: {
                        data:time
                    },
                    series: [{
                        data:acceleration
                    }]
                });
                // this.Chart.setOption(this.option)
            }
        },//在Chart.vue中加入watch
        // watch: {
        //     //观察option的变化
        //     option: {
        //         handler(newVal, oldVal) {
        //             if (this.Chart) {
        //                 if (newVal) {
        //                     this.Chart.setOption(newVal);
        //                 } else {
        //                     this.Chart.setOption(oldVal);
        //                 }
        //             } else {
        //                 this.init();
        //             }
        //         },
        //         deep: true //对象内部属性的监听，关键。
        //     }
        //
        // }
    }
</script>

