import React, {useState, useEffect} from "react";
import { useAuthState } from "../../context/authContext";

export default useFollow = (id) => {
    const [isFollowing, setIsFollowing] = setState(false);
    const { userToken, self } = useAuthState();
    useEffect(() => {
        async function getIsFollowing(id) {
            if(id){
            const res = await getFollowingAPI(userToken, self.id);
            console.log(res.data);
            const ids = res.data.map(item => item.following);
            console.log(ids.includes(id));
            setIsFollowing(ids.includes(id));
            }
        }
        getIsFollowing(id);
    }, [id]);
    async function changeFollow(id) {
        if(id){
        const res = await changeFollowAPI(userToken, id);
        console.log(res);
        }
    }

    return { isFollowing, changeFollow };
}
