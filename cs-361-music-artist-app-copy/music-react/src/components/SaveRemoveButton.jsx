import { useState } from "react"
import { MdSave,  MdDelete} from "react-icons/md"
import { ImSpinner2 } from "react-icons/im";

export function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function SaveRemoveButton({artist, initialSaved = false, onToggle}){
   
    const[isSaved, setIsSaved] = useState(initialSaved)
    const[isLoading, setIsLoading] = useState(false)


    // function to handle save request for on click event
    // save to create a new artist in the library saves to mongodb 
    const saveHandler = async () => {
       setIsLoading(true)
       try {
            let imageBase64 = null
            if (artist.imageFile){
                imageBase64 = await convertFileToBase64(artist.imageFile)
            }
            const artistData = {
                name: artist.name,
                bio: artist.bio,
                genre: artist.genre,
                imageBase64,
            }
    
            const response = await fetch('/api/library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(artistData)
            })
            if(!response.ok) throw new Error('Failed to save artist')
            setIsSaved(true)
            if(onToggle) onToggle(true)
         } catch (error) {
            console.error(error)
    } finally {
            setIsLoading(false)
        }
    }

    // function to handle remove request for on click event 
    // requests to delete artist if found in the library removes artist from mongodb
    const removeHandler = async () => {
        setIsLoading(true)
        try {
            const artistId = artist.id || artist._id; 
            const response = await fetch(`/api/library/${artistId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            if(response.status === 204) {
                setIsSaved(false)
                if(onToggle) onToggle(false)
            } else {
                console.error('Failed to remove artist')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)}

    }   
    
    return (
        <div className = "saveRemoveButton">
            <button 
            // if saved is true, call remove handler on click else call save handler
            onClick = {isSaved ? removeHandler : saveHandler}
            // if loading then button is temporarily disabled
            disabled = {isLoading}
            >
                {isLoading ? (
                    <>
                        <ImSpinner2 className = "animate-spin"/>
                        <span className = "loadingText">Loading...</span>
                    </>
                ): isSaved ? (
                    <>
                        <MdDelete/>
                        <span>Remove</span>

                    </>
                ):(
                    <>
                        <MdSave/>
                        <span>Save</span>
                    </>
                )}
                
                
            </button>
        </div>
    )

}

export default SaveRemoveButton