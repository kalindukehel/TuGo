import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { s3ImageURL as s3ImageURLAPI } from "../api";
import { useAuthState } from "../context/authContext";

const ImageS3 = ({ style, accountId }) => {
  const { userToken } = useAuthState();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (accountId) getS3ImageURL();
  }, [accountId]);

  async function getS3ImageURL() {
    const res = await s3ImageURLAPI(userToken, accountId);
    setImage(res.data.url);
  }

  return <Image style={{ ...style }} source={{ uri: image }} />;
};

export default ImageS3;
