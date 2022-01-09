import React, {useState, useEffect} from 'react'
import { Image } from 'react-native'
import { s3URL as s3URLAPI } from "../api"
import { useAuthState } from '../context/authContext'

const ImageS3 = ({style, url}) => {
    const { userToken } = useAuthState()
    const [image, setImage] = useState(null)

    useEffect(()=>{
        if(url) getS3URL()
    },[url])

    function getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
      }
    async function getS3URL () {
        const firstIndex = getPosition(url, '/', 3) 
        const substring = url.substring(firstIndex + 1, url.length)
        const res = await s3URLAPI(userToken, substring)
        setImage(res.data.url)
    }

    return (
        <Image style={{...style}} source={{uri: image}} />
    )
}

export default ImageS3