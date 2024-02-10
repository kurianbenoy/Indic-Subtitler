import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req, res) => {
  const form = formidable({});
  try {
    const [fields, files] = await form.parse(req);

    const file = files.file;
    const uploadedFile = file[0];
    console.log(uploadedFile);
    console.log(typeof uploadedFile);
  } catch (err) {
    console.log("Error: ", err);
  }
  return res.send("bro");
};

export default uploadHandler;
