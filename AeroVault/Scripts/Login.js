const username = document.getElementById('username')
const password = document.getElementById('password')
const form = document.getElementById('form')
const errorElement = document.getElementById('error')
const errorElement2 = document.getElementById('error2')

form.addEventListener('submit', (e) => {
    let messages = []
    let messages2 = []
    if (username.value.trim() === '') {
        messages.push('*Please enter username')
    } else if (username.value.length < 5) {
        messages.push('*username must be at least 5 characters long')
    } else {
        messages.push()
    }

    if (password.value.trim() === '') {
        messages2.push('*Please enter password')
    } else if (password.value.length < 5) {
        messages2.push('*Password must be at least 5 characters long')
    } else {
        messages2.push()
    }

    if (messages.length > 0 || messages2.length > 0) {
        e.preventDefault()
        errorElement.innerText = messages.join(', ')
        errorElement2.innerText = messages2.join(', ')
    }


})