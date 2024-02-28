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

The number of tools which are available in Indian languages to subitle audio and videos in Indian languages are almost none. Yet that shouldn't be the case, as now there are lot of open-source models supporting speech transcription in most of official Indian languages. This tool can be useful for subtitling audios and videos like Indian cinemas for Media Industry in general.

## Project Feasability

Due to advent of new technologies like Meta's seamless M4T model and Whisper fine-tuned models, you can do speech transcription to transcribe audio's from source audio to source text. With this a Hindi audio can be transcribed to Hindi text for generating subtitles. Meta's seamless M4T model also supports translation which can take Hindi audio and generate subtitle in languages like English, French, Malayalam etc.

## 🎯 Impact of this project

1. Breaks language barriers, making content accessible to diverse audiences
2. Empowers content creators with easy-to-use subtitling in multiple Indian languages
3. Enhances viewer experience with accurate, timely subtitles

## Use-cases

1. Now content-creators, can create youtube videos in their native language like Tamil and create captions in languages like English, Hindi, Malayalam etc. with our tool.
2. Can create educational content for doctors practising commmunity medicine, can be used in apps for schools. Like a content in English can be translated to Telgu, the mother tongue of student so they can understand things quickly
3. Can be used for media professionals to subtitle news content, movies etc.

---

## Technology stack

### 1. ML Model

A. SeamlessM4T model

We are planning to use Meta's Seamless Communication technology which was recently [released in github](https://github.com/facebookresearch/seamless_communication) [1]. The `SeamlessM4T_v2_large` model 🚀, supports almost 12 Indic languages [2] by default. With this model alone, we can potentially transcribe audio in respective languages and even translate subtitles into other languages. More details about SeamlessM4T can be found in paper [7]. The functionality is very well explained [in this tutorial](https://github.com/facebookresearch/seamless_communication/blob/main/Seamless_Tutorial.ipynb) [8] written in Seamless Communication Repository.

In lot of Indic languages, there are fine-tuned Whisper ASR models in respective languages. More such models can be found in this Whisper event leaderboard [3]. We have personally fine-tuned Whisper models in my mother tongue malayalam like [4] and [5]. So if performance of any language is not really good in SeamlessM4T model, we can switch to one of the fine-tuned Whisper ASR based models available in open source or make one ourselves. Yet one thing to note though is, that Whisper might not be able to support all the languages listed in Seamless.

**Indic Languages supported with SeamlessM4T**

| Language  | Code |
| --------- | ---- |
| Assamese  | asm  |
| Bengali   | ben  |
| English   | eng  |
| Gujarati  | guj  |
| Hindi     | hin  |
| Kannada   | kan  |
| Malayalam | mal  |
| Marathi   | mar  |
| Odia      | ory  |
| Punjabi   | pan  |
| Tamil     | tam  |
| Telugu    | tel  |
| Urdu      | urd  |

The language code abbrevation for each of the models can be [found out here](https://github.com/facebookresearch/seamless_communication/blob/main/demo/expressive/utils.py) [6].

B. faster-whisper

[faster-whisper](https://github.com/SYSTRAN/faster-whisper) [9] is a reimplementation of OpenAI's Whisper model using CTranslate2, which is a fast inference engine for Transformer models. This implementation is up to 4 times faster than openai/whisper for the same accuracy while using less memory. The efficiency can be further improved with 8-bit quantization on both CPU and GPU. Since faster-whisper is based in Whisper, it supports all the 99 languages supported by whisper.

**Indic Languages supported with faster-whisper**

| Language  | Code |
| --------- | ---- |
| Assamese  | as |
| Bengali   | bn |
| English   | en |
| Gujarati  | gu |
| Hindi     | hi |
| Kannada   | kn |
| Malayalam | ml |
| Marathi   | mr |
| Punjabi   | pa |
| Tamil     | ta |
| Telgu     | te |
| Urdu      | ur |

C. WhisperX

 WhisperX provides fast automatic speech recognition (70x realtime with large-v2) with word-level timestamps and speaker diarization. The features provided by WhisperX are:

- ⚡️ Batched inference for 70x realtime transcription using whisper large-v2
- 🪶 faster-whisper backend, requires <8GB gpu memory for large-v2 with beam_size=5
- 🎯 Accurate word-level timestamps using wav2vec2 alignment
- 👯‍♂️ Multispeaker ASR using speaker diarization from pyannote-audio (speaker ID labels)
- 🗣️ VAD preprocessing, reduces hallucination & batching with no WER degradation


**Indic Languages supported with faster-whisper**

| Language  | Code |
| --------- | ---- |
| English   | en |
| Hindi     | hi |
| Telgu     | te |
| Urdu      | ur |

D. fine-tuned Whisper model

In certain languages, Whisper by default is not performing strongly. In your problem, the open source Whisper model doesn’t give good results.
Then fine-tune your ASR model with examples like [Fine-Tune Whisper For Multilingual ASR with 🤗 Transformers](https://huggingface.co/blog/fine-tune-whisper).

**Indic Languages supported with fine-tuned Whisper model**

| Language  | Code |
| --------- | ---- |
| Malayalam | ml |


### 2. Backend API

We plan to use FastAPI as the backend and deploy it on serveless platforms like [Modal.com](https://modal.com/) or any other alternatives.

**API format**

- POST request for the webendpoints: `generate_seamlessm4t_speech`, `generate_faster_whisper_speech`, `generate_whisperx_speech` API with the following input format:

```
{
 "wav_base64": "Audio in base64 format",
 "target": "Your target lanugage you want to transcribe or translate your audio"
}
```

- POST request for the functions: `youtube_generate_seamlessm4t_speech`, `youtube_generate_faster_whisper_speech`, `youtube_generate_whisperx_speech` API with the following input format:

```
{
 "yt_id": "Youtube ID as input in string format",
 "target": "Your target lanugage you want to transcribe or translate your audio"
}
```

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

</br>

**Week 2 🌓**

- Build Landing page for Indic subtitler web app

![landing-page_](https://github.com/kurianbenoy/Indic-Subtitler/assets/83013781/2af4776d-a8fb-4749-8ede-0fefcec94f91)

- Build Dashboard to Upload Files, Generate & Edit subtitles and Download subtitles in .srt format

![Screenshot from 2024-02-18 13-05-59](https://github.com/kurianbenoy/Indic-Subtitler/assets/83013781/d2db0ea9-8b79-4ce0-96e7-8770e17af63c)

- Continue creating API to use Seamless M4T v2 model. Seamless Communication by default doesn't support time-stamps. [github issue](https://github.com/facebookresearch/seamless_communication/issues/172). Trying to find a good work around about this.

_GPU's needed: 1 A100 or T4_

#### Solutions to this issue:

1. Use Silero VAD to chunk audio and use start time/end time of each chunks

We run VAD first through the entire audio to figure out the VAD chunks start and end time, which is stored into an array.
Then we loop through all these chunks and run seamlessM4T model on each of them.

**Issues with this approach:**

Smaller chunks get very little context and becuase of this our model is sometimes not able to transcribe these chunks accurately. We feel for seamless to effectively work, we need says we need atleast each chunk of size 5 seconds and less than 20 seconds.

##### API Performance

| Audio length | Time   |
| ------------ | ------ |
| 3 minutes    | 41.4s  |
| 5 minutes    | 1m 42s |
| 15 minutes   | 2m23s  |
| 27 minutes   | 4m 45s |

- Completed integrating APIs with Next.JS frontend.
- Build API to handle audio/video part

</br>

**Week 3 🌗**

- Build Streaming API for Seamless M4T models
- Incorporate frontend to make use of streaming API endpoints for Generative UI
- In the Landing page include LICENSE of models; Also add an About us page.

![image](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/4be3cb81-0956-4a3e-af82-57b05cc5aa0b)
![image](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/a8015df1-a596-446c-a406-dab6880efc59)


- Add a section on Projects to shows audios uploaded and it's associated results SRT files. Also show the name, created date, file size(optional)

![image](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/d84082d5-6d1c-4ce5-8394-d749fbf6c8f7)

- Include more model families like faster-whisper, whisperX, vegam-Malayalam-whisper etc.

![image](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/57152204-c7df-4a0f-9cf7-105c8a60b666)

![image](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/77515f76-047a-4808-9c9f-67e838c29875)


- Evaluate the performance of models in Indic subtitler on custom videos. 

Made progress by adding ground truth to English audios

##### Few extra approaches to consider:

- Improving the results of SeamlessM4T with GPT models.
- Grouping the chunks received from VAD to approx 30 second long chunks and then passing to Seamless model. (the max cut-off for Seamless is 30 seconds).
  - See how we can then break down the longer, more accurate audio chunk to smaller parts with timestamps, again from VAD array
- Try whisper-X model on the whole audio, then compare with the smaller chunks approach made with seamless and then try replacing the timestamped version with the audio from seamless
- Consider breaking down the process into 2 independent steps:
  - one for transcription only
  - then a separate call to LLM to translate the accurate transcriptions to a target language

</br>

**Week 4 🌕**

- Evaluate the performance of Indic subtitler on various languages
- Audio quality enhancement with Demux

https://github.com/kurianbenoy/Indic-Subtitler/issues/4

- Information page about best set of models and when to use it.


**Week 5 onwards 🌕**

- Fine-tune ASR models based on performance for respective languages and integrate even whisper-based audio models.
- Build a desktop app similar to webapp for using all the functionalities

---

### Feedback from mentors

1. Instead of uploading, it would be good to have another option to pass youtube video URLs directly and then do subtitling. (Aravind)

2. Improve the existing transcription accuracy by providing context also along with Input Audio and then post-process with GPTs (Simrat)

3. We should ideally focus on doing one thing really well. We were discussing the two features with mentors:

Our first feature is about speech to text Subtitling in both source language and translating to other indic language. The second idea is to generate speech output in different language in a live streaming like setup

They said try to build one thing really well and then only go to the next feature. (Bharat, Aravind)

4. Add more ASR models, instead of SeamlessM4T only(Bharat)

5. Fine tune ASR models if needed (Bharat)

## References

- [1] https://github.com/facebookresearch/seamless_communication
- [2] https://seamless.metademolab.com/source_languages
- [3] https://huggingface.co/spaces/whisper-event/leaderboard
- [4] https://huggingface.co/kurianbenoy/Malwhisper-v1-medium
- [5] https://huggingface.co/collections/kurianbenoy/vegam-whisper-models-65132456b4a3c844a7bf8d8e
- [6] https://github.com/facebookresearch/seamless_communication/blob/main/demo/expressive/utils.py#L2-L103
- [7] Seamless M4T paper - https://arxiv.org/abs/2308.11596
- [8] https://github.com/facebookresearch/seamless_communication/blob/main/Seamless_Tutorial.ipynb
- [9] https://github.com/SYSTRAN/faster-whisper
