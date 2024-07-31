import { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImg = () => {
  const [imgURL, setImgURL] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file && file.type.startsWith("image/")){
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgURL(reader.result);
      }
      reader.readAsDataURL(file);
    } else{
      showToast("Invalid file type","Please select and image file","error");
      setImgURL(null);
    }
  }
  return {handleImageChange, imgURL, setImgURL};
};

export default usePreviewImg
