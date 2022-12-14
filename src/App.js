import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState("");
  const [loader, setLoader] = useState(false);
  const [filePath, setFilePath] = useState(undefined);

  useEffect(() => {
    try {
      fileEvent();
    } catch (err) {
      console.log("ERROR: " + err);
    }
  }, []);

  const fileEvent = () => {
    window.api.on("GET_FILE", (event, arg) => {
      try {
        setData(arg.data);
        setFilePath(arg.path);
        document.getElementById("codeEditor").value = arg.data;
        document.getElementById("filepath").value = arg.path;
      } catch (e) {
        //console.log("ERROR: " + e);
      }

      return () => {
        window.api.off("GET_FILE", data); // garbage collector
      };
    });
  };

  const saveFile = (data, filePath) => {
    try {
      if (filePath) {
        window.api.sendData("SAVE_FILE", { file: data, path: filePath[0] });
        setLoader(true);
      } else {
        alert("No File Selected!");
      }
    } catch (err) {
      console.log("ERROR: " + err);
    }
  };

  const loadFile = () => {
    try {
      window.api.sendData("GET_FILE", data);
    } catch (err) {
      console.log("ERROR: " + err);
    }
  };

  const runFile = (file) => {
    if (file) {
      window.api.sendData("RUN_FILE", file[0]);
    } else {
      alert("No File Selected!");
    }
  };

  var codeEditor = document.getElementById("codeEditor");
  var lineCounter = document.getElementById("lineCounter");

  if (codeEditor) {
    codeEditor.addEventListener("scroll", () => {
      lineCounter.scrollTop = codeEditor.scrollTop;
      lineCounter.scrollLeft = codeEditor.scrollLeft;
    });

    codeEditor.addEventListener("keydown", (e) => {
      var textareas = document.getElementsByTagName("textarea");
      var count = textareas.length;
      for (var i = 0; i < count; i++) {
        textareas[i].onkeydown = function (e) {
          if (e.keyCode === 9 || e.which === 9) {
            e.preventDefault();
            var s = this.selectionStart;
            this.value =
              this.value.substring(0, this.selectionStart) +
              "\t" +
              this.value.substring(this.selectionEnd);
            this.selectionEnd = s + 1;
          }
        };
      }
    });

    var lineCountCache = 0;
    function line_counter() {
      var lineCount = codeEditor.value.split("\n").length;
      var outarr = [];
      if (lineCountCache !== lineCount) {
        for (var x = 0; x < lineCount; x++) {
          outarr[x] = x + 1 + " ";
        }
        lineCounter.value = outarr.join("\n");
      }
      lineCountCache = lineCount;
    }
    codeEditor.addEventListener("input", () => {
      line_counter();
    });
    codeEditor.addEventListener("mousemove", () => {
      line_counter();
    });
  }

  return (
    <div className="App">
      <div
        className="filebar"
        style={{
          width: "100%",
          height: "55px",
          backgroundColor: "#474747",
        }}
      >
        <ul>
          <li>[TECHY]</li>
          <li>File</li>
          <li>Edit</li>
          <li
            onClick={() => {
              loadFile();
            }}
          >
            Load
          </li>
          <li
            onClick={() => {
              saveFile(data, filePath);
            }}
          >
            Save
          </li>
          <li
            onClick={() => {
              runFile(filePath);
            }}
          >
            Run
          </li>
          <li
            className="filepath"
            style={{
              float: "right",
              width: "auto",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            {filePath} - {loader ? <b>(Saved)</b> : <b>(Unsaved)</b>}
          </li>
        </ul>
      </div>
      <div
        className="codepen"
        style={{ width: "100%", height: "100%", float: "left" }}
      >
        <textarea
          id="lineCounter"
          wrap="off"
          defaultValue={"1 "}
          disabled
          spellCheck="false"
        />
        <textarea
          id="codeEditor"
          wrap="off"
          cols="1"
          rows="200"
          onChange={(e) => {
            setData(e.target.value);
            setLoader(false);
          }}
          defaultValue={data}
          spellCheck="false"
        />
      </div>
    </div>
  );
}

export default App;
