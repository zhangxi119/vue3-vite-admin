/*
 * @Author: zhangxi119 380313641@qq.com
 * @Date: 2022-07-14 15:30:51
 * @LastEditors: zhangxi
 * @LastEditTime: 2022-07-15 16:14:26
 * @FilePath: \vue3-vite-admin\src\views\warterMarker\warterMaker.js
 * @Description: 
 */
/*水印配置*/
//声明 
let watermark = {}
//水印配置 
let setWatermark = (str, domId) => {
    let id = domId
    // 移除水印 判断
    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    //创建画布
    let createCanvas = document.createElement('canvas')
    // 设置canvas画布大小
    createCanvas.width = 250 //宽度
    createCanvas.height = 220 //高度

    //创建Context2D对象作为2D渲染的上下文。
    let Context2D = createCanvas.getContext('2d')
    /*水印样式调整配置*/
    Context2D.rotate(-20 * Math.PI / 100) // 水印旋转角度
    Context2D.font = '16px Vedana' //水印文字大小
    Context2D.fillStyle = '#000' //水印颜色 HEX格式,可使用red 或者rgb格式
    Context2D.textAlign = 'center' //水印水平位置
    Context2D.textBaseline = 'Middle' //水印垂直位置
    Context2D.fillText(str, createCanvas.width / 3, createCanvas.height / 2)

    //创建元素
    let createDiv = document.createElement('div')
    createDiv.id = id
    //水印默认设置
    createDiv.style.pointerEvents = 'none' //水印层事件穿透 让水印不阻止交互事件
    createDiv.style.top = '70px' //水印顶部距离
    createDiv.style.left = '0px' //水印左侧距离
    createDiv.style.opacity = '0.15' //水印透明度
    createDiv.style.position = 'fixed' //水印定位
    createDiv.style.zIndex = '100000 !important;' //水印样式优先显示
    
    createDiv.style.width = document.documentElement.clientWidth - 100 + 'px' //水印宽度
    createDiv.style.height = document.documentElement.clientHeight - 100 + 'px' //水印高度
    createDiv.style.background = 'url(' + createCanvas.toDataURL('image/png') + ') left top repeat' //水印显示(关键代码)
    document.body.appendChild(createDiv) //在指定元素节点的最后一个子节点之后添加节点
    return id
}

// 此方法只允许调用一次
watermark.set = (str, domId = 'warterDom') => {
    let id = setWatermark(str, domId)
    //设置间隔
    // setInterval(() => {
    //     if (document.getElementById(id) === null) {
    //         id = setWatermark(str, domId)
            
    //     }
    // }, 500) 
    //改变大小时执行
    // window.onresize = () => {
    //     setWatermark(str, domId)
    // }
}

export default watermark