import "./styles.scss";

const resizeIFrameToFitContent = (iFrame) => {
  iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
  iFrame.height = iFrame.contentWindow.document.body.scrollHeight + 40;
};

window.addEventListener("DOMContentLoaded", (e) => {
  setTimeout(() => {
    const iframes = document.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      resizeIFrameToFitContent(iframes[i]);
    }
  }, 500);
});
