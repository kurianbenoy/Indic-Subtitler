import time
from fastapi.responses import StreamingResponse

from modal import Stub, web_endpoint

stub = Stub()


def fake_event_streamer():
    for i in range(10):
        yield f"data: some data {i}\n\n".encode()
        time.sleep(0.5)


@stub.function()
@web_endpoint()
def stream_me():
    return StreamingResponse(fake_event_streamer(), media_type="text/event-stream")
