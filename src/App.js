import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import New from "./pages/New";
import Diary from "./pages/Diary";
import React, { useEffect, useReducer, useRef } from "react";
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const newItem = {
        ...action.data,
      };
      newState = [newItem, ...state];
      break;
    }
    case "REMOVE": {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case "EDIT": {
      newState = state.map((it) =>
        it.id === action.data.id ? action.data : it
      );
      break;
    }
    default:
      return state;
  }
  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

function App() {
  useEffect(() => {
    const localData = localStorage.getItem("diary");
    if (localData) {
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      if (diaryList.length >= 1) {
        dataId.current = parseInt(diaryList[0].id) + 1;
        dispatch({ type: "INIT", data: diaryList });
      }
    }
  }, []);

  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);

  const onCreate = (date, content, emotion) => {
    const nowSavingDate = new Date(date);
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: nowSavingDate.getTime(),
        content,
        emotion,
      },
    });
    dataId.current += 1;
  };

  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  };

  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };

  const dispatches = {
    onCreate,
    onEdit,
    onRemove,
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={dispatches}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home component={Home} />} />
              <Route path="/edit/:id" element={<Edit component={Edit} />} />
              <Route path="/new" element={<New />} component={New} />
              <Route path="/diary/:id" element={<Diary />} component={Diary} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
