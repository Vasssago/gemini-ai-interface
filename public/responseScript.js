import { GoogleGenerativeAI } from "@google/generative-ai";
import Showdown from "showdown";

document.addEventListener('DOMContentLoaded', () => {
    const apiKeyHandler = document.getElementById("APIKEY");
    const promptHandler = document.getElementById("prompt");
    const responseHandler = document.getElementById("response");
    const errorLabel = document.getElementById("API_KEY_validation_error");
    const submitButton = document.getElementById("submit");

    const converter = new Showdown.Converter();

    apiKeyHandler.addEventListener('input', (event) => {
        const API_KEY = event.target.value;
        promptHandler.disabled = !(API_KEY.length >= 39);
        submitButton.disabled = !(API_KEY.length >= 39);

        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
        });

        model.generateContent("Hi")
        .then()
        .then()
        .catch(error => {
            let err = error.toString();
            if (err.includes("API key not valid")) {
                errorLabel.style.display = 'contents';
            } else {
                errorLabel.style.display = 'none';
            }
        });
    });

    submitButton.addEventListener("click", () => {
        const prompt = promptHandler.value;
        const API_KEY = apiKeyHandler.value;

        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
        });

        model.generateContent(prompt)
            .then(result => result.response.text())
            .then(text => {
                console.log(text);

                responseHandler.innerHTML = converter.makeHtml(text);
            })
            .catch(err => {
                console.error("!!! ERROR !!!\n" + err)
            });
    });
});