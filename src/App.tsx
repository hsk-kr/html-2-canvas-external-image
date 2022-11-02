import { useState } from "react";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";

function ExternalImageDownloadExample() {
  return (
    <div>
      <h2>External Image Download Example</h2>
      <hr />
      <img
        src="https://i.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0"
        alt="react"
        width={200}
        height={200}
      />
      <br />
      <img
        src="https://i.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA"
        alt="js"
        crossOrigin="anonymous"
        width={200}
        height={200}
      />
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
        alt=""
        height="20"
      ></img>
    </div>
  );
}

function InternalImageDownloadExample() {
  return (
    <div>
      <h2>Internal Image Download Example</h2>
      <hr />
      <img
        src="/html-2-canvas-external-image/react.jpeg"
        alt="react"
        width={200}
        height={200}
      />
      <br />
      <img
        src="/html-2-canvas-external-image/js.png"
        alt="js"
        width={200}
        height={200}
      />
    </div>
  );
}

enum Tab {
  INTERNAL = 0,
  EXTERNAL = 1,
}

function App() {
  const [tab, setTab] = useState(Tab.INTERNAL);

  const handleTabChange = (tab: Tab) => () => setTab(tab);

  const download = async () => {
    const canvas = await html2canvas(document.body);
    const ctx = canvas.getContext("2d");

    const generateImages = () => {
      if (!ctx) return;

      const images = document.querySelectorAll<HTMLImageElement>("img");
      let works = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Images not to draw
        if (
          image.style.visibility === "hidden" ||
          image.style.display === "none" ||
          !image.src.startsWith("http")
        )
          continue;

        works.push(
          new Promise<void>((resolve) => {
            const { x, y, width, height } = image.getBoundingClientRect();
            const canvasImg = new Image();
            canvasImg.onload = () => {
              // you need to change the image size appropriately
              ctx.drawImage(
                canvasImg,
                0,
                0,
                canvasImg.width,
                canvasImg.height,
                x,
                y,
                width,
                height
              );
              resolve();
            };
            canvasImg.crossOrigin = "anonymous";
            canvasImg.src = image.src;
          })
        );

        Promise.all(works).then(() => {
          const dataURL = canvas.toDataURL("image/png");
          downloadjs(dataURL, "download.png", "image/png");
        });
      }
    };

    generateImages();
  };

  return (
    <div style={{ padding: 24 }}>
      <header style={{ paddingBottom: 16, borderBottom: "1px solid #ececec" }}>
        <ul>
          <li
            style={{ cursor: "pointer" }}
            onClick={handleTabChange(Tab.INTERNAL)}
          >
            Internal
          </li>
          <li
            style={{ cursor: "pointer" }}
            onClick={handleTabChange(Tab.EXTERNAL)}
          >
            External
          </li>
        </ul>
        <button type="button" onClick={download}>
          Download
        </button>
      </header>
      {tab === Tab.INTERNAL ? (
        <InternalImageDownloadExample />
      ) : (
        <ExternalImageDownloadExample />
      )}
    </div>
  );
}

export default App;
