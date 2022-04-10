async function getInfoProduct(value){
  let queryParams = value ? "?title=" + value : "";
    const resp = await fetch("https://products-dasw.herokuapp.com/api/products"+queryParams,{
        method: 'GET',
        headers: {
            'x-expediente':'727456',
        }
    });
    const info = await resp.json();
    return info;
}

async function getProducts(info){
    //const info = await getInfoProduct();
    let divProd = document.querySelector("div#indexCards");

    divProd.innerHTML = info.map(prod =>`
    <div class="card col-lg-3 col-md-4 col-sm-6">
          <img
            class="card-img-top"
            src=${prod.imageUrl}
            alt="Card image cap"
            style="width: 18rem; height: 60%"
          />
          <div class="card-body">
            <p class="card-text">
              ${prod.title}  
            </p>
            <p class="card-text">
            ${prod.description}
            </p>
            <p class="card-text">
            ${prod.unit} x $${prod.pricePerUnit}
            </p>
          </div>
            <button type="button" class="btn " style="background-color: lightcoral; color: white;" data-toggle="modal" data-target="#modelId" onclick="setProduct('${prod.uuid}')">
            Add to Cart
            </button>
        </div>    
    `).join("");
}

function login(){
  let email = document.querySelector('#email').value;

  sessionStorage.setItem("user", email)  

  event.preventDefault();
}

async function getPaginatition(prod){
  let page = 1;
  sessionStorage.setItem("page",page);
  //let prod = await getInfoProduct();
  let numPages = Math.ceil(prod.length/4);
  let ulPages = document.querySelector("#pages");

  let html = "";
    for (let i =  1; i<= numPages; i++ ){
      html += `<li class="page-item"><a class="page-link ${page == i ? 'activo': ''} " href="#" onclick="setPage(${i})">${i}</a></li>`
    }
    ulPages.innerHTML = html;

    let products = prod.slice((page-1)*4,page*4)
    sessionStorage.setItem("products",JSON.stringify(prod));

    getProducts(products);
}

function setPage(nPage){
  event.preventDefault();
  event.target.classList.add("activo")
  sessionStorage.setItem("page", nPage)
  let info = JSON.parse(sessionStorage.getItem("products"));
  let page = sessionStorage.getItem("page");
  let products = info.slice((page - 1) * 4, page * 4);
  getProducts(products);
  //getPaginatition();
}



async function Search(){ 
  event.preventDefault();
  let buscar = document.querySelector("#searchBar").value; 
  let prodSearch = await getInfoProduct(buscar);

  //await getPaginatition();
  getPaginatition(prodSearch);
}
async function showAll(){
  let info = await getInfoProduct();
  getPaginatition(info);
}
showAll();

//Search();

function setProduct(uuid){
  sessionStorage.setItem("uuid",uuid);
}

async function addShoppingCartInfo(){
  let amount = {
    'amount': Number(document.querySelector("input[value]").value)
  }
  const resp = await fetch("https://products-dasw.herokuapp.com/api/carts/" +sessionStorage.getItem("uuid"),{
    method: 'POST',
    headers:{
      'x-expediente':'727456',
      'x-user': sessionStorage.getItem("user"),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(amount)
  });

  const info = await resp.json();
  console.log(info);
  //return info;
}

