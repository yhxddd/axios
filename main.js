import axios from './node_modules/axios';

axios.defaults.withCredentials = true;

//百度jwt 可生成token  全局设置token：
axios.defaults.headers.common['X-Auth-Token']
    ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
//""中放置token内容

//请求的API ：http://jsonplaceholder.typicode.com/todos

//各种方法
function getTodos(){
    //console.log('GET请求');
   /* axios({
        method:'get',
        url:'http://jsonplaceholder.typicode.com/todos',
        params:{
            _limit:5
        }
    }).then(res=>showOutput(res)) //请求成功执行
        .catch(err=>console.error(err))//处理错误
        */
    axios.get('http://jsonplaceholder.typicode.com/todos?_limit=5',{
        timeout:5000  //表示过去多久事件就取消请求
    })
        .then(res=>showOutput(res)) //请求成功执行
        .catch(err=>console.error(err))//处理错误
}

//post:加入新数据 返回的是要添加的数据
function addTodo(){
    //console.log('POST请求');
    axios.post('http://jsonplaceholder.typicode.com/todos?_limit=5',{
        title:'hhhhhhhh哈哈哈哈',
        completed:false
    })
        .then(res=>showOutput(res)) //请求成功执行
        .catch(err=>console.error(err))//处理错误
}

//更新
function updateTodo(){
    //console.log('PUT/PATCH请求');
    //put在url 后需指定一个id的值 表示请求 id 为几的数据 并对其进行更新
  /*  axios.put('http://jsonplaceholder.typicode.com/todos/1',{
        title:'hhhhhhhh哈哈哈哈',
        completed:true
    })
        .then(res=>showOutput(res)) //请求成功执行
        .catch(err=>console.error(err))//处理错误
   */
  // put: Data:{ title:'hhhhhhh哈哈哈哈哈哈',completed:true,id:1}
    axios.patch('http://jsonplaceholder.typicode.com/todos?_limit=5',{
        title:'hhhhhhhh哈哈哈哈',
        completed:true
    })
        .then(res=>showOutput(res)) //请求成功执行
        .catch(err=>console.error(err))//处理错误
    //patch: { userid:1 , id:1 , title: 'hhhhhhhhh哈哈哈哈哈',completed:true}
}



function removeTodo(){
    //console.log('DELETE请求');
    //delete 在url指定id 表示删除id 为1的数据
    axios.delete('http://jsonplaceholder.typicode.com/todos/1')
        .then(res=>showOutput(res)) //请求成功执行
        .catch(err=>console.error(err))//处理错误
}

function getData(){
    //console.log('批量请求数据');
    axios.all([//返回数组 0  是todos的数据 1是posts的数据
        axios.get("http://jsonplaceholder.typicode.com/todos?_limit=5"),
        axios.get("http://jsonplaceholder.typicode.com/posts?_limit=5")
    ])
        //.then(showOutput(res[0]))  打印todos的数据
        //.then(axios.spread((todos,posts)=>showOutput(todos)) //括号内填什么就打印谁的数据
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
}

function customHeaders(){
    //console.log('自定义请求头');
    const config = {
        headers:{
            "Content-Type":"application/json",
        }
    };
    axios.post("http://jsonplaceholder.typicode.com/todos",{
        title:'hhhhhhhHhhhhh',
        completed:true
    },config)  //后面的参数是设置的请求头
        .then(res=>showOutput(res))
        .catch(err=>console.error(err));
}
//transform 对应的数据进行转换
function transformResponse(){
    //console.log('TransformResponse 对应的数据进行转换');
    const options={
        methods:'post',
        url:'http://jsonplaceholder.typicode.com/todos',
        data:{
            title:'hello'
        },
        //对要更新的数据进行转换 转换为大写
        transformResponse:axios.defaults.transformResponse.concat(data=>{
            data.title = data.title.toUpperCase();
            return data;
        })
    };
    axios(options).then(res=>showOutput(res))
}
//Error处理
function errorHandling(){
   // console.log('Error Handling');
    //对设置错误的请求地址 则回打印请求错误类型
    axios.get("http://jsonplaceholder.typicode.com/todosaaaa")
        .then(res=>showOutput(res))
       // .catch(err=>console.error(err));
        .catch(err=>{
            if(err.response){
                console.log(err.response.data); //打印请求的数据
                console.log(err.response.status);//请求状态
                console.log(err.response.headers);//请求头
            }else if(err.request){
                console.error(err.request)  //发送请求但无响应时 打印
            }else{
                console.error(err.message);//除无响应 和 请求地址错误外的错误
            }
        })
}

//请求取消
function cancelToken(){
    //console.log('Cancel Token');
    const source = axios.CancelToken.source(); //该对象用于取消某请求
    //source实际上是 promise
    axios.get("http://jsonplaceholder.typicode.com/todos",{
        cancelToken:source.token
    })
        .then(res=>showOutput(res))
        .catch(thrown=>{
            if(axios.isCancel(thrown)){
                console.log("request cancel",thrown.message);
                //thrown.message 对应下面if中的内容
                //若thrown为真 则打印  此时还不能取消 要想办法触发source.token
            }
        });
    if(true){  //先执行 再执行axios请求
        source.cancel("请求取消");  //触发source.token
    }


}
//请求拦截
axios.interceptors.request.use(
    config=>{
        //请求类型 发送到 请求地址 的 时间
        console.log('${config.method.toUpperCase()} ' +
            'request sent to ${config.url} at ${new Date().getTime()}'
        );
        return config;
    }, error=>{
        return Promise.reject(error)
    }
);

//Axios的实例化 http://jsonplaceholder.typicode.com/todos
const axiosInstance = axios.create({
    baseURL:'http://jsonplaceholder.typicode.com' //根目录
});
//axiosInstance.get('/todos?_limit=5').then(res=>showOutput(res));
axiosInstance.get('/comments?_limit=5').then(res=>showOutput(res))

//数据展示
function showOutput(res){
    document.getElementById('res').innerHTML=
        '<div class="card card-body mb-4">' +
        '   <h5>Status:${res.status}</h5>' +
        '</div>' +
        '<div class="card mt-3">' +
        '   <div class="card-header">' +
        '       Headers' +
        '   </div>' +
        '   <div class="card-body">' +
        '       <pre>${JSON.stringify(res.headers,null,2)}</pre>' +
        '   </div>' +
        '</div>' +
        '' +
            '<div class="card mt-3">' +
        '   <div class="card-header">' +
        '       Data ' +
        '   </div>' +
        '   <div class="card-body"> ' +
        '      <pre>${JSON.stringify(res.data,null,2)}</pre>' +
        '   </div>' +
        '</div>' +
        ' '+
        '<div class="card mt-3">' +
        '   <div class="card-header">' +
        '       config ' +
        '   </div>' +
        '   <div class="card-body"> ' +
        '      <pre>${JSON.stringify(res.config,null,2)}</pre>' +
        '   </div>' +
        '</div>'
}

//事件监听
document.getElementById('get').addEventListener('click',getTodos);
document.getElementById('post').addEventListener('click',addTodo);
document.getElementById('update').addEventListener('click',updateTodo);
document.getElementById('delete').addEventListener('click',removeTodo);
document.getElementById('sim').addEventListener('click',getData);
document.getElementById('headers').addEventListener('click',customHeaders);
document.getElementById('transform').addEventListener('click',transformResponse);
document.getElementById('error').addEventListener('click',errorHandling);
document.getElementById('cancel').addEventListener('click',cancelToken);