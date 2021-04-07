
//ELEMENTS//
const trackdiv = document.querySelector('.tracks')
const menuList = document.querySelector('#menu-list')
const signUpForm = document.querySelector('#signup-form')
const heartDiv = document.querySelector('.wrapper')
const userInput = signUpForm.querySelector('input')
const carousel = document.querySelector('.carousel')

let category 
let currentUser
let currentUserId
let heartId
let categoryAudioArr = []


// FUNCTIONS // 
renderLoginForm()
renderSignUpForm()
renderAllAudio()

function renderAllAudio(){
   
    menuList.addEventListener('click', function(e){
        trackdiv.innerHTML = ''
        if (e.target.matches('#favorites')) {
            fetch(`https://polar-beyond-99960.herokuapp.com//users/${currentUserId}`)
            .then(res => res.json())
            .then(userObj => renderFavList(userObj))
            renderMyFavTitle()
        } else {
            category = e.target.textContent
            let arr = []
            fetch('https://polar-beyond-99960.herokuapp.com/audios')
            .then(resp => resp.json())
            .then(audioArr => {
                audioArr.forEach((audioObj) => {
                    if (audioObj.category === category){
                        arr.push(audioObj)
                        categoryAudioArr.push(audioObj)
                    }
                })
               
                arr.forEach(audio => {
                    // renderCategory(audio)
                    let track = document.createElement('audio')
                    track.setAttribute('controls', 'controls')
                    track.canPlayType('audio/mpeg')
                    track.setAttribute('src', audio.audio_path)
                    let meditationList = document.createElement('li')
                    meditationList.setAttribute('class', "meditation-list")
                    meditationList.textContent = audio.name 
                    
                    meditationList.append(track)
                    trackdiv.append(meditationList)
                    // trackdiv.append(track)
                    renderHeart(audio)
                })
                    //debugger
                    let firstAudio = categoryAudioArr[0]
                    renderCategory(firstAudio)
            })  
        } 
    })
}  

function renderMyFavTitle() {
    let favTitle = document.querySelector('h4')
    favTitle.textContent = 'My Favorite List'
    carousel.append(favTitle)
}

function renderCategory(firstAudio){
   // console.log(audioObj.category)
    carousel.innerHTML = ''
    let title = document.createElement('h4')
    title.textContent = firstAudio.category
    carousel.append(title)
    categoryAudioArr = []
}


function renderHeart(audio){
    
    const heartBox = document.createElement('button')
    const whiteHeart = '🤍 '
    const redHeart = '❤️'
    heartBox.dataset.id = audio.id
    heartBox.textContent = whiteHeart

    audio.users.forEach(user => {
        if (user.id == currentUserId){
            heartBox.textContent = redHeart
        }
    })

    heartBox.setAttribute('id', 'heart')
    trackdiv.append(heartBox)

    heartBox.addEventListener('click', function(e){
        const like = heartBox.textContent;
          if(like == whiteHeart) {
            heartBox.textContent = redHeart;
            heartId = audio.id
            addAudioToCurrentList(audio)
        } else {
            heartBox.textContent = whiteHeart;
            removeAudioFromCurrentList(heartId)
        }
        
    })
}


function removeAudioFromCurrentList(heartId){
    fetch(`https://polar-beyond-99960.herokuapp.com/favorites/${heartId}`, {
        method: 'DELETE'
    })

}

function addAudioToCurrentList(audio){
    fetch(`https://polar-beyond-99960.herokuapp.com/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            user_id: currentUserId,
            audio_id: audio.id
        })
    })
    .then(res => res.json())
    .then(addedAudio => {
        heartId = addedAudio.id
        // let permFavId = document.querySelector(`button[data-id='${addedAudio.audio.id}']`)
        // permFavId = heartId
    })
}
        

function renderFavList(userObj){
    console.log(userObj)
    userObj.audios.forEach(audio => {

        let track = document.createElement('audio')
        track.setAttribute('controls', 'controls')
        track.canPlayType('audio/mpeg')
        track.setAttribute('src', audio.audio_path)
        let meditationList = document.createElement('li')
        meditationList.setAttribute('class', "meditation-list")
        meditationList.textContent = audio.name 
        
        meditationList.append(track)
        trackdiv.append(meditationList)
        renderFavHeart(meditationList)
    })
}



function renderFavHeart(meditationList){
    const heartBox = document.createElement('button')
    const whiteHeart = '🤍 '
    const redHeart = '❤️'

    heartBox.textContent = redHeart

    heartBox.setAttribute('class', 'fav-heart')
    meditationList.append(heartBox)

    heartBox.addEventListener('click', function(e){
            heartBox.textContent = whiteHeart;
            removeAudioFromCurrentList(heartId)
            trackdiv.removeChild(e.target.closest('li'))       

    })
}



function renderLoginForm(){
  const form = document.createElement('form')
  form.classList.add('row', 'g-3')
  form.dataset.id = "login"

  const userInput = document.createElement('div')
  const inputLabel = document.createElement("label")
  inputLabel.setAttribute("for", "username")
  inputLabel.setAttribute("class", "visually-hidden")

  const usernameInput = document.createElement("input")
  usernameInput.setAttribute("type", "username")
  usernameInput.setAttribute("id", "usernameInput")
  usernameInput.setAttribute("placeholder", "Username")
  
  const divSubmit = document.createElement("div")
  
  const button = document.createElement("button")
  button.setAttribute("type", "submit")
  button.classList.add("btn", "btn-primary", "mb-3")
  button.textContent = "Login"
  
  userInput.append(inputLabel, usernameInput)
  divSubmit.append(button)
  form.append(userInput, divSubmit)
  signUpForm.append(form)
  
  form.addEventListener('submit', function(e){

      usernameInput.textContent = userInput.querySelector('input').value
      currentUser = usernameInput.textContent
     
      e.preventDefault()

      fetch('https://polar-beyond-99960.herokuapp.com/users')
      .then(res => res.json())
      .then(users => getUser(users))
  })
}

function getUser(users){
    
    users.forEach(user => {
       if  (user.username === currentUser){
            currentUserId = user.id
           renderMainMenu(user.id)
           signUpForm.innerHTML = ''
       }
    })
}

function renderMainMenu(user){

    menuList.innerHTML = ''
    // console.log(user)
    const medLi = document.createElement('li')
    medLi.setAttribute('id', 'meditation')
    medLi.textContent = 'Meditation'

    const sleepLi = document.createElement('li')
    sleepLi.setAttribute('id',"sleep")
    sleepLi.textContent = 'Sleep'

    const relaxLi = document.createElement('li')
    relaxLi.setAttribute('id',"relaxation")
    relaxLi.textContent = 'Relaxation'

    const favLi = document.createElement('li')
    favLi.setAttribute('id',"favorites")
    favLi.textContent = 'My Favorites'

    menuList.append(medLi, sleepLi, relaxLi, favLi)
}

function renderSignUpForm(){
  const form = document.createElement("form")
    form.classList.add("row", "g-3")
    form.id = "register"

    const divUserInput = document.createElement("div")
    // divUserInput.classList.add("col-auto")

    const inputLabel = document.createElement("label")
    inputLabel.setAttribute("for", "username")
    inputLabel.setAttribute("class", "visually-hidden")

    const usernameInput = document.createElement("input")
    usernameInput.setAttribute("type", "new-username")
    usernameInput.setAttribute("name", "new-username")
    // usernameInput.classList.add("form-control")
    usernameInput.setAttribute("id", "usernameInput")
    usernameInput.setAttribute("placeholder", "Username")

    const divSubmit = document.createElement("div")
    // divSubmit.classList.add("col-auto")

    const button = document.createElement("button")
    button.setAttribute("type", "submit")
    button.classList.add("btn", "btn-primary", "mb-3")
    button.textContent = "Register"

    divUserInput.append(inputLabel, usernameInput)
    divSubmit.append(button)
    form.append(divUserInput, divSubmit)
    signUpForm.append(form)

    signUpForm.addEventListener('submit', function(e){
        e.preventDefault()

        let newUser = e.target.usernameInput.value

        fetch('https://polar-beyond-99960.herokuapp.com/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: newUser
            })
        })
        .then(res => res.json())
        .then(newUser => {
            renderMainMenu(newUser)
        })
        signUpForm.innerHTML = " "

    })
}