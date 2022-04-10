async function getInfoCart(){
    const resp = await fetch("https://products-dasw.herokuapp.com/api/carts",{
        method: 'GET',
        headers: {
            'x-expediente':'727456',
            'x-user': sessionStorage.getItem("user"),
        }
    });
    const info = await resp.json();
    //console.log(info);
    return info;
}

async function getProductCart(){
    const info = await getInfoCart();
    let divProdCart = document.querySelector("#cart");

    divProdCart.innerHTML = info.cart.map(prod =>`
    <div class="media border border-muted">
            <div class="media-body mx-3 my-3">
              <h5 class="mt-0" style="color: lightcoral">
                ${prod.product.title}
                <span class="badge badge-danger" id="trash" onclick="deleteProduct('${prod.product.uuid}')">
                <i class="bi bi-trash"></i>
                </span>
              </h5>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Cantidad:</span>
                </div>
                <input type="number" class="form-control col-5" id="amountProd${prod.product.uuid}" value="${prod.amount}" disabled/>
                <div class="input-group-append" >
                  <span class="input-group-text text-light bg-info" id="pencil${prod.product.uuid}" onclick="EditPencil('${prod.product.uuid}')">
                  <i class="bi bi-pencil"></i>
                  </span>
                  <span class="input-group-text text-light bg-success d-none" id="check${prod.product.uuid}" onclick="checkEdit('${prod.product.uuid}')">
                  <i class="bi bi-check2-circle"></i>
                  </span>
                  <span class="input-group-text text-light bg-danger d-none" id="cancel${prod.product.uuid}" onclick="Cancel('${prod.product.uuid}')">
                  <i class="bi bi-x-octagon"></i>
                  </span>
                </div>
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Precio:</span>
                </div>
                <input
                  type="text"
                  class="form-control col-4"
                  value="${prod.product.pricePerUnit}"
                  disabled=""
                />
                <div class="input-group-append">
                  <span class="input-group-text">$m.n.</span>
                </div>
              </div>
            </div>
            <div class="media-right">
              <img
                class="mr-3"
                src="${prod.product.imageUrl}"
                alt="Generic placeholder image"
                width="150px"
              />
            </div>
          </div>
    `).join("");
}

function showButtons(){
    let cart = document.getElementById("pencil");
}

function EditPencil(uuid){
    //Pencil
    document.getElementById("pencil"+uuid).classList.add("d-none");
    //Check
    document.getElementById("check"+uuid).classList.remove("d-none");
    //Cancel
    document.getElementById("cancel"+uuid).classList.remove("d-none");
    //Enable Cantidad
    document.getElementById("amountProd"+uuid).disabled = false;
}

async function checkEdit(uuid){
    let amount = {
        'amount': Number(document.getElementById("amountProd"+uuid).value)
    }
    const resp = await fetch("https://products-dasw.herokuapp.com/api/carts/" +uuid,{
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

  getProductCart();
  getTotalCart();
}

function Cancel(uuid){
    //Cancel
    document.getElementById("cancel"+uuid).classList.add("d-none");
    //Check
    document.getElementById("check"+uuid).classList.add("d-none");
    //Pencil
    document.getElementById("pencil"+uuid).classList.remove("d-none");
    //Disable Cantidad
    document.getElementById("amountProd"+uuid).disabled = true;
}

async function deleteProduct(uuid){
    document.getElementById("trash");

    const resp = await fetch("https://products-dasw.herokuapp.com/api/carts/"+uuid,{
        method: 'DELETE',
        headers: {
            'x-expediente':'727456',
            'x-user': sessionStorage.getItem("user"),
        }
    });
    
    getProductCart();
}

async function getTotalCart(){
    const info = await getInfoCart();
    let divInfoTotal = document.querySelector("#producto");

    divInfoTotal.innerHTML = `
    <h5 class="card-title" style="color: lightcoral">
                Total de Compra
              </h5>
              <div style=" border-top: 1px solid #888; padding-top: 7px; font-size: 85%;" id="total"></div>
    ${  
             info.cart.map(prod => `  
                <p class="card-text">
                  ${prod.product.title}: ${prod.amount} x $${prod.product.pricePerUnit}: $${prod.amount * prod.product.pricePerUnit}
                </p> `).join("")
    }             
    <div style="border-top: 1px solid #888; padding-top: 15px; font-size: 85%;"></div>
    <p class="card-text" style="padding-top:0px; padding-bottom:10px">Monto a pagar: $${info.total}</p>
    `
}

showButtons();

getProductCart();

getTotalCart();