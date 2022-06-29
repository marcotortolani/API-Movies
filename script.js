
//!     Alternate Home Fonts Title

let i = 1;
const $title = document.querySelector(".title");
const page = window.location.pathname;

// Chequea que la página sea el inicio, sino no realiza nada
if (page === "/index.html"){
    let tempBodyImg = setInterval(() => {
     
        if (i===7){
            $title.classList.remove(`font-${i}`);
            $title.classList.add(`font-1`);
            i=1;
         
        }else{
            $title.classList.remove(`font-${i}`);
            $title.classList.add(`font-${i+1}`);
            i++;
        }
    }, 5000);
}


const d = document,
        $table = d.querySelector(".movie-table"),
        $form = d.querySelector(".movie-form"),
        $movieBtn = d.querySelector(".movie-btn"),
        $frame = d.querySelector(".movie-frame"),
        $infoExtra = d.querySelector(".info-extra"),
        $loader = d.querySelector(".loader"),
        $template = d.getElementById("movie-template").content,
        $template2 = d.getElementById("movie-template-2").content,
        $fragment = d.createDocumentFragment();



d.addEventListener("submit", async e => {
    console.log("submit comienza");
    

    if(e.target === $form){
        e.preventDefault();

        //colocar icono upload
        $loader.classList.remove(`hide-info`);

        //limpiar pantalla
        $table.removeChild($table.querySelector("tbody"));
        
        const searchName = $form.querySelector(".name").value;
    
            try {               
                let res = await fetch (`https://imdb-api.com/en/API/SearchMovie/k_76c2q6yk/${searchName}`),
                    json = await res.json();
                
                if(!res.ok) throw {status: res.status, statusText: res.statusText};
                

                console.log(json);

                json.results.forEach(el => {
                    $template.querySelector(".movie-image").src = el.image;
                    $template.querySelector(".movie-image").alt = el.title;
                    $template.querySelector(".movie-name").textContent = el.title;
                    $template.querySelector(".movie-btn").dataset.id = el.id;
                    $template.querySelector(".movie-frame").classList.add(`${el.id}`);

                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);
                    $template.querySelector(".movie-frame").classList.remove(`${el.id}`);
                });
                
                let tbody = d.createElement("tbody");
                $table.appendChild(tbody);
                $table.querySelector("tbody").appendChild($fragment);
                $loader.classList.add(`hide-info`);

                $form.querySelector(".name").value = "";
                
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                console.log(err);
                $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
                
            }
        
    }

    
});



d.addEventListener("click", async e => {

    if(e.target.matches(".movie-btn")){

        const searchId = e.target.dataset.id;
    
            try {               
                let res = await fetch (`https://www.omdbapi.com/?i=${searchId}&apikey=ff65f032`),
                    json = await res.json();

                if(!res.ok) throw {status: res.status, statusText: res.statusText};
                                      
                $template2.querySelector(".info-title").textContent = json.Title;
                $template2.querySelector(".info-released").textContent = `Year Released: ${json.Released}`;
                $template2.querySelector(".info-genre").textContent = `Genre: ${json.Genre}`;
                $template2.querySelector(".info-director").textContent = `Director: ${json.Director}`;
                $template2.querySelector(".info-actors").textContent = `Actors: ${json.Actors}`;
                $template2.querySelector(".info-plot").textContent = `Plot: ${json.Plot}`;
                $template2.querySelector(".info-rating").textContent = `IMDb Rating: ${json.imdbRating}`;

                let $clone = d.importNode($template2, true);
                $fragment.appendChild($clone);
                $table.querySelector(`.${searchId}`).appendChild($fragment);
                
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                console.log(err);
                $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
                
            }
    }

    if(e.target.matches(".close-info")){
       e.target.parentElement.closest('tr').classList.toggle(`hide-info`);
    }
}); 
