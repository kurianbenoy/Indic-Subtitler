import FileUpload from "@components/components/FileUpload";
import Navbar from "@components/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <FileUpload />
      </div>

      <ToastContainer />
    </>
  );
}
