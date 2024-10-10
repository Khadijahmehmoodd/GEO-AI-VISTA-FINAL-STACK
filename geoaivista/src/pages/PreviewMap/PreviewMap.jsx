import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PreviewMap.module.css";
import mapPreviewImage from "../../assets/UserInput.jpg"; // Default fallback image
import { useUser } from "../../context/UserContext";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const PreviewPage = () => {
  const {
    token,
    setOriginalImageDimensions,
    setOriginalImageUrl,
    setOriginalImageData,
    setGeneratedImage, // **Add this line**
  } = useUser();
  const navigate = useNavigate();
  const [mapName, setMapName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isFileSaved, setIsFileSaved] = useState(false);
  const [maskImageUrl, setMaskImageUrl] = useState(null);
  const imageRef = useRef(null);
  const [imageDownloaded, setImageDownloaded] = useState(false);

  useEffect(() => {
    const blobUrl = sessionStorage.getItem("maskBlobUrl");

    if (blobUrl) {
      fetch(blobUrl)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const imageUrl = URL.createObjectURL(imageBlob);
          const img = new Image();
          img.src = imageUrl;

          setOriginalImageData(imageBlob);
          setOriginalImageUrl(imageUrl);

          // **Set the generated image in the context**
          setGeneratedImage(imageBlob);

          img.onload = () => {
            setOriginalImageDimensions({
              width: img.width,
              height: img.height,
            });

            setMaskImageUrl(imageUrl);

            if (!imageDownloaded) {
              downloadImage(imageBlob);
              setImageDownloaded(true);
            }
          };
        })
        .catch((error) => {
          console.error("Error fetching the image from sessionStorage:", error);
        });
    } else {
      console.error("No image URL found in sessionStorage.");
    }
  }, [
    setOriginalImageDimensions,
    setOriginalImageUrl,
    setOriginalImageData,
    setGeneratedImage, // **Add this line**
    imageDownloaded,
  ]);

  const downloadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "downloaded_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveImage = async () => {
    if (mapName.trim() === "") {
      setPopupMessage("Please enter the file name first.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } else {
      const response = await fetch(maskImageUrl);
      const imageBlob = await response.blob();
      const imageFile = new File([imageBlob], `${mapName}.png`, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("name", mapName);
      formData.append("image", imageFile);

      const result = await fetch("http://localhost:5000/api/images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (result.ok) {
        setIsFileSaved(true);
        setPopupMessage("File Saved!");
      } else {
        setPopupMessage("Error saving the file");
      }

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  const handleRequirementForm = () => {
    if (isFileSaved) {
      navigate("/gallery", {
        state: { image: mapPreviewImage, name: mapName },
      });
    } else {
      setPopupMessage("Please save the file first.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  const handleRegenerate = () => {
    navigate("/regenerate");
  };

  return (
    <div className={styles.previewContainer}>
      <div className={styles.content}>
        <h1 className={styles.previewTitle}>Preview Map</h1>

        {/* TransformWrapper for Zoom, Pan, and Pinch functionality */}
        <TransformWrapper initialScale={1}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className={styles.mapPreview}>
                <TransformComponent>
                  {maskImageUrl ? (
                    <img
                      src={maskImageUrl}
                      alt="Map Preview"
                      className={styles.mapImage}
                      ref={imageRef}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%", // Image should not exceed the width of the container
                        maxHeight: "100vh", //does not exceed
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <img
                      src={mapPreviewImage}
                      alt="Map Preview"
                      className={styles.mapImage}
                      style={{
                        width: "auto", // Ensure fallback image also respects the aspect ratio
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100vh",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </TransformComponent>
              </div>

              {/* Updated horizontal control buttons */}
              <div className={styles.horizontalControls}>
                <button onClick={() => zoomIn()} className={styles.zoomButton}>
                  Zoom In
                </button>
                <button onClick={() => zoomOut()} className={styles.zoomButton}>
                  Zoom Out
                </button>
                <button
                  onClick={() => resetTransform()}
                  className={styles.zoomButton}
                >
                  Reset
                </button>
                <input
                  type="text"
                  placeholder="Enter map name"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  className={styles.mapNameInput}
                />
                <button onClick={handleSaveImage} className={styles.saveButton}>
                  Save Image
                </button>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleRequirementForm}
          className={styles.galleryButton}
        >
          Gallery
        </button>
        <button onClick={handleRegenerate} className={styles.regenerateButton}>
          Regenerate
        </button>
      </div>

      {showPopup && <div className={styles.popup}>{popupMessage}</div>}
    </div>
  );
};

export default PreviewPage;
