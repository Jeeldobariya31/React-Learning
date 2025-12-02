import "./telwind.css";
import { useState } from "react";

function App() {
  const [color, setColor] = useState("white");

  return (
    <div
      className="w-full h-screen duration-200"
      style={{ backgroundColor: color }}
    >
      <div className="fixed flex justify-center bottom-10 inset-x-0 px-2">
        <div className="shadow-lg bg-white px-4 py-3 rounded-3xl space-y-2">
          {/* ---------- LINE 1 ---------- */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setColor("red")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "red", color: "white" }}
            >
              Red
            </button>
            <button
              onClick={() => setColor("blue")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "blue", color: "white" }}
            >
              Blue
            </button>
            <button
              onClick={() => setColor("green")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "green", color: "white" }}
            >
              Green
            </button>
            <button
              onClick={() => setColor("purple")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "purple", color: "white" }}
            >
              Purple
            </button>
            <button
              onClick={() => setColor("orange")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "orange", color: "white" }}
            >
              Orange
            </button>
            <button
              onClick={() => setColor("pink")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "pink", color: "black" }}
            >
              Pink
            </button>
            <button
              onClick={() => setColor("yellow")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "yellow", color: "black" }}
            >
              Yellow
            </button>
            <button
              onClick={() => setColor("brown")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "brown", color: "white" }}
            >
              Brown
            </button>
            <button
              onClick={() => setColor("black")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "black", color: "white" }}
            >
              Black
            </button>
            <button
              onClick={() => setColor("gray")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "gray", color: "white" }}
            >
              Gray
            </button>
            <button
              onClick={() => setColor("cyan")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "cyan", color: "black" }}
            >
              Cyan
            </button>
            <button
              onClick={() => setColor("teal")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "teal", color: "white" }}
            >
              Teal
            </button>
            <button
              onClick={() => setColor("indigo")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "indigo", color: "white" }}
            >
              Indigo
            </button>
            <button
              onClick={() => setColor("violet")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "violet", color: "white" }}
            >
              Violet
            </button>
            <button
              onClick={() => setColor("lime")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "lime", color: "black" }}
            >
              Lime
            </button>
            <button
              onClick={() => setColor("skyblue")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "skyblue", color: "black" }}
            >
              SkyBlue
            </button>
            <button
              onClick={() => setColor("gold")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "gold", color: "black" }}
            >
              Gold
            </button>
          </div>

          {/* ---------- LINE 2 ---------- */}
          <div className="flex flex-wrap justify-center gap-3 my-5">
            <button
              onClick={() => setColor("maroon")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "maroon", color: "white" }}
            >
              Maroon
            </button>
            <button
              onClick={() => setColor("navy")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "navy", color: "white" }}
            >
              Navy
            </button>
            <button
              onClick={() => setColor("olive")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "olive", color: "white" }}
            >
              Olive
            </button>
            <button
              onClick={() => setColor("crimson")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "crimson", color: "white" }}
            >
              Crimson
            </button>
            <button
              onClick={() => setColor("coral")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "coral", color: "black" }}
            >
              Coral
            </button>
            <button
              onClick={() => setColor("salmon")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "salmon", color: "black" }}
            >
              Salmon
            </button>
            <button
              onClick={() => setColor("khaki")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "khaki", color: "black" }}
            >
              Khaki
            </button>
            <button
              onClick={() => setColor("tan")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "tan", color: "black" }}
            >
              Tan
            </button>
            <button
              onClick={() => setColor("orchid")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "orchid", color: "white" }}
            >
              Orchid
            </button>
            <button
              onClick={() => setColor("plum")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "plum", color: "black" }}
            >
              Plum
            </button>
            <button
              onClick={() => setColor("slateblue")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "slateblue", color: "white" }}
            >
              SlateBlue
            </button>
            <button
              onClick={() => setColor("steelblue")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "steelblue", color: "white" }}
            >
              SteelBlue
            </button>
            <button
              onClick={() => setColor("darkgreen")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "darkgreen", color: "white" }}
            >
              DarkGreen
            </button>
            <button
              onClick={() => setColor("forestgreen")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "forestgreen", color: "white" }}
            >
              ForestGreen
            </button>
            <button
              onClick={() => setColor("seagreen")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "seagreen", color: "white" }}
            >
              SeaGreen
            </button>
            <button
              onClick={() => setColor("tomato")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "tomato", color: "white" }}
            >
              Tomato
            </button>
            <button
              onClick={() => setColor("chocolate")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "chocolate", color: "white" }}
            >
              Chocolate
            </button>
          </div>

          {/* ---------- LINE 3 ---------- */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setColor("mintcream")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "mintcream", color: "black" }}
            >
              MintCream
            </button>
            <button
              onClick={() => setColor("lavender")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "lavender", color: "black" }}
            >
              Lavender
            </button>
            <button
              onClick={() => setColor("wheat")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "wheat", color: "black" }}
            >
              Wheat
            </button>
            <button
              onClick={() => setColor("aquamarine")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "aquamarine", color: "black" }}
            >
              Aquamarine
            </button>
            <button
              onClick={() => setColor("azure")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "azure", color: "black" }}
            >
              Azure
            </button>
            <button
              onClick={() => setColor("ivory")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "ivory", color: "black" }}
            >
              Ivory
            </button>
            <button
              onClick={() => setColor("beige")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "beige", color: "black" }}
            >
              Beige
            </button>
            <button
              onClick={() => setColor("rosybrown")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "rosybrown", color: "white" }}
            >
              RosyBrown
            </button>
            <button
              onClick={() => setColor("lightgreen")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "lightgreen", color: "black" }}
            >
              LightGreen
            </button>
            <button
              onClick={() => setColor("lightblue")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "lightblue", color: "black" }}
            >
              LightBlue
            </button>
            <button
              onClick={() => setColor("hotpink")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "hotpink", color: "black" }}
            >
              HotPink
            </button>
            <button
              onClick={() => setColor("dodgerblue")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "dodgerblue", color: "white" }}
            >
              DodgerBlue
            </button>
            <button
              onClick={() => setColor("mediumseagreen")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "mediumseagreen", color: "white" }}
            >
              MediumSeaGreen
            </button>
            <button
              onClick={() => setColor("peru")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "peru", color: "white" }}
            >
              Peru
            </button>
            <button
              onClick={() => setColor("darkorange")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "darkorange", color: "white" }}
            >
              DarkOrange
            </button>
            <button
              onClick={() => setColor("deeppink")}
              className="outline-none py-1 px-4 rounded-full text-sm font-semibold shadow-lg"
              style={{ backgroundColor: "deeppink", color: "white" }}
            >
              DeepPink
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
 