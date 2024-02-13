import React from 'react';
import Rooms from '../components/Rooms';
import { Helmet } from 'react-helmet'; // Import Helmet for managing document head

const RoomPages = () => {
    return (
        <>
            <Helmet>
                <title>Rooms | Peniel Beach Hotel</title>
                <meta name="description" content="Explore our comfortable and luxurious rooms at Peniel Beach Hotel. Book now for a relaxing stay!" />
            </Helmet>
            <Rooms />
        </>
    );
}

export default RoomPages;
