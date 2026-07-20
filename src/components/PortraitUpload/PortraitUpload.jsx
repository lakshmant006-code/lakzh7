import { useCallback, useRef, useState } from "react";
import { loadImageFile, resizeToDataUri } from "./imagePrep";
import "./PortraitUpload.css";

// Upload -> intake only. There's no live generation here: photos land in a
// Vercel Blob pending/ queue (server/upload-store.js) and are later curated
// by hand via scripts/list-pending-uploads.cjs + scripts/finalize-upload.cjs.
const STATUS = {
  IDLE: "idle",
  PREPARING: "preparing",
  READY: "ready",
  UPLOADING: "uploading",
  DONE: "done",
  ERROR: "error",
};

export default function PortraitUpload() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dataUriRef = useRef(null);

  const reset = useCallback(() => {
    setStatus(STATUS.IDLE);
    setPreviewUrl(null);
    setErrorMessage("");
    dataUriRef.current = null;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setStatus(STATUS.PREPARING);
    setErrorMessage("");
    let objectUrl = null;
    try {
      const { img, url } = await loadImageFile(file);
      objectUrl = url;
      const dataUri = resizeToDataUri(img);
      dataUriRef.current = dataUri;
      setPreviewUrl(dataUri);
      setStatus(STATUS.READY);
    } catch (err) {
      console.error("[PortraitUpload]", err);
      setErrorMessage("Couldn't read that image. Try a different file.");
      setStatus(STATUS.ERROR);
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!dataUriRef.current) return;
    setStatus(STATUS.UPLOADING);
    setErrorMessage("");
    try {
      const res = await fetch("/api/upload-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUri: dataUriRef.current }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "upload failed");
      setStatus(STATUS.DONE);
    } catch (err) {
      console.error("[PortraitUpload]", err);
      setErrorMessage(err.message || "Upload failed. Try again later.");
      setStatus(STATUS.ERROR);
    }
  }, []);

  return (
    <>
      <button type="button" className="portrait-upload-trigger" onClick={() => setOpen(true)}>
        Add a picture
      </button>

      {open && (
        <div className="portrait-upload-overlay" onClick={close}>
          <div className="portrait-upload-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="portrait-upload-close" onClick={close} aria-label="Close">
              &times;
            </button>

            <h2>Turn a picture into a sculpture</h2>
            <p className="portrait-upload-copy">
              Upload any photo. It joins a review queue and, once processed,
              may appear in the gallery for everyone to see. This isn't
              instant &mdash; check back later.
            </p>

            {status === STATUS.DONE ? (
              <div className="portrait-upload-done">
                <p>You're in the queue. Thanks for contributing.</p>
                <button type="button" onClick={close}>
                  Close
                </button>
              </div>
            ) : (
              <>
                {previewUrl && status === STATUS.READY && (
                  <img className="portrait-upload-preview" src={previewUrl} alt="Preview" />
                )}

                {status === STATUS.IDLE && (
                  <label className="portrait-upload-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                    Choose a photo
                  </label>
                )}

                {status === STATUS.PREPARING && <p className="portrait-upload-status">Preparing photo&hellip;</p>}

                {status === STATUS.READY && (
                  <div className="portrait-upload-actions">
                    <button type="button" onClick={reset}>
                      Choose different photo
                    </button>
                    <button type="button" className="portrait-upload-submit" onClick={handleSubmit}>
                      Submit
                    </button>
                  </div>
                )}

                {status === STATUS.UPLOADING && <p className="portrait-upload-status">Uploading&hellip;</p>}

                {status === STATUS.ERROR && (
                  <div>
                    <p className="portrait-upload-status portrait-upload-status--error">{errorMessage}</p>
                    <button type="button" onClick={reset}>
                      Try again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
