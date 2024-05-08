import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Translator.css'; 

const Translator = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('');
    const [supportedLanguages, setSupportedLanguages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSupportedLanguages();
    }, []);

    const fetchSupportedLanguages = async () => {
        try {
            const response = await axios.get(
                'https://google-translate1.p.rapidapi.com/language/translate/v2/languages',
                {
                    headers: {
                        'X-RapidAPI-Key': '1d625a22b6msh15a3564bf72f4b9p1427bfjsn34c93c852d7c',
                        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                    }
                }
            );
            setSupportedLanguages(response.data.data.languages);
            console.log('Response from language API:', response.data);    
        } catch (error) {
            setError('Error fetching supported languages. Please try again later.');
        }
    };

    const translateText = async () => {
        try {
            const response = await axios.post(
                'https://google-translate1.p.rapidapi.com/language/translate/v2',
                new URLSearchParams({
                    q: inputText,
                    source: sourceLanguage,
                    target: targetLanguage
                }),
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'X-RapidAPI-Key': '1d625a22b6msh15a3564bf72f4b9p1427bfjsn34c93c852d7c',
                        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                    }
                }
            );
            setTranslatedText(response.data.data.translations[0].translatedText);
        } catch (error) {
            setError('Error translating text. Please try again later.');
        }
    };

    const detectLanguage = async () => {
        try {
            const response = await axios.post(
                'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
                new URLSearchParams({
                    q: inputText
                }),
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'X-RapidAPI-Key': '1d625a22b6msh15a3564bf72f4b9p1427bfjsn34c93c852d7c',
                        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                    }
                }
            );
            setSourceLanguage(response.data.data.detections[0][0].language);
        } catch (error) {
            setError('Error detecting language. Please try again later.');
        }
    };

    useEffect(() => {
        if (inputText) {
            detectLanguage();
        }
    }, [inputText]);

    return (
        <div className="translator-container">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
            />
            <div className="dropdown-container">
                <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
                    <option value="" style={{ color: 'black', backgroundColor: 'white' }}>Select source language</option>
                    {supportedLanguages.map((lang) => (
                        <option key={lang.language} value={lang.language} style={{ color: 'black', backgroundColor: 'white' }}>
                            {lang.language}
                        </option>
                    ))}
                </select>
                <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                    <option value=" " style={{ color: 'black', backgroundColor: 'white' }}>Select target language</option>
                    {supportedLanguages.map((lang) => (
                        <option key={lang.language} value={lang.language} style={{ color: 'black', backgroundColor: 'white' }}>
                            {lang.language}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={translateText}>Translate</button>
            {error && <p className="error-message">{error}</p>}
            {translatedText && (
                <div className="translated-text-container">
                    <h3>Translated Text:</h3>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default Translator;
