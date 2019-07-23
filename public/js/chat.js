const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $messageFormLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messageTemplate, {
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm A')
        })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) =>{
    console.log(url)
    const html = Mustache.render($locationTemplate, { url })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) =>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error) {
            return console.log(error)
        }
        console.log('delivered!')
    })
})

$messageFormLocation.addEventListener('click', () =>{

    $messageFormLocation.setAttribute('disabled', 'disabled')

    if(!navigator.geolocation) {
        return alert('Current browser does not support geolocation!')
    }

    navigator.geolocation.getCurrentPosition((position) =>{
        
        socket.emit('location', {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        }, (error) =>{
            if(error) {
                return console.log(error)
            }
            console.log('delivered!')
            $messageFormLocation.removeAttribute('disabled')
        })
    })
})