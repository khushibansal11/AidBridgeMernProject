// src/components/RegisterLogin.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, completeProfile } from '../../actions/userActions';
import "./CompleteProfile.css"
import { Country, State, City } from "country-state-city";
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom";
import Loader from '../Layout/Loader';
// import logo from "../../images/logo.jpg"
import { toast} from 'react-hot-toast';

const CompleteProfile = () => {
    const { loading, error, user } = useSelector((state) => state.user);

    const isSeeker = (user.role === "Seeker");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState({});
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [phoneNo, setphoneNo] = useState();
    const [bio, setBio] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (country) {
            setState('');
            setCity('');
            setLocation((prev) => ({ ...prev, country }));
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            setCity('');
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('location', JSON.stringify(location));
        phoneNo && formData.set('phoneNo', phoneNo);
        if (!isSeeker) {
            formData.set('bio', bio);
        }
        dispatch(completeProfile(formData));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (user && user.completeProfile) {
            navigate("/profile");
        }

    }, [error, dispatch, user, navigate]);

    return (
        loading ? <Loader /> :
            (
                <div className="completeProfileContainer">
                    {/* <div className="frontImg" style={{ height: isSeeker ? "56%" : "64%" }}>
                        <img src={logo} alt="Logo" />
                    </div> */}
                    <div className="completeProfileBox">

                        <div className="completeProfileForm">
                            <h2>Complete Your Profile</h2>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="seekerLocation formGroup">
                                    <PublicIcon className='icon' />
                                    <select
                                        required
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option value="" disabled >Country</option>
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
                                        <option disabled value="">State</option>
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
                                        <option disabled value="">City</option>
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
                                        <p>Latitude: {latitude}, Longitude: {longitude}</p>
                                    )}
                                </div>

                                <div className="seekerPhoneNo formGroup">
                                    <PhoneIcon className='icon' />
                                    <input type="number" placeholder='Phone Number' name="phoneNo" value={phoneNo} onChange={(e) => setphoneNo(e.target.value)} required/>
                                </div>

                                {
                                    !isSeeker ? (
                                        <div className="HelperBio formGroup">
                                            <CreateIcon className='icon' />
                                            <input placeholder='Bio' type="text" id="bio" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                                        </div>)
                                        : null
                                }

                                <div className="completeProfileSubmit formGroup">
                                    <input type="submit" value="Submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
    );
}

export default CompleteProfile



