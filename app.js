const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6395587537:AAEi2pxwrjKrOg4yfnRgnxnB7vM_IYalRNI', { polling: true });
const chatId = '2095687147';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('load', async () => {
    let numMenores = 0;
    let numMaiores = 0;
    let firstNum = null;
    let secondNum = null;
    let alertMessageId = null;
    let greens = 0;
    let reds = 0;
    let lista = [];

    while (true) {
      const agora = new Date(); // Obtém a data e hora atual do sistema
      const horaAtual = agora.getHours(); // Obtém a hora atual
      const minutos = agora.getMinutes();

      let novaLista = await atualizaLista(page);
      if (!listasIguais(lista, novaLista)) {
        lista = novaLista;

        if (horaAtual === 0 && minutos === 0) {
          greens = 0; 
          reds = 0;
        }

        if(alertMessageId){
          bot.deleteMessage(chatId, alertMessageId);
          alertMessageId = null;
        }

        if(numMenores === 5){
          firstNum = lista[0];
          if(firstNum>=19 && firstNum<=36){
            greens++
            bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNum +")\n"+greens+" x "+reds);
          } 
      }
      
      if(numMenores === 6){
        secondNum = lista[0];
        if(secondNum>=19 && secondNum<=36){
          greens++;
          bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNum +" | " + secondNum +")\n"+greens+" x "+reds);
        }
      }
      if(numMenores === 7){
        const threeNum = lista[0];
        if(threeNum>=19 && threeNum<=36){
          greens++
          bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNum +" | " + secondNum +" | " + threeNum +")\n"+greens+" x "+reds);
        }else{
          reds++;
          bot.sendMessage(chatId,"RED 🔻(" + firstNum +" | " + secondNum +" | " + threeNum +")\n"+greens+" x "+reds);
        }
      }

      if(numMaiores === 5){
        firstNum = lista[0];
        if(firstNum>=1 && firstNum<=18){
          greens++;
          bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNum +")\n"+greens+" x "+reds);
        } 
    }
    if(numMaiores === 6){
      secondNum = lista[0];
      if(secondNum>=1 && secondNum<=18){
        greens++;
        bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNum +" | " + secondNum +")\n"+greens+" x "+reds);
      }
    }
    if(numMaiores === 7){
      const threeNum = lista[0];
      if(threeNum>=1 && threeNum<=18){
        greens++;
        bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNum +" | " + secondNum +" | " + threeNum +")\n"+greens+" x "+reds);
      }else{
        reds++;
        bot.sendMessage(chatId,"RED 🔻(" + firstNum +" | " + secondNum +" | " + threeNum +")\n"+greens+" x "+reds);
      }
    }

      if(lista[0]>=1 && lista[0]<=18){
          numMenores++;
          numMaiores = 0;
          console.log("Numeros menores: " + numMenores + " Ultimo n: " + lista[0]);
          if(numMenores === 4 ){
            let message = "🚨Atentos possivel entrada";
            bot.sendMessage(chatId, message).then(msg => {
                alertMessageId = msg.message_id;
            });
        }
          if(numMenores === 5) {
            let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA BRASILEIRA\n🔥 Entrada nos números maiores\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + lista[0] +"*";
            bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
          }
        } 
        if(lista[0]>=19 && lista[0]<=36){
          numMaiores++;
          numMenores = 0;
          console.log("Numeros maiores: " + numMaiores + " Ultimo n: " + lista[0]);
          if(numMaiores === 4 ){
            let message = "🚨Atentos possivel entrada";
            bot.sendMessage(chatId, message).then(msg => {
                alertMessageId = msg.message_id;
            });
        }
          if(numMaiores === 5) {
            let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA BRASILEIRA\n🔥 Entrada nos números menores\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + lista[0] +"*";
            bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
          }
        } 
        if( lista[0] === '0'){
          numMaiores=0;
          numMenores = 0;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
  }
  });

  await page.goto('https://casino.betfair.com/pt-br/c/roleta');
})();

async function atualizaLista(page) {
  const elements = await page.$$('.number');
  let lista = [];

  for (let x = 0; x < 8; x++) {
      const elem = elements[x];
      const elemText = await page.evaluate(element => element.textContent, elem);
      lista.push(elemText);
  }

  return lista;
}

function listasIguais(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
  }
  return true;
}

//arrumar 0, não está contando quando dá green