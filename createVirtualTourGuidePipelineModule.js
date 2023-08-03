import {getTourGuideMessages} from './tour-guide-data'

const createVirtualTourGuidePipelineModule = () => {
  const displayMessage = (message) => {
    const previousMessages = document.querySelectorAll('.tour-guide-message')
    previousMessages.forEach((messageElement) => {
      messageElement.remove()
    })

    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageElement.classList.add('tour-guide-message')
    messageElement.style.top = `${getRandomNumber(10, 90)}%`
    messageElement.style.left = `${getRandomNumber(10, 80)}%`
    document.body.appendChild(messageElement)
  }

  const getRandomNumber = (min, max) => Math.random() * (max - min) + min

  const showTourGuideMessage = (message, delay) => {
    setTimeout(() => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      const messageElement = document.createElement('p')
      messageElement.innerText = message
      messageElement.classList.add('tour-guide-message')

      const messageWidth = messageElement.offsetWidth
      const messageHeight = messageElement.offsetHeight

      const posX = Math.floor(Math.random() * (screenWidth - messageWidth))
      const posY = Math.floor(Math.random() * (screenHeight - messageHeight))

      messageElement.style.left = `${posX}px`
      messageElement.style.top = `${posY}px`

      document.body.appendChild(messageElement)
    }, delay)
  }

  const startTourGuide = () => {
    const tourGuideMessages = getTourGuideMessages()  // Retrieve the tour guide messages

    let currentMessageIndex = 0
    const showMessage = () => {
      const message = tourGuideMessages[currentMessageIndex]
      displayMessage(message)
      currentMessageIndex = (currentMessageIndex + 1) % tourGuideMessages.length
    }

    showMessage()

    document.addEventListener('click', showMessage)
  }

  return {
    name: 'virtualtourguide',

    onStart: () => {
      startTourGuide()
    },
  }
}

export default createVirtualTourGuidePipelineModule
