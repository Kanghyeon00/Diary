import { useEffect } from "react";
import DiaryEditor from "../components/DiaryEditor";

const New = () => {
  useEffect(()=>{
    const titleElemoent = document.getElementsByTagName('title')[0];
    titleElemoent.innerHTML = `Simple Diary - 새 일기`
  },[])
  return (
    <div>
        <DiaryEditor />
    </div>
  );
};

export default New;
