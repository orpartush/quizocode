import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from '../store/contexts/UserContext';
import { UserService } from '../services/UserService.js';
import { CloudinaryService } from '../services/CloudinaryService.js';

import { Multiselect } from 'multiselect-react-dropdown';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import ReactTooltip from 'react-tooltip';
import { AiOutlineInfoCircle } from 'react-icons/ai';

function EditProfilePage() {
    const options = [
        { name: 'Javascript', id: 'Javascript' },
        { name: 'React.js', id: 'React.js' },
        { name: 'Angular.js', id: 'Angular.js' },
        { name: 'Vue.js', id: 'Vue.js' },
        { name: 'Redux', id: 'Redux' },
        { name: 'Vuex', id: 'Vuex' },
        { name: 'Electron.js', id: 'Electron.js' },
        { name: 'SCSS', id: 'SCSS' },
        { name: 'CSS3', id: 'CSS3' },
        { name: 'HTML5', id: 'HTML5' },
        { name: 'Node.js', id: 'Node.js' },
        { name: 'MongoDB', id: 'MongoDB' },
        { name: 'MySQL', id: 'MySQL' },
        { name: 'JQuery', id: 'JQuery' },
        { name: 'Cordova.js', id: 'Cordova.js' },
        { name: 'Java', id: 'Java' },
        { name: 'C', id: 'C' },
        { name: 'C++', id: 'C++' },
        { name: 'C#', id: 'C#' },
        { name: 'Python', id: 'Python' },
        { name: 'Django', id: 'Django' },
        { name: '.NET', id: '.NET' },
        { name: 'Git', id: 'Git' },
        { name: 'Bitbucket', id: 'Bitbucket' },
        { name: 'NPM', id: 'NPM' },
        { name: 'Bootstrap', id: 'Bootstrap' },
    ];
    const { loggedInUser, updateUser } = useContext(UserContext);
    const [uploaderValue, setUploaderValue] = useState('');
    const [user, setUser] = useState(null);
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [profileImg, setProfileImg] = useState('');

    const params = useParams();
    const history = useHistory();
    const tooltipTxt = '1 : 1 ratio is preferred.';

    const { register, handleSubmit } = useForm({
        mode: 'onBlur',
        validationSchema: Yup.object({
            name: Yup.string().min(2, 'Name must have minimum of 2 characters').required(),
        }),
    });

    useEffect(() => {
        const userId = params.id;
        const getCurrUser = async userId => {
            let currUser = await UserService.getUser(userId);
            let currUserTechs = currUser.techs.map(tech => {
                return { name: tech, id: tech };
            });
            setSelectedTechs(currUserTechs);
            if (currUser) {
                setUser(currUser);
                setProfileImg(currUser.imgUrl);
            } else history.replace('/err-page');
        };
        getCurrUser(userId);
    }, []);

    const onSubmit = async editedData => {
        editedData.techs = selectedTechs.map(selectedTech => selectedTech.name);
        const updatedUser = { ...loggedInUser, ...editedData, imgUrl: profileImg };
        await updateUser(updatedUser);

        history.push(`/profile/${user._id}`);
        Swal.fire('Profile updated successfully', '', 'success');
    };

    const onSelect = (selectedList, selectedItem) => {
        console.log('selectedItem:', selectedItem);
        setSelectedTechs([...selectedTechs, selectedItem]);
    };

    const onRemove = (selectedList, removedItem) => {
        setSelectedTechs(selectedList);
    };

    useEffect(() => {
        const onImgChange = async () => {
            const cloudinaryRes = await CloudinaryService.uploadImg(uploaderValue);
            setProfileImg(cloudinaryRes.url);
        };
        if (uploaderValue === '') return;
        onImgChange();
    }, [uploaderValue]);

    return (
        <div className="edit-profile-page container">
            <header className="flex align-center">
                <div className="flex justify-center align-center">
                    <img src={profileImg} alt="" />
                    <p className="title">Editing Profile</p>
                </div>
            </header>
            {user ? (
                <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                    <div className="uploader-label-wrapper flex align-center">
                        <label className="uploader" htmlFor="uploader">
                            Change picture
                        </label>
                        <span className="tip-icon">
                            <AiOutlineInfoCircle data-tip={tooltipTxt} />
                            <ReactTooltip place="top" type="dark" effect="float" multiline={true} className="tooltip" />
                        </span>
                    </div>
                    <input
                        type="file"
                        name="uploader"
                        id="uploader"
                        className="img-uploader"
                        onChange={e => setUploaderValue(e.target.files)}
                    />
                    <label htmlFor="name" className="flex flex-column">
                        <span>Name:</span>
                        <input type="text" name="name" defaultValue={user.name} ref={register} />
                    </label>
                    <label htmlFor="role" className="flex flex-column">
                        <span>Role:</span>
                        <input type="text" name="role" defaultValue={user.role} ref={register} />
                    </label>
                    <label htmlFor="techs">
                        <span>Techs:</span>
                        <Multiselect
                            options={options}
                            selectedValues={selectedTechs}
                            onSelect={onSelect}
                            onRemove={onRemove}
                            displayValue="name"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            style={{
                                multiselectContainer: {
                                    minWidth: '100%',
                                },
                                inputField: {
                                    borderRadius: '5px',
                                    width: '100px',
                                },
                                chips: {
                                    width: 'fit-content',
                                    backgroundColor: '#fc335d',
                                },
                            }}
                        />
                    </label>
                    <label htmlFor="summery" className="flex flex-column">
                        <span>Summery:</span>
                        <textarea type="text" name="summery" cols="60" rows="6" defaultValue={user.summery} ref={register} />
                    </label>
                    <section className="btns">
                        <button className="submit-btn" type="submit">
                            Save Changes
                        </button>
                        <Link className="cancel-btn" to={`/profile/${user._id}`}>
                            Cancel
                        </Link>
                    </section>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default EditProfilePage;
