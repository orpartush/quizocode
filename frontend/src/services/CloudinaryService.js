export const CloudinaryService = {
    uploadImg,
};

function uploadImg(uploaderValue) {
    const CLOUD_NAME = 'quizocode';
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', uploaderValue[0]);
    formData.append('upload_preset', 'oklr6qvc');

    return fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
    })
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.error(err));
}
