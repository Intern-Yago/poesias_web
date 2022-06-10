function iniciaModal(Id){
    const pop = document.getElementById(Id)
    if (pop){
        pop.classList.add("activate")
        pop.addEventListener('click',(e)=>{
            if(e.target.id == Id || e.target.className == 'fechar'){
                pop.classList.remove('activate')
            }
        })
    }
}
const gatilho = document.querySelector("#login")
gatilho.addEventListener("click",()=>iniciaModal("pop"))