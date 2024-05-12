# Indic-Subtitler

> An open source subtitling platform 💻 for transcribing videos/audios in Indic languages and translating subtitles as well using ML models.

<div>
<img src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/029f32ed-d5a7-4555-a33e-b2fced54c955.png" alt="logo1" width="250" height="auto">
<img src="https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/3cd137bd-8105-4b84-8ccd-0ed662786240" alt="logo2" width="250" height="auto">
</div>

## Demos

<div>
    <a href="https://www.loom.com/share/f434e100766548f1b24a073fe4fe6e8c">
      <p>Indic Subtitler: Transcribing and Translating Indic Audio and Video Files - Watch Demo Video</p>
    </a>
    <a href="https://www.loom.com/share/f434e100766548f1b24a073fe4fe6e8c">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/f434e100766548f1b24a073fe4fe6e8c-with-play.gif">
    </a>
</div>


   [![Watch the Indicsubtitler.in Demo Video](https://img.youtube.com/vi/BZ3DxFo3eZw/maxresdefault.jpg)](https://www.youtube.com/watch?v=BZ3DxFo3eZw)

## Use-cases

1. Now content-creators, can create youtube videos in their native language like Tamil and create captions in languages like English, Hindi, Malayalam etc. with our tool.
2. Can create educational content for doctors practising commmunity medicine, can be used in apps for schools. Like a content in English can be translated to Telgu, the mother tongue of student so they can understand things quickly
3. Can be used for media professionals to subtitle news content, movies etc.

**Don't use Indic Subtitler for any unlawful purposes.**
---

## Project Architecture

### Generate Subtitles Section

![Generate_subtitles drawio](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/4ec2d93b-99bf-4cc1-821d-ac9ea9e3c99d)

### Our novel architecture introduced with this project for Generative UI which works for any ASR models

![Our novel architecture](https://github.com/kurianbenoy/Indic-Subtitler/assets/24592806/0e20c52d-fcf7-4641-9167-c553fb72d0a4)

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


