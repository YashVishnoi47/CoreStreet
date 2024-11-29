// console.log("script is working")

// setTimeout(() => {
//   const flashMessage = document.getElementById("flash-message");
//   if (flashMessage) {
//     flashMessage.style.opacity = "0";
//     setTimeout(() => flashMessage.remove(), 500); 
//   }
// }, 2000); 

const flashMessage = document.getElementById("flash-message");
document.querySelector(".error-flex-btn-remove").addEventListener("click", () =>{
  flashMessage.remove();
})




const resnav = document.querySelector("#res-nav");
const navbtn = document.querySelector("#menu-btn");


navbtn.addEventListener("click",function(){

  if(resnav.style.display === "none"){
    resnav.style.display = "block";
  }
  else{
    resnav.style.display = "none";
  }

})


// Rating Star Logic







