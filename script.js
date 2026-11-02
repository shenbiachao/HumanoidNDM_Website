"use strict";

// Keep native controls and retain the playback position when switching demos.
// Releasing inactive media also prevents paused downloads from occupying all
// six connections on HTTP/1 servers, blocking the seventh and later videos.
const videos = [...document.querySelectorAll("video")];
const resumeTimes = new WeakMap();
for (const video of videos) {
  video.addEventListener("loadedmetadata", () => {
    const position = resumeTimes.get(video);
    if (Number.isFinite(position) && position > 0 && position < video.duration) {
      video.currentTime = position;
    }
    resumeTimes.delete(video);
  });
  video.addEventListener("play", () => {
    videos.forEach((other) => {
      if (other === video) return;
      other.pause();
      if (other.readyState > 0 || other.networkState === HTMLMediaElement.NETWORK_LOADING) {
        resumeTimes.set(other, other.ended ? 0 : other.currentTime);
        other.load();
      }
    });
  });
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) videos.forEach((video) => video.pause());
});

// Figure links work directly without JavaScript; enhance them with a modal.
const dialog = document.querySelector("#image-dialog");
if (dialog && typeof dialog.showModal === "function") {
  const expandedImage = document.querySelector("#dialog-image");
  const caption = dialog.querySelector(".dialog-caption");
  document.querySelectorAll("[data-lightbox]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const original = link.querySelector("img");
      expandedImage.src = link.href;
      expandedImage.alt = original.alt;
      caption.textContent = original.alt;
      dialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
}

const copyButton = document.querySelector("#copy-citation");
const citation = document.querySelector("#citation");
const copyStatus = document.querySelector("#copy-status");
if (copyButton && citation) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    const text = citation.textContent.trim();
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (_) { /* Fall back for local files or denied clipboard access. */ }
    if (!copied) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      try { copied = document.execCommand("copy"); } catch (_) { copied = false; }
      textarea.remove();
      copyButton.focus({ preventScroll: true });
    }
    if (copied) {
      copyStatus.textContent = "BibTeX copied to clipboard.";
      copyButton.textContent = "Copied!";
      window.setTimeout(() => { copyButton.textContent = "Copy BibTeX"; }, 2500);
    } else {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = "Citation selected. Press Ctrl+C (or ⌘C) to copy, or download the .bib file.";
    }
  });
}
