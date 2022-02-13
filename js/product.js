import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

let productModal = null;
let delProductModal = null;


const app = createApp({
  components:{
    pagination
  },

  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'andy22',
      products: [],
      isNew : false,
      tempProduct: {
        imagesUrl : [],
      },
      pagination : {},//初始化分頁物件
    }
  },

  mounted(){
    //將modal綁定在mounted裡
    productModal = new bootstrap.Modal(document.getElementById('productModal'),{
      keyboard : false
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'),{
      keyboard : false
    });
    // 取出 Token
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andyToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
  axios.defaults.headers.common['Authorization'] = token;
  console.log(token);
  this.checkAdmin()
},

  methods: {
    checkAdmin() {
        //檢查是否登入成功
      const url = `${this.url}/api/user/check`;
      axios.post(url)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          //cookie不存在會轉址，轉回登入頁面
          window.location = 'index.html';
        })
    },

    getData(page =1) { //參數預設值
        //取得產品
      const url = `${this.url}/api/${this.path}/admin/products/?page=${page}`;
      axios.get(url)
        .then((res) => {
          console.log(res.data);
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },

    openModal(isNew, item){
      //用new/edit/delete來判斷modal的狀態
      if(isNew === 'new'){
        this.tempProduct = {
          imagesUrl :[],
        };
        this.isNew = true;
        productModal.show();
      }
      else if (isNew === 'edit'){
        this.tempProduct = { ...item };//必須用拷貝不然會直接複製到畫面上
        this.isNew = false;
        productModal.show();
      }
      else if (isNew === "delete"){
        this.tempProduct = {...item};
        delProductModal.show()
      }
    },

    updateProduct(){
      let url = `${this.url}/api/${this.path}/admin/product`;
      let http = 'post';
      
      if(!this.isNew){
        url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url,{ data: this.tempProduct})
      .then((res)=>{
        alert(res.data.message);
        productModal.hide();
        this.getData();
      })
      .catch((err)=>{
        alert(err.data.message);
      })

    },
   
    delProduct(){

      const url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
   
      axios.delete(url)
      .then((res)=>{
        alert(res.data.message);
        delProductModal.hide();
        this.getData();
      })
      .catch((err)=>{
        alert(err.data.message);
      })

    },

    createImages(){
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');

    },


  }, 

  

});


app.mount("#app");
