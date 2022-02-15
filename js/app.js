//EMS 具名載入
import {createApp} from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
const url = 'https://vue3-course-api.hexschool.io/v2'; //申請api的網址
const path = 'andy22'; //  自己的API Path

//建立初始結構

const app = ({
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        //登入
        login(){
        axios.post(`${url}/admin/signin`,this.user)
        .then((res)=> {
            console.log(res); 
            const { token,expired } = res.data;//用展開取出token和expired
            console.log(token,expired);
           document.cookie = `andyToken=${token}; expires=${new Date(expired)};`;  //將token、expires寫入cookie裡
           //轉址
           window.location = "product.html";
        })
        .catch((err)=>{
            console.log(err);
            alert(err.data.message);
        })
        }


    }
})

Vue.createApp(app).mount("#app");