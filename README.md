# Indic-Subtitler

> An open source subtitling platform 💻 for transcribing videos/audios in Indic languages and translating subtitles as well using ML models.

<div>
<img src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/029f32ed-d5a7-4555-a33e-b2fced54c955.png" alt="logo1" width="250" height="auto">
<img src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/3cd137bd-8105-4b84-8ccd-0ed662786240" alt="logo2" width="250" height="auto">
</div>

This project is participating in [Open Source AI Hackathon](https://hasgeek.com/fifthelephant/open-source-ai-hackathon/) sponsored by Meta.
> Theme: AI FOR IMAGE GENERATION/CREATIVES
> 
> [Hasgeek Submission](https://hasgeek.com/fifthelephant/open-source-ai-hackathon/sub/indic-subtitler-3WGToX2LwAuAxTRedhUJyT)

## Project Objective

The number of tools which are available in Indian languages to subitle audio and videos in Indian languages are almost none. Yet that shouldn't be the case, as now there are lot of open-source models supporting speech transcription in most of official Indian languages.  This tool can be useful for subtitling audios and videos like Indian cinemas for Media Industry in general.


## Project Feasability

Due to advent of new technologies like Meta's seamless M4T model and Whisper fine-tuned models, you can do speech transcription to transcribe audio's from source audio to source text. With this a Hindi audio can be transcribed to Hindi text for generating subtitles. Meta's seamless M4T model also supports translation which can take Hindi audio and generate subtitle in languages like English, French, Malayalam etc.

---

## Technology stack


### 1. ML Model

We are planning to use Meta's Seamless Communication technology which was recently released[git](https://github.com/facebookresearch/seamless_communication). The `SeamlessM4T_v2_large` model 🚀, supports almost 12 Indic languages [2] by default. With this model alone, we can potentially transcribe audio in respective languages and even translate subtitles into other languages.  More details about SeamlessM4T can be found in paper [7].


In lot of Indic languages, there are fine-tuned Whisper ASR models in respective languages. More such models can be found in this Whisper event leaderboard [3]. We have personally fine-tuned Whisper models in my mother tongue malayalam like [4] and [5]. So if performance of any language is not really good in SeamlessM4T model, we can switch to one of the fine-tuned Whisper ASR based models available in open source or make one ourselves. Yet one thing to note though is, that Whisper might not be able to support all the languages listed in Seamless.

**Indic Languages supported with SeamlessM4T**

| Language   | Code   |
|------------|--------|
| Assamese   | asm    |
| Bengali    | ben    |
| English    | eng    |
| Gujarati   | guj    |
| Hindi      | hin    |
| Kannada    | kan    |
| Malayalam  | mal    |
| Marathi    | mar    |
| Odia       | ory    |
| Punjabi    | pan    |
| Tamil      | tam    |
| Telugu     | tel    |
| Urdu       | urd    |

The language code abbrevation for each of the models can be [found out here](https://github.com/facebookresearch/seamless_communication/blob/main/demo/expressive/utils.py) [6].

### 2. Backend API

We plan to use FastAPI as the backend and deploy it on serveless platforms like [Modal.com](https://modal.com/) or any other alternatives.

### 3. Frontend

Next.js, being a React framework, offers you all the benefits of React plus more features out of the box, such as file-based routing and API routes, which can simplify your development process. It's an excellent choice, especially for a web application that requires server-side rendering (SSR) or static site generation (SSG) for better performance and SEO.

Framework: Next.js (enables SSR and SSG, improving load times and SEO)
Styling: Tailwind CSS or styled-components (for styling with ease and efficiency)

---

## 🚄 Roadmap 

**Week 1 🌛**

- Create API to use Seamless M4T model
- Start building frontend audio/video upload workflow using Next.js

<img width="1535" alt="indic_subtitle_v1" src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/972cb7f8-7861-47df-a0b3-08a30145a0c2">


**Week 2 🌓**

- Build Landing page for Indic subtitler web app

<img width="926" alt="indic_subtitle_v2" src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/c420bbc6-f20e-4e2b-a58a-7cf283d5673e">
<img width="919" alt="indic_subtitle_v2a" src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/636981f1-3b38-4adf-be81-2fe2f27a952b">
<img width="905" alt="indic_subtitle_v2b" src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/42a7be88-250e-4be2-804e-2990bd668a1e">

- Continue creating API to use Seamless M4T v2 model. Seamless Communication by default doesn't support time-stamps. [github issue](https://github.com/facebookresearch/seamless_communication/issues/172). Trying to find a good work around about this.

*GPU's needed: 1 A100 or T4*

#### Solutions to this issue:

1. Use Silero VAD to chunk audio and use start time/end time of each chunks

 We run VAD first through the entire audio to figure out the VAD chunks start and end time, which is storee into an array.
Then we loop through all these chunks and run seamlessM4T model on each of them.

**Issues with this approach:**

Smaller chunks get very little context and becuase of this our model is sometimes not able to transcribe these chunks accurately. We feel for seamless to effectively work, we need says we need atleast each chunk of size 5 seconds and less than 20 seconds.

##### API Performance

| Audio length   | Time  |
|------------|--------|
| 3 minutes   |41.4s   |
| 5 minutes   | 1m 42s |
| 27 minutes  | 4m 45s |


- Build API to handle audio/video part
- Build UI for displaying and downloading subtitles

**Week 3 🌗**

- Build UI for choose source and target subtitle screen
- Improve results of SeamlessM4T with GPT models
- Complete integrating APIs with frontend

**Week 4 onwards 🌕**

- Evaluate the performance of Indic subtitler on various languages
- Fine-tune ASR models based on performance for respective languages and integrate even whisper-based audio models.
- Build a desktop app similar to webapp for using all the functionalities

---


### Feedback from mentors

1. Instead of uploading, it would be good to have another option to pass youtube video URLs directly and then do subtitling. (Aravind)

2. Improve the existing transcription accuracy by providing context also along with Input Audio and then post-process with GPTs (Simrat)

3. We should ideally focus on doing one thing really well. I was discussing the two features with mentors:

Our first feature is about speech to text Subtitling in both source language and translating to other indic language. The second idea is to generate speech output in different language in a live streaming like setup

They said try to build one thing really well and then only go to the next feature. (Bharat, Aravind)


## References

- [1] https://github.com/facebookresearch/seamless_communication/blob/main/Seamless_Tutorial.ipynb
- [2] https://seamless.metademolab.com/source_languages
- [3] https://huggingface.co/spaces/whisper-event/leaderboard
- [4] https://huggingface.co/kurianbenoy/Malwhisper-v1-medium
- [5] https://huggingface.co/collections/kurianbenoy/vegam-whisper-models-65132456b4a3c844a7bf8d8e
- [6] https://github.com/facebookresearch/seamless_communication/blob/main/demo/expressive/utils.py#L2-L103
- [7] Seamless M4T paper - https://arxiv.org/abs/2308.11596
  
