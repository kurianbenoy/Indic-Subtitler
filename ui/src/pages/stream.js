import { useState } from "react";

const Streamer = () => {
  const serverBaseURL = "http://localhost:8000";
  const url = `${serverBaseURL}/stream`;

  const [data, setData] = useState([]);

  const fetchData = async () => {
    console.log("fetching");
    fetch(url)
      .then(async (res) => {
        const reader = res.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const decodedValue = new TextDecoder().decode(value);
          const jsonData = JSON.parse(decodedValue);
          console.log(jsonData);
          setData((data) => [...data, jsonData]);
        }
      })
      .catch((err) => console.log("error: ", err));
  };

  return (
    <>
      <h2 className="prose">Streaming example</h2>

      <button className="btn btn-accent" onClick={fetchData}>
        Fetch Stream
      </button>
      <div>
        {data.map((item) => (
          <p key={item.index}>
            Index: {item.index}, Message: {item.message}
          </p>
        ))}
      </div>
    </>
  );
};

export default Streamer;
