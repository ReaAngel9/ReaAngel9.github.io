async function getInfoProducts(category, minPrice, maxPrice){
    let min = Number(minPrice);
    let max = Number(maxPrice);

    let search = [];
    if(category) search.push("category="+category);
    if(min > 0) search.push("min="+minPrice);
    if(max > 0) search.push("max="+maxPrice);

    let query = search.join('&');
    query = (query) ? '?' + query : "";

    //let queryParams = value ? "?title=" + value : "";
    const resp = await fetch("https://products-dasw.herokuapp.com/api/products"+query,{
        method: 'GET',
        headers: {
            'x-expediente':'727456',
            'x-auth': 'admin',
        }
    });
    const info = await resp.json();
    //console.log(info);
    return info;
}

async function getProductsTable(info){
    //const info = await getInfoProducts();
    let table = document.querySelector("tbody#products");

    table.innerHTML = info.map(prod => `
    <tr style="color: lightcoral;">
        <td scope="col" style="color: rgb(172, 90, 98);">${prod.title}</td>
        <td scope="col" style="color: rgb(172, 90, 98);">${prod.description}</td>
        <td scope="col" style="color: rgb(172, 90, 98);">$${prod.pricePerUnit}</td>
        <td scope="col" style="color: rgb(172, 90, 98);">${prod.category}</td>
        <td scope="col" style="color: rgb(172, 90, 98);">${prod.stock}</td>
        <td scope="col" style="color: rgb(172, 90, 98);"><img src="${prod.imageUrl}" style="width: 12rem; height: 60%"></td>
        <td><button type="button" class="btn" data-toggle="modal" data-target="#modelId" style="background-color: lightcoral; color: rgb(255, 214, 214);" onclik="findProd('${prod.uuid}')" >
        Edit
      </button></td>
    </tr>
    `).join("");
}

async function filtersA(){
    event.preventDefault();

    let category = document.getElementById("categoryBar").value;
    let min = document.getElementById("minBar").value;
    let max = document.getElementById("maxBar").value;

    let info = await getInfoProducts(category,min,max);
    getProductsTable(info);
}

async function createProduct(){
    let product = {
        'title': document.getElementById("title").value,
        'description': document.getElementById("description").value,
        'unit': document.getElementById("unit").value,
        'stock': Number(document.getElementById("stock").value),
        'pricePerUnit': Number(document.getElementById("price").value),
        'category': document.getElementById("category").value,
        'imageUrl': document.getElementById("image").value
    }
    
    const resp = await fetch('https://products-dasw.herokuapp.com/api/products' , {
        method: 'POST',
        headers: {
            'x-expediente': '727456',
            'x-auth': 'admin',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    
    let products = await getInfoProducts();
    //console.log(resp);

    getProductsTable(products);
    $('#modelId').modal('hide');
}

async function findProd(uuid){
    sessionStorage.setItem("uuid", uuid);
    let product = await getProductsById(uuid);

    document.getElementById("title").value = product.title;
    document.getElementById("description").value = product.description;
    document.getElementById("unit").value = product.unit;
    document.getElementById("stock").value = product.stock;
    document.getElementById("price").value = product.pricePerUnit;
    document.getElementById("category").value = product.category;
    document.getElementById("image").value = product.imageUrl;

}

async function editProduct(){
    event.preventDefault();

    // document.getElementById("title").value = product.title;
    // document.getElementById("description").value = product.description;
    // document.getElementById("unit").value = product.unit;
    // document.getElementById("stock").value = product.stock;
    // document.getElementById("price").value = product.pricePerUnit;
    // document.getElementById("category").value = product.category;
    // document.getElementById("image").value = product.imageUrl;

    let product = {
        'title': document.getElementById("title").value,
        'description': document.getElementById("description").value,
        'unit': document.getElementById("unit").value,
        'stock': Number(document.getElementById("stock").value),
        'pricePerUnit': Number(document.getElementById("price").value),
        'category': document.getElementById("category").value,
        'imageUrl': document.getElementById("image").value
    }

    const resp = await fetch('https://products-dasw.herokuapp.com/api/products/'+sessionStorage.getItem("uuid"), {
        method: 'PUT',
        headers: {
            'x-expediente': '727456',
            'x-auth': 'admin',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    
    //let products = await getInfoProducts();

    getProductsTable();
    $('#modelId').modal('hide');
}

async function show(){
    let products = await getInfoProducts();
    getProductsTable(products);
}

show();