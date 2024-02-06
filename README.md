# Indic-Subtitler

> A tool to subtitle audios in Indian languages.

## Project Objective

The number of tools which are available in Indian languages to subitle audio and videos in Indian languages are almost none. Yet that shouldn't be the case, as now there are lot of open-source models supporting speech transcription in most of official Indian languages.  This tool can be useful for subtitling audios and videos like Indian cinemas for Media Industry in general. In Meta


## Project Feasability

Due to advent of new technologies like Meta's seamless M4T model and Whisper fine-tuned models, you can do speech transcription to transcribe audio's from source audio to source text. With this a Hindi audio can be transcribed to Hindi text for generating subtitles. Meta's seamless M4T model also supports translation which can take Hindi audio and generate subtitle in languages like English, French, Malayalam etc.


### 1. ML Model

I am planning to use Meta's Seamless Communication technology which was recently released[git](https://github.com/facebookresearch/seamless_communication). I am planning to use seamlessM4T_v2_large model,
which supports almost 12 Indic languages [2] by default. With this model alone, we can potentially transcribe audio in respective languages and even translate subtitles into other languages. 


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
