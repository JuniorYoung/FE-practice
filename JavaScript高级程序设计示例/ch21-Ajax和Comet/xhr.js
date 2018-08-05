//XMLHttpRequest 基本用法
/**
 * 1. 创建 xhr 对象
 * 2. 设置 readystatechange 监听事件
 * 3. 调用 open() 设置请求地址、方法
 * 4. 如过需要设置请求头部 调用 setRequestHeader() 设置
 * 5. 一切就绪，调用 send() 发送请求。如果需要发送请求实体，则调用send()时传入实体数据，否则传入 null
 */
{
    document.getElementById('reqBtn').onclick = () => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
                case 0:
                    console.log('尚未调用open()方法');
                    break;
                case 1:
                    console.log('已调用open()方法，尚未调用send()方法');
                    break;
                case 2:
                    console.log('已调用send()方法，尚未接收到响应');
                    break;
                case 3:
                    console.log('接收到部分响应');
                    break;
                case 4:
                    console.log('接收到全部响应：');
                    console.log(xhr.getAllResponseHeaders());
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        console.log(xhr.responseText);
                    } else {
                        console.error('Request is unsuccessful: ' + xhr.status);
                    }
                    break;
            }
        };
        xhr.open('get',
            'http://api.map.baidu.com/telematics/v3/weather?location=%E6%B5%8E%E5%8D%97&output=json&ak=5slgyqGDENN7Sy7pw29IUvrZ',
            true);
        xhr.setRequestHeader('customHeader', 'val');
        xhr.send(null);
    };
}
//请求类型为get时，需要将查询字符串进行编码 使用 encodeURIComponent()
{
    let addURLParam = (url, name, value) => {
        url += (url.indexOf('?') == -1 ? '?' : '&');
        url += (encodeURIComponent(name) + '=' + encodeURIComponent(value));
        return url;
    };
    let url = 'http://example.php';
    url = addURLParam(url, 'name', 'Junior');
    url = addURLParam(url, 'email', 'jjj@qq.com');
    console.log(url); // http://example.php?name=Junior&email=jjj%40qq.com
}
//序列化表单
function serialize(form) {
    var parts = [],
        field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;
    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];
        switch (field.type) {
            case 'select-one':
            case 'select-multiple':
                if (field.name.length) {
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = '';
                            if (option.hasAttribute) {
                                optValue = option.hasAttribute('value')
                                    ? option.value
                                    : option.text;
                            } else {
                                optValue = (option.attributes['value'].specified)
                                    ? option.value
                                    : option.text;
                            }
                            parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue));
                        }
                    }
                }
                break;
            case 'undefined':
            case 'file':
            case 'submit':
            case 'reset':
            case 'button':
                break;
            case 'radio':
            case 'checkbox':
                if (!field.checked) {
                    break;
                }
            default:
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join('&');
}
//使用post请求类型 发送实体数据
{
    //模拟表单提交 Content-Type = application/x-www-form-urlencoded
    document.getElementById('sendFormBtn').onclick = function () {
        const xhr = new XMLHttpRequest();
        xhr.open('post',
            'http://api.map.baidu.com/telematics/v3/weather?location=%E6%B5%8E%E5%8D%97&output=json&ak=5slgyqGDENN7Sy7pw29IUvrZ',
            true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(serialize(document.getElementById('form')));
    };
}
//XMLHTTPRequest 2级 FormData类型
{
    document.getElementById('sendFromDataBtn').onclick = function () {
        let formData = new FormData();
        let formDataByDom = new FormData(document.getElementById('form'));
        console.log(formDataByDom.get('name'));
        formData.append('name', 'junior');
        formData.append('addr', 'stree&fessd'); //特殊符号
        const xhr = new XMLHttpRequest();
        xhr.open('post',
            'http://api.map.baidu.com/telematics/v3/weather?location=%E6%B5%8E%E5%8D%97&output=json&ak=5slgyqGDENN7Sy7pw29IUvrZ',
            true);
        //无需设置Content-Type 因为只是发送与表单格式相同的数据 而不是提交表单
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(formDataByDom);
    };
}
//XMLHTTPRequest 2级 超时设定 timeout  overrideMimeType()
{
    document.getElementById('getBigImgBtn').onclick = function () {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    // 成功并返回响应
                    console.log(xhr.responseText);
                } else {
                    //失败
                }
            }
        };
        //来张超大尺寸图片
        const imgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533978069&di=2e86afba5c398b95b0e66291a82a6f56&imgtype=jpg&er=1&src=http%3A%2F%2Fimage5.tuku.cn%2Fpic%2Fwallpaper%2Fsheji%2FVladstudiogaoqingchahuabizhi2%2F017.jpg';
        xhr.open('get',
            imgUrl,
            true, );
        xhr.timeout = 1000; // 设定请求超时时间为 1s
        //设置超时监听事件
        xhr.ontimeout = function (e) {
            //
        };
        //重写响应MIME类型，将响应数据按照纯文本格式来解析
        xhr.overrideMimeType('text/plain; charset=utf-8');
        xhr.send(null);
    };
}
//进度事件
{
    //                        ┏━ error ━┓
    //                        ┃         ┃
    // loadstart ━━ progress ━╋━ load  ━╋━━ loadend
    //                        ┃         ┃
    //                        ┗━ abort ━┛
    document.getElementById('progressEventBtn').onclick = function() {
        let xhr = new XMLHttpRequest();
        xhr.onloadstart = function() {
            console.log('loadstart event');
        };
        xhr.onloadend = function() {
            console.log('loadend event');
        };
        xhr.onload = function() {
            console.log('load event');
        };
        xhr.onprogress = function(event) {
            console.log('progress event');
            console.log(event);
        };
        xhr.onerror = function() {
            console.log('error event');
        };
        xhr.onabort = function() {
            console.log('abort event');
        };
        xhr.open('post',
        'http://api.map.baidu.com/telematics/v3/weather?location=%E6%B5%8E%E5%8D%97&output=json&ak=5slgyqGDENN7Sy7pw29IUvrZ',
        true);
        xhr.send(null);
    };
}
//JSONP
{
    function cb(resp) {
        console.log(resp);
    }
    const url = 'http://suggest.taobao.com/sug?code=utf-8&q=女心内衣&callback=cb';
    document.getElementById('jsonpBtn').onclick = function() {
        const scr = document.createElement('script');
        scr.src = url;
        document.body.insertBefore(scr, document.body.lastElementChild);
        document.body.removeChild(document.body.lastElementChild.previousElementSibling);
    };
}
//Web Sockets
{
    // ws://121.40.165.18:8800 测试地址
    let webSocket;
    /**
     * 
     * @param {*} which 'client' 'server'
     * @param {*} mess 
     */
    let messDivAddInfo = (which, mess) => {
        const whichText = which === 'client' ? '你' : '服务端发送';
        const thisTime = (function(d) {
            return (d.getHours()) + ':'
                    + (d.getMinutes() < 10 
                        ? '0' + d.getMinutes() 
                        : d.getMinutes()) 
                    + ':' +(d.getSeconds());
        })(new Date());
        const messDiv = document.getElementById('messShowDiv');
        
        const divPar = document.createElement('div');
        const divChilTop = document.createElement('div');
        const divChilBot = document.createElement('div');
        divChilTop.innerText = which + '  ' + thisTime;
        divChilBot.innerHTML = mess;

        divPar.appendChild(divChilTop);
        divPar.appendChild(divChilBot);

        messDiv.appendChild(divPar);
    };
    //建立连接
    document.getElementById('wsAccessBtn').onclick = function() {
        if(!(webSocket instanceof WebSocket)) {
            const wsAddr = document.getElementById('wsAccessAddr').value;
            webSocket = new WebSocket(wsAddr);
            //成功建立连接
            webSocket.onopen = function(e) {
                console.log('成功建立 web socket 连接');
                console.log(e);
            };
            //接收到服务器发送的信息
            webSocket.onmessage = function(e) {
                console.log('接收到服务器发送的信息');
                console.log(e.data);
                messDivAddInfo('server', e.data);
            };
            //连接错误
            webSocket.onerror = function(e) {
                console.log(连接发生错误);
                console.log(e);
            };
            //关闭连接
            webSocket.onclose = function(e) {
                console.log('关闭连接');
                console.log(e);
                alert('Was Clean ?' + e.wasClean + ' Code=' + e.code + ' Reason=' + e.reason);
                webSocket = null;
            };
        }
    };
    //断开连接
    document.getElementById('wsCloseBtn').onclick = function() {
        if(webSocket instanceof WebSocket) {
            webSocket.close();
        }
    };
    //发送信息
    document.getElementById('webSocketBtn').onclick = function() {
        if(webSocket instanceof WebSocket) {
            const sendText = document.getElementById('wsText').value;
            webSocket.send(sendText);
            messDivAddInfo('client', sendText);
        } else {
            alert('请先建立web socket连接');
        }
    };
}