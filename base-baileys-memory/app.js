const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { delay } = require('@whiskeysockets/baileys')



const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer("Este es el flujo welcome", {
        delay: 100, //Retraso para que el bot conteste
        media: "" //Para enviar imagenes 
    },
    //ctx es lo que el usuario ingresa y el ctxFn es lo que el bot manda
        async(ctx, ctxFn) => {
            if (ctx.body.includes("Casas")){
                await ctxFn.flowDinamyc("Hola escribiste casas")
            } else {
                await ctxFn.flowDinamyc("Hola escribiste otra cosa")
            }
            console.log(ctx.body)
        }) 

const menuFlow = addKeyword("Menu").addAnswer(
    "Este es el menu, elige opcion 1,2,3,4,5 o 0",
    {capture : true},
    async (ctx, {gotoFlow, fallBack, flowDinamyc}) => {
        if (!["1", "2", "3","4","5","0"].includes(ctx.body)){
            return fallBack(
                "Respuesta no valida, porfavor elige una de las opciones"
            );
        }
        switch (ctx.body){
            case "1":
                return await flowDinamyc("menu1");
            case "2":
                return await flowDinamyc("menu2");
            case "3":
                return await flowDinamyc("menu3");
            case "4":
                return await flowDinamyc("menu4");
            case "5":
                return await flowDinamyc("menu5");
            case "0":
                return await flowDinamyc(
                    "Saliendo..."
                );
        }
    }
);

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome, menuFlow])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
