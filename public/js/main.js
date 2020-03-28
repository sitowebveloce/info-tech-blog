//******** REPLACE TEXTAREA WITH RICH TEXT EDITOR */

ClassicEditor
  .create(document.querySelector('.editor'), {

    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: 'http://localhost:3000/uploads',

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        'X-CSRF-TOKEN': 'CSFR-Token',
        Authorization: 'Bearer <JSON Web Token>'
      }
    }
  })
  .catch(error => {
    console.error(error);
  });


//******************* DELETE FUNCTION */
// Set variables fetch password from backend
let pa = '';

let fetchPs = async () => {
  try {
    let myHeaders = new Headers();
    let myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };
    let url = 'http://localhost:3000/secretrouteapi';
    let pass = await fetch(url, myInit);
    if (pass.ok) { // if HTTP-status is 200-299
      // get the response body (the method explained below)
      let json = await pass.json();
      // console.log(json.data)
      pa = json.data
    } else {
      alert("HTTP-Error: " + pass.status);
    }

  } catch (err) {
    if (err) console.log(err);
  }
}
// Run fetch
fetchPs();
// Variable
let showDeleteBtn = false;
// Toggle variable
function toggleDeleteDiv(id) {
  console.log(id)
  let btnDelShow = document.querySelector(`.confirm-del-btn-${id}`);
  let conf = confirm('Ara you sure?');
  if (!conf) {
    alert('Be aware.')
  } else {

    let pass = prompt('Password');
    // console.log(pa);
    if (pass === `${pa}`) {
      showDeleteBtn = !showDeleteBtn;
      showDeleteDiv(id);
    } else {
      alert('Permissions denied.')
    }
  }
}
// Add and remove class based on variable value true or false
function showDeleteDiv(id) {
  if (showDeleteBtn) {
    // console.log(`.info-btn-del, .${id}`);
    // console.log(`.confirm-del-btn, .${id}`);
    // let dv1 = document.getElementsByClassName(`info-btn-del ${id}`);
    let dv2 = document.querySelector(`.info-btn-del-${id}`);
    // console.log(dv1)
    console.log(dv2)
    // dv1.classList.add('show-del');
    dv2.classList.remove('hide');
    // let bt1 = document.getElementsByClassName(`confirm-del-btn ${id}`)
    let bt2 = document.querySelector(`.confirm-del-btn-${id}`)
    // console.log(bt1)
    console.log(bt2)

    // bt1.style.display = 'none';
    bt2.style.display = 'none';
  } else {
    // let dv1 = document.getElementsByClassName(`confirm-del-btn ${id}`)
    let dv2 = document.querySelector(`.info-btn-del-${id}`)
    // dv1.classList.remove('show-del');
    dv2.classList.add('hide');
    // let bt1 = document.getElementsByClassName(`confirm-del-btn ${id}`)
    let bt2 = document.querySelector(`.confirm-del-btn-${id}`)
    // bt1.style.display = 'block';
    bt2.style.display = 'block';
  }
}


