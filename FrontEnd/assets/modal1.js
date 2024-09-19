const openModal=document.getElementById("edit-project");

openModal.addEventListener("click", () => {
// openModal();
openModal.style.display="block";
})

const closeModalBtn=document.getElementById("closeModalBtn");
closeModalBtn.addEventListener ("click", () =>{
 openModal.style.display="none";
})