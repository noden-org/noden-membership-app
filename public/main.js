import { QRious } from 'https://cdn.skypack.dev/@zedvision/qrious';

const queryString = window.location.search.substring(1)

const nameText = document.getElementById('name-text')
const emailBox = document.getElementById('email-box')
const statusLabel = document.getElementById('status-label')
const qrCode = document.getElementById('qrcode')
const manageMembershipLink = document.getElementById('manage-membership-link')

if (queryString.startsWith('email')) {

    emailBox.value = queryString.substring(queryString.indexOf('=') + 1);
    checkEmail(emailBox.value)
}

async function checkMembership() {

    let info = {}

    // TODO
    info.cid = 123
    info.name = 'Name'
    info.status = 'active'
    await new Promise(r => setTimeout(r, 1000));
    ////

    switch (info.status) {
        case 'active':
            return Promise.resolve(info)
        case 'inactive':
            return Promise.reject(info)
        case 'not-found':
            return Promise.reject(info)
    }
}

async function checkEmail(email) {

    if (email.match(/\@(.*)\../g) == null) {
        return
    }

    updateStatusLabel('checking...', 'gray')

    await checkMembership()
        .then((info) => {

            nameText.innerHTML = `<b>Hey there ${info.name}!</b> You can bookmark <a href="https://membership.noden.org?email=${email}">this</a> page for easier checking next time.`

            updateStatusLabel('Active', 'green')

            new QRious({
                element: qrCode,
                value: `https://membership.noden.org?email=${email}`
            });

            manageMembershipLink.hidden = false
        })
        .catch((info) => {

            switch (info.status) {
                case 'inactive':
                    nameText.innerHTML = `<b>Welcome back ${info.name}!</b> Care to join again?`
                    break;
                case 'not-found':
                    nameText.innerHTML = `<b>Hello there stranger!</b> Care to join?`
                    break;

            }

            let signUplink = `https://app.moonclerk.com/pay/1jxtp83bttl8?email=${email}`

            updateStatusLabel('Sign up', 'orange', signUplink)
        })
}

function updateStatusLabel(text, color, link) {

    statusLabel.innerHTML = text
    statusLabel.style.backgroundColor = color

    if (link != undefined) {
        statusLabel.href = link
    }
}

emailBox.addEventListener('input', (input) => {

    const email = input.target.value
    checkEmail(email)
})