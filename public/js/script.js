// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  
  async function search() {
   let country = document.getElementById("searchInput").value;
   if(!country) return;
 
   let res = await fetch(`/search?location=${encodeURIComponent(country)}`);
   let listings = await res.json();
  
  let result = document.getElementById("search");
  search.innerHtml = "";

  if(listings.length === 0) {
    result.innerHTML = "No results found";
    return;
  }

  listings.forEach(listing => {
    let div = document.createElement('div');
    div.textContent = ` ${listing.title} - ${listing.country}`;
    result.appendChild(div);
  });
  }
 
 