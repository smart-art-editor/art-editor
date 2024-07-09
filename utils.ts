import axios from "axios";
const apiKey = process.env.NEXT_PUBLIC_VIDEO_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_VIDEO_API_SECRET;
    
export const getvids = async () => {
    try {
      
        const response = await axios.get(`https://api.thetavideoapi.com/video/${apiKey}/list`, {
            headers: {
                'x-tva-sa-id': apiKey,
                'x-tva-sa-secret': apiSecret
            }
        });
        console.log('vidssssssssssssssss',response.data.body)
        return response.data.body;
    } catch (error) {
        console.error('Error fetching signed URL:', error);
    }
}