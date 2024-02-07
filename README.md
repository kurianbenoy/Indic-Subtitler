# Indic-Subtitler

> An open source subtitling platform for transcribing videos/audios in Indic languages and translating subtitles as well using ML models.

<!---
![Designer (1)](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/029f32ed-d5a7-4555-a33e-b2fced54c955)
![Designer](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/3cd137bd-8105-4b84-8ccd-0ed662786240)
-->

 <img src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/029f32ed-d5a7-4555-a33e-b2fced54c955" alt="logo1 width="250" height="250">

## Project Objective

The number of tools which are available in Indian languages to subitle audio and videos in Indian languages are almost none. Yet that shouldn't be the case, as now there are lot of open-source models supporting speech transcription in most of official Indian languages.  This tool can be useful for subtitling audios and videos like Indian cinemas for Media Industry in general.


## Project Feasability

Due to advent of new technologies like Meta's seamless M4T model and Whisper fine-tuned models, you can do speech transcription to transcribe audio's from source audio to source text. With this a Hindi audio can be transcribed to Hindi text for generating subtitles. Meta's seamless M4T model also supports translation which can take Hindi audio and generate subtitle in languages like English, French, Malayalam etc.

## Technology stack


### 1. ML Model

I am planning to use Meta's Seamless Communication technology which was recently released[git](https://github.com/facebookresearch/seamless_communication). I am planning to use seamlessM4T_v2_large model,
which supports almost 12 Indic languages [2] by default. With this model alone, we can potentially transcribe audio in respective languages and even translate subtitles into other languages. In lot of Indic languages, there are fine-tuned Whisper ASR models in respective languages. More such models can be found in this Whisper event leaderboard [3]. I have personally fine-tuned Whisper models in my mother tongue malayalam like [4] and [5]. So if performance of any language is not found useful, we can switch to one of the Whisper ASR based models. Yet one thing to note though is, that Whisper might not be able to support all the languages listed in Seamless.


**Indic Languages supported with SeamlessM4T**

1. Assamese
2. Bengali
3. English (Very commonly used)
4. Gujarati
5. Hindi
6. Kannada
7. Malayalam
8. Marathi
9. Odia
10. Punjabi
11. Tamil
12. Telgu
13. Urdu

### 2. Backend API

My plan is use FastAPI as the backend and deploy it on serveless platforms like [Modal.com](https://modal.com/)

### 3. Frontend

Next.js, being a React framework, offers you all the benefits of React plus more features out of the box, such as file-based routing and API routes, which can simplify your development process. It's an excellent choice, especially for a web application that requires server-side rendering (SSR) or static site generation (SSG) for better performance and SEO.

Framework: Next.js (enables SSR and SSG, improving load times and SEO)
Styling: Tailwind CSS or styled-components (for styling with ease and efficiency)

 <img src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/3cd137bd-8105-4b84-8ccd-0ed662786240" alt="logo2 width="250" height="250">

## Roadmap

**Week 1**

- Create API to use Seamless M4T model

**Week 2**

- Start building frontend audio/video upload workflow
- Build API to handle audio/video part

**Week 3**

- Build UI for displaying and downloading subtitles
- Build UI for choose source and target subtitle screenr
- Complete integrating APIs with frontend

**Week 4 onwards**

- Evaluate the performance of Indic subtitler on various languages
- Fine-tune ASR models based on performance for respective languages and integrate even whisper-based audio models.
- Build a desktop app similar to webapp for using all the functionalities

## References

- [1] https://github.com/facebookresearch/seamless_communication/blob/main/Seamless_Tutorial.ipynb
- [2] https://seamless.metademolab.com/source_languages
- [3] https://huggingface.co/spaces/whisper-event/leaderboard
- [4] https://huggingface.co/kurianbenoy/Malwhisper-v1-medium
- [5] https://huggingface.co/collections/kurianbenoy/vegam-whisper-models-65132456b4a3c844a7bf8d8e
