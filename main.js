const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOTITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const API_URL_FAVOTITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;


const spanError = document.getElementById('error')

async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');


    //importante:
    /* La primera forma, con la función de flecha, 
    es más común y generalmente preferida cuando
    asignas funciones a eventos. La segunda forma 
    ejecutaría la función inmediatamente y asignaría 
    su resultado al evento, lo cual puede no ser el 
    comportamiento deseado en la mayoría de los casos. */
    btn1.onclick = () => saveFavouritemichi(data[0].id);
    btn2.onclick = () => saveFavouritemichi(data[1].id);
    
    img1.src = data[0].url;
    img2.src = data[1].url;
  }
}

async function loadFavoritesMichis() {
  const res = await fetch(API_URL_FAVOTITES, {
    method: 'GET',
    headers: {
        'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46',
    },
  });
  const data = await res.json();
  console.log('Favoritos')
  console.log(data)
  const section = document.getElementById('favoritesMichis')

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  }else{
    section.innerHTML="";
    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode("Michis favoritos");
    h2.appendChild(h2Text);
    section.appendChild(h2)
    data.forEach(michi => {
        
        const article = document.createElement('article');
        const img = document.createElement('img');
        const btn = document.createElement('button');
        const btnText = document.createTextNode('Sacar al michi de favoritos');
        
        img.width = 150;
        img.height = 150
        btn.appendChild(btnText);
        img.src=michi.image.url
        btn.onclick = () => deleteFavouritemichi(michi.id);
        article.appendChild(img);
        article.appendChild(btn);

        section.appendChild(article)
    }
    );
  }}

async function saveFavouritemichi(id){
    const res = await fetch(API_URL_FAVOTITES,{
        method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46',

        },
        body:JSON.stringify({
            image_id: id
        }), 
    })

    const data= await res.json()
    console.log('save')
    console.log(res)
    console.log(data)

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
      }
    else{
        console.log("michi guardado en favoritos")
        loadFavoritesMichis()
    }
}

async function deleteFavouritemichi(id){
    const res = await fetch(API_URL_FAVOTITES_DELETE(id),{
        method: 'DELETE',
        headers:{'X-API-KEY':'c08d415f-dea7-4a38-bb28-7b2188202e46',
                }
        
    })

    const data= await res.json()
    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
      }
    else{
        console.log("michi sacado de favoritos")
        loadFavoritesMichis();
    }
}

async function uploadMichiphoto(){
     const form=document.getElementById('uploadingForm')
     const formData = new FormData(form);
     console.log(formData.get('file'))

     const res=await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers:{
            //'Content-Type':'multipart/form-data',
            'X-API-KEY':'c08d415f-dea7-4a38-bb28-7b2188202e46',
        },
        body:formData,
     })
     const data=await res.json();

     if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
      }
    else{
        console.log("foto michi subida")
        console.log({data})
        console.log(data.url)
        saveFavouritemichi(data.id);
    }
}


loadRandomMichis();
loadFavoritesMichis();
