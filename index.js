const Discord = require( 'discord.js' )
const client = new Discord.Client()
const fetch = require('node-fetch')
const mySecret = process.env['TOKEN']
const Database = require('@replit/database')
const db = new Database()


const sadWords = ['sad', 'depressed', 'miserable', 'awful', 'pain', 'melancholy', 'unhappy', 'melancholic', 'sucks', 'misery', 'adc', 'hunter', 'bad', 'upset', 'unfortunate']
const starterEncouragements = ['You got it, champ', 'Buck up, kiddo!', 'I don\'t know pal', 'Fuck you', 'Do it, pussy', 'Every little thing is gonna be alright', 'Baby don\'t worry bout a thing']

db.get('encouragements').then(encouragement => {
  if( !encouragement || encouragement.length < 1 ){
    db.set('encouragements', starterEncouragements)
  }
})


function getQuote(){
  return fetch('https://zenquotes.io/api/random')
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]['q'] + '  -  ' + data[0]['a']
    })
}

function updateEncouragements(encourageingMessage){
  db.get('encouragements').then(encouragement => {
    encouragements.push([encouragingMessage])
    db.set('encouragments', encouragements)
  })
}

function deleteEncouragement(index){
  db.get('encouragements').then(encouragements => {
    if( encouragements.length > index ){
      encouragements.splice(index, 1)
      db.set('encouragements', encouragements)
    }
  })
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', msg => {
  if( msg.author.bot ) return
  
  if( msg.content === '/inspire' ){
    getQuote().then(quote => msg.channel.send(quote))
  }

  if( sadWords.some(word => msg.content.includes(word))) {
    const encouragement = starterEncouragements[Math.floor(Math.random() * starterEncouragements.length)]
    msg.reply(encouragement)
  }

  if (msg.content.startsWith("$new")) {
    encouragingMessage = msg.content.split("$new ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }

  if (msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del ")[1])
    deleteEncouragment(index)
    msg.channel.send("Encouraging message deleted.")
  }
  
})

client.login(mySecret)

