import React,{useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Layout/Loader';
import "./updateProfile.css"
import { Country, State, City } from "country-state-city";
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import imageCompression from 'browser-image-compression';
import avatarImg from "../../images/Profile.png"
import {updateProfile,clearErrors} from "../../actions/userActions.js"
import { useNavigate } from 'react-router-dom';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants.js';
import { toast} from 'react-hot-toast';


const convertToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };


const UpdateProfile = () => {

    const { loading, error, user } = useSelector((state) => state.user);
    const {loading : profileLoading ,error :profileError, isUpdated } = useSelector((state)=>state.profile)
    const isSeeker = (user.role === "Seeker");

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar.url);
    const [avatar, setAvatar] = useState("");
    const [location, setLocation] = useState(user.location);
    const [city, setCity] = useState(user.location.city);
    const [state, setState] = useState(user.location.state);
    const [country, setCountry] = useState(user.location.country);
    const [latitude, setLatitude] = useState(user.location.latitude);
    const [longitude, setLongitude] = useState(user.location.longitude);
    const [phoneNo, setphoneNo] = useState(user.phoneNo);

    const dispatch = useDispatch();
    const navigate=useNavigate();

    useEffect(() => {
        if (country) {
            // setState('');
            // setCity('');
            setLocation((prev) => ({ ...prev, country }));
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            // setCity('');
            setLocation((prev) => ({ ...prev, state }));
        }
    }, [state]);

    useEffect(() => {
        if (city) {
            setLocation((prev) => ({ ...prev, city }));
        }
    }, [city]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setLocation((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
            }, () => {
                alert('Unable to retrieve your location');
            });
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };
    const handleAvatar=async(e)=>{
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            const file = e.target.files[0];
            let finalFile = file;
            if (!file) {
                setAvatar(avatarImg);
                return;
              }
            if(file && file.size > 500 * 1024){
              const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920, 
                useWebWorker: true, 
              };
              finalFile = await imageCompression(file, options);
            }
            reader.onload = () => {
              if (reader.readyState === 2) {
                setAvatar(reader.result);
                setAvatarPreview(reader.result);
              }
            };
            reader.readAsDataURL(finalFile);
          }
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);
        formData.set('location', JSON.stringify(location));
        phoneNo && formData.set('phoneNo', phoneNo);
        // if (!isSeeker) {
        //     formData.set('bio', bio);
        // }
        dispatch(updateProfile(formData));
    };

    useEffect(() => {
        if (error) {
          toast.error(error);
          dispatch(clearErrors());
        }
        if (profileError) {
          toast.error(profileError);
          dispatch(clearErrors());
        }
        if(isUpdated){
            navigate("/profile");
            dispatch({ type: UPDATE_PROFILE_RESET });
        }
        if (avatar === avatarImg) {
          convertToBase64(avatar, (result) => {
            setAvatar(result);
          });
        }
      }, [error,profileError,avatar,isUpdated,navigate,dispatch]);

    return (
        loading || profileLoading ? <Loader /> :
            (
                <div className="updateProfileContainer">
                    <div className="updateProfileBox">

                        <div className="updateProfileForm">
                            <h2>Update Profile</h2>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="updateName formGroup">
                                <PersonIcon className='icon' />
                                <input type="text" id="name" name="name" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="updateEmail formGroup">
                                <EmailIcon className='icon' />
                                <input type="email" id="email" placeholder='E-mail' name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                                <div className="seekerLocation formGroup">
                                    <PublicIcon className='icon' />
                                    <select
                                        required
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option value={country}>{country}</option>
                                        {Country &&
                                            Country.getAllCountries().map((item) => (
                                                <option key={item.isoCode} value={item.isoCode}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="seekerLocation formGroup">
                                    <TransferWithinAStationIcon className='icon' />

                                    <select
                                        required
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    >
                                        <option value={state}>{state}</option>
                                        {State &&
                                            State.getStatesOfCountry(country).map((item) => (
                                                <option key={item.isoCode} value={item.isoCode}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="seekerLocation formGroup">
                                    <LocationCityIcon className='icon' />
                                    <select
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        <option value={city}>{city}</option>
                                        {State &&
                                            City.getCitiesOfState(country, state).map((item) => (
                                                <option key={item.name} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="formGroup getLocationBtn">
                                    <button type="button" onClick={getLocation}>Get My Location</button>
                                    {latitude && longitude && (
                                        <p>&nbsp;( {latitude} , {longitude})</p>
                                    )}
                                </div>
                                
                            

                                <div className="seekerPhoneNo formGroup">
                                    <PhoneIcon className='icon' />
                                    <input type="number" placeholder='Phone Number' name="phoneNo" value={phoneNo} onChange={(e) => setphoneNo(e.target.value)} required />
                                </div>
                                <div className="registerAvatar formGroup">
                                <img src={avatarPreview} alt="Avatar Preview" />
                                <input type="file" accept="image/*" name="avatar" onChange={handleAvatar} />
                            </div>

                                {
                                    !isSeeker ? (
                                        <div className="HelperBio formGroup">
                                            {/* <CreateIcon className='icon' />
                                            <input placeholder='Bio' type="text" id="bio" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} /> */}
                                        </div>)
                                        : null
                                }

                                <div className="updateProfileSubmit formGroup">
                                    <input type="submit" value="Submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
    );
}

export default UpdateProfile
