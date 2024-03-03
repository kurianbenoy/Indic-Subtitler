---
title: "Terms & Licenses"
date: "2024-02-15"
author: "Kurain Benoy"
# authorImg: "jjthomas.png"
draft: false
description: "An open source subtitling platform 💻 for transcribing videos/audios in Indic languages and translating subtitles as well using ML models."
tags: [Terms & Conditions]
type: Legal Terms
---

## 1. Introduction

Indic-subtitler is an open source subtitling platform 💻 for transcribing and translating videos/audios in Indic languages. The number of tools available in Indian languages to subtitle audio and videos is almost none. Yet that shouldn't be the case, as there are now many open-source models supporting speech transcription in most official Indian languages. This tool can be useful for subtitling audios and videos like Indian cinemas for the Media Industry in general. With this tool, content creators can create YouTube videos in their native language like Tamil and create captions in languages like English, Hindi, Malayalam, etc., using our tool which will help them reach a diverse audience.

**License:** GNU General Public License v2.0

The GNU GPL is the most widely used free software license and has a strong copyleft requirement. When distributing derived works, the source code of the work must be made available under the same license. There are multiple variants of the GNU GPL, each with different requirements.

## 2. Models Used

Due to the advent of new technologies like Meta's seamless M4T model and Whisper fine-tuned models, you can do speech transcription to transcribe audio from source audio to source text. With this, a Hindi audio can be transcribed to Hindi text for generating subtitles. Meta's seamless M4T model also supports translation which can take Hindi audio and generate subtitles in languages like English, French, Malayalam, etc.

### 2a. faster-whisper

faster-whisper is a reimplementation of OpenAI's Whisper model using CTranslate2, which is a fast inference engine for Transformer models. This implementation is up to 4 times faster than openai/whisper for the same accuracy while using less memory. The efficiency can be further improved with 8-bit quantization on both CPU and GPU.

[Github Project Link](https://github.com/SYSTRAN/faster-whisper)

**License:** MIT License

A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

### 2b. SeamlessM4T

Seamless is a family of AI models that enable more natural and authentic communication across languages. SeamlessM4T is a massive multilingual multimodal machine translation model supporting around 100 languages. SeamlessM4T serves as the foundation for SeamlessExpressive, a model that preserves elements of prosody and voice style across languages and SeamlessStreaming, a model supporting simultaneous translation and streaming ASR for around 100 languages. SeamlessExpressive and SeamlessStreaming are combined into Seamless, a unified model featuring multilinguality, real-time, and expressive translations.

[Github Project Link](https://github.com/facebookresearch/seamless_communication)

**License:** Attribution-NonCommercial 4.0 International

A license that allows for sharing and remixing of creative works while requiring attribution and prohibiting commercial use.

### 2c. WhisperX

WhisperX provides fast automatic speech recognition (70x realtime with large-v2) with word-level timestamps and speaker diarization. The features provided by WhisperX are: Batched inference for 70x realtime transcription using whisper large-v2, faster-whisper backend, requires <8GB GPU memory for large-v2 with beam_size=5, Accurate word-level timestamps using wav2vec2 alignment, Multispeaker ASR using speaker diarization from pyannote-audio (speaker ID labels) and VAD preprocessing, reduces hallucination & batching with no WER degradation.

[Github Project Link](https://github.com/m-bain/whisperX)

**License:** BSD 4-Clause Original or Old License

A permissive license similar to the BSD 3-Clause License, but with an advertising clause, that requires an acknowledgment of the original source in all advertising material.

### 2d. Vegam-whisper

A faster-whisper fine-tuned version of Malayalam whisper, which performs decently.

[Project Link](https://huggingface.co/kurianbenoy/vegam-whisper-medium-ml)

**License:** MIT License

A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
