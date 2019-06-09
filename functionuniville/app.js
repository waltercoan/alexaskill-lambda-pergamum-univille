'use strict';
const Alexa = require('ask-sdk-core');
const request = require('request');
const parse = require('node-html-parser');

const tempLookup = (title) => {

    return new Promise(function(resolve, reject) {
        console.log("Dentro da promise");
        console.log(title);
        request.post({url:'http://pergamum.univille.br/pergamum/mobile/resultado.php', 
                form: {termo_busca: title, buscar_por:'TITULO'}}, 
                function(err,httpResponse,body){
                    var root = parse.parse(body);
                    var result = root.querySelector('h2');
                    console.log(result);
                    var speechText = result.rawText;
                    console.log("Saindo da promise");
                    console.log(speechText);
                    resolve(speechText);
                    
                });
   
    });
    
};

const SearchBooksIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'searchbook';
    },
    async handle(handlerInput) {
        let speechText = 'First found result ';
        let title = handlerInput.requestEnvelope.request.intent.slots.subject.value;
        console.log("Antes de chamar a promise");
        speechText += await tempLookup(title);
        console.log("depois de chamar a promise");
        console.log(speechText);
        return handlerInput.responseBuilder
                            .speak(speechText)
                            .reprompt(speechText)
                            .withSimpleCard('UNIVILLE', speechText)
                            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to UNIVILLE library, ask me about a book title?';
        
        return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('UNIVILLE', speechText)
                .getResponse();
    }
};

const FallbackRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
		&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = 'Sorry I cant understand!';
        
        return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('UNIVILLE', speechText)
                .getResponse();
    }
};

const StopRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
		&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const speechText = 'OK see you later!';
        
        return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('UNIVILLE', speechText)
                .getResponse();
    }
};

const CancelRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
		&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
        const speechText = 'Okay, okay, I can not always help.';
        
        return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('UNIVILLE', speechText)
                .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};
exports.lambdaHandler = Alexa.SkillBuilders.custom()
     .addRequestHandlers(LaunchRequestHandler,
                         SearchBooksIntentHandler,
			             FallbackRequestHandler,
                         StopRequestHandler,
			             CancelRequestHandler,
                         SessionEndedRequestHandler)
     .lambda();