import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './styles.css';
import { FiUpload} from 'react-icons/fi';

interface Props {
  onFileUploaded: (file: File) => void
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {

  

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles)
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setselectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [])
  
  const {getRootProps, getInputProps} = useDropzone({onDrop})
  const [selectedFileUrl, setselectedFileUrl] = useState('')
  
  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileUrl 
          ? <img src={selectedFileUrl} alt="Point thumbnail"/>
          : (<p><FiUpload/>Arraste a imagem do estabelecimento ...</p> )

      }
      
    </div>
  )
}

export default Dropzone;