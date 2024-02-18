from fastapi import FastAPI, Response
from starlette.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


async def fake_data_streamer():
    for i in range(10):
        data = {"index": i, "message": "some data packet " + str(i)}
        yield json.dumps(data).encode() + b"\n"
        await asyncio.sleep(0.5)


@app.get("/stream")
async def stream_data(response: Response):
    print("got request")

    async def stream_response():
        async for json_data in fake_data_streamer():
            print("sending..", json_data)
            yield json_data

    response = StreamingResponse(stream_response(), media_type="application/json")
    return response
