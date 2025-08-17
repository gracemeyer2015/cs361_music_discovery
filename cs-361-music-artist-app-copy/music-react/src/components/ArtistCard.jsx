import { useRef, useState } from "react"
import SaveRemoveButton from "./SaveRemoveButton.jsx"
import { Link } from 'react-router-dom'
import FindSimilarArtistButton from "./FindSimilarArtistButton.jsx"
import { convertFileToBase64} from "./SaveRemoveButton.jsx" // Import the utility function


function ArtistCard({ artist, initialSaved = false, onRemove }) {
  const { name, bio, genre, imageUrl } = artist
  const [customImage, setCustomImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInput = useRef()

  const handleImageUpload = (e) => {
    e.stopPropagation()
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setCustomImage(URL.createObjectURL(file))
    }
  }

  const openFilePicker = (e) => {
    e.stopPropagation()
    fileInput.current.click()
  }

  const uploadImageHandler = async () => {
    if (!selectedFile) return
    setUploading(true)
    setUploadError(null)

    try {
        const dataUrl = await convertFileToBase64(selectedFile)

        const artistId = artist.id || artist._id
        if (!artistId) {
            setUploadError('Artist ID is missing')
            setUploading(false)
            return }
        
        const response = await fetch(`/api/library/${artistId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: dataUrl })
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to upload image')
        }
        const updated = await response.json()

        const updatedImageUrl = updated.artist || updated

        const newImageSrc = updatedImageUrl.imageBase64?.startsWith("data:")
            ? updatedImageUrl.imageBase64
            : updatedImageUrl.imageBase64
            ? `data:image/jpeg;base64,${updatedImageUrl.imageBase64}`
            : null;
        
        setCustomImage(newImageSrc)
        setSelectedFile(null)

        if(typeof onUpdate === 'function') onUpdate(newImageSrc)

    
    } catch (err) {
        console.error(err)
        setUploadError('Failed to upload image. Please try again.')
        setUploadError(err.message || 'An error occurred while uploading the image.')

    }finally {
        setUploading(false)
    }
  }

  const innerHTML = (htmlString) => {
    if (!htmlString) return ''
    const div = document.createElement("div")
    div.innerHTML = htmlString
    return div.textContent || div.innerText
  }

  const dataUrl =
    imageUrl ||
    (artist.imageBase64
      ? (artist.imageBase64.startsWith('data:')
        ? artist.imageBase64
        : `data:image/jpeg;base64,${artist.imageBase64}`)
      : null)
  const displayImage = customImage || dataUrl

  return (
    <div className="artist-card">
      <div
        className="artist-Image-holder"
        onClick={openFilePicker}
        style={{ cursor: "pointer" }}
      >
        {displayImage ? (
          <img
            className="place-holder-image"
            src={displayImage}
            alt={`Photo of ${name} or one of their albums`}
          />
        ) : (
          <div className="placeholder-image">
            <button
              onClick={(e) => {
                e.stopPropagation()
                openFilePicker(e)
              }}
            >
              Click to add image
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={handleImageUpload}
        />
      </div>
        {selectedFile && (
            <div className = "image-actions">
                <button onClick = {uploadImageHandler} disabled={uploading}>
                    {uploading ? "Saving..." : "Save Image"}
                </button>
                <button
                    onClick = {() => {
                        setSelectedFile(null)
                        setCustomImage(null)
                        setUploadError(null)
                    }}
                    disabled={uploading}>
                    Cancel
                </button>
                {uploadError && <div className="error-message">{uploadError}</div>}
            </div>
        )}

      <div className="artist-card-header">
        {/* Only wrap the name in Link */}
        <Link
          to={`/artist/${encodeURIComponent(name)}`}
          state={{ artist }}
          className="artist-card-link"
          aria-label={`Open ${name} details page`}
          onClick={(e) => e.stopPropagation()} // prevent parent handlers if needed
        >
          <h2 className="artist-name">{name}</h2>
        </Link>
        <p className="genre-tag">{genre}</p>
      </div>

      <div className="artist-card-bio">
        <p className="bio-label">Bio:</p>
        <p className="bio-text">{innerHTML(bio)}</p>
      </div>

      <div className="artist-card-footer">
        <SaveRemoveButton
          artist={{ ...artist, imageFile: selectedFile }}
          initialSaved={initialSaved}
          onToggle={(isSaved) => {
            if (!isSaved) {
              onRemove(artist.id || artist._id)
            }
          }}
        />
        <div className="find-similar-button-wrapper">
          <FindSimilarArtistButton artistName={name} />
        </div>
      </div>
    </div>
  )
}

export default ArtistCard
