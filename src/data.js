// rooms images
import Room1Img from './assets/img/room/exc-double.jpg';
import Room1ImgLg from './assets/img/room/exc-double.jpg';
import Room2Img from './assets/img/room/room-exc.jpg';
import Room2ImgLg from './assets/img/room/room-exc.jpg';
import Room3Img from './assets/img/room/family-room.jpg';
import Room3ImgLg from './assets/img/room/family-room.jpg';
import Room4Img from './assets/img/room/budget-family.jpg';
// import Room4ImgLg from './assets/img/rooms/4-lg.png';
import Room5Img from './assets/img/room/twin.jpg';
import Room5ImgLg from './assets/img/room/twin.jpg';
import Room6Img from './assets/img/room/exc-single.jpg';
import Room6ImgLg from './assets/img/room/exc-single.jpg';
// import Room7Img from './assets/img/rooms/7.png';
// import Room7ImgLg from './assets/img/rooms/7-lg.png';
// import Room8Img from './assets/img/rooms/8.png';
// import Room8ImgLg from './assets/img/rooms/8-lg.png';
// import icons
import {
  FaWifi,
  FaCoffee,
  FaBath,
  FaParking,
  FaSwimmingPool,
  FaHotdog,
  FaStopwatch,
  FaCocktail,
} from 'react-icons/fa';

export const roomData = [
  {
    id: 1,
    name: 'Executive Conference Block Double',
    description:
      'Accomdates 2 people.',
    facilities: [
      { name: 'Wifi', icon: <FaWifi /> },
      { name: 'Coffee', icon: <FaCoffee /> },
      { name: 'Bath', icon: <FaBath /> },
      { name: 'Parking Space', icon: <FaParking /> },
      { name: 'Kids Swimming Pool', icon: <FaSwimmingPool /> },
      { name: 'Breakfast', icon: <FaHotdog /> },
      { name: 'Drinks', icon: <FaCocktail /> },
    ],
    size: '6x6',
    maxPerson: 3,
    price: 80,
    image: Room1Img,
    imageLg: Room1ImgLg,
  },
  {
    id: 2,
    name: 'Executive RBLK & Cottages',
    description:
      'Occupied by either family,couple or group of people',
    facilities: [
      { name: 'Wifi', icon: <FaWifi /> },
      { name: 'Coffee', icon: <FaCoffee /> },
      { name: 'Bath', icon: <FaBath /> },
      { name: 'Parking Space', icon: <FaParking /> },
      { name: 'Swimming Pool', icon: <FaSwimmingPool /> },
      { name: 'Breakfast', icon: <FaHotdog /> },
      { name: 'Drinks', icon: <FaCocktail /> },
    ],
    size: 70,
    maxPerson: 2,
    price: 65,
    image: Room2Img,
    imageLg: Room2ImgLg,
  },
  {
    id: 3,
    name: 'Family Room',
    description:
      'Its occupied by Family members of 4 or group of 4.',
    facilities: [
      { name: 'Wifi', icon: <FaWifi /> },
      { name: 'Coffee', icon: <FaCoffee /> },
      { name: 'Bath', icon: <FaBath /> },
      { name: 'Parking Space', icon: <FaParking /> },
      { name: 'Swimming Pool', icon: <FaSwimmingPool /> },
      { name: 'Breakfast', icon: <FaHotdog /> },
      { name: 'Drinks', icon: <FaCocktail /> },
    ],
    size: 70,
    maxPerson: 4,
    price: 100,
    image: Room3Img,
    imageLg: Room3ImgLg,
  },
  {
    id: 4,
    name: 'Economy Room',
    description:
      'Occupied by one person.',
    facilities: [
      { name: 'Wifi', icon: <FaWifi /> },
      { name: 'Coffee', icon: <FaCoffee /> },
      { name: 'Bath', icon: <FaBath /> },
      { name: 'Parking Space', icon: <FaParking /> },
      { name: 'Swimming Pool', icon: <FaSwimmingPool /> },
      { name: 'Breakfast', icon: <FaHotdog /> },
      { name: 'Drinks', icon: <FaCocktail /> },
    ],
    size: 32,
    maxPerson: 1,
    price: 45,
    image: Room4Img,
    imageLg: Room4Img,
  },
  {
    id: 5,
    name: 'Deluxe Twin Room',
    description:
      'Occupied by  two persons .',
    facilities: [
      { name: 'Wifi', icon: <FaWifi /> },
      { name: 'Coffee', icon: <FaCoffee /> },
      { name: 'Bath', icon: <FaBath /> },
      { name: 'Parking Space', icon: <FaParking /> },
      { name: 'Kids Swimming Pool', icon: <FaSwimmingPool /> },
      { name: 'Breakfast', icon: <FaHotdog /> },
      { name: 'Drinks', icon: <FaCocktail /> },
    ],
    size: 32,
    maxPerson: 2,
    price: 120,
    image: Room5Img,
    imageLg: Room5ImgLg,
  },
  {
    id: 6,
    name: 'Conference Single',
    description:
      'One person .',
    facilities: [
      { name: 'Wifi', icon: <FaWifi /> },
      { name: 'Coffee', icon: <FaCoffee /> },
      { name: 'Bath', icon: <FaBath /> },
      { name: 'Parking Space', icon: <FaParking /> },
      { name: 'Swimming Pool', icon: <FaSwimmingPool /> },
      { name: 'Breakfast', icon: <FaHotdog /> },
      { name: 'GYM', icon: <FaStopwatch /> },
      { name: 'Drinks', icon: <FaCocktail /> },
    ],
    size: 45,
    maxPerson: 2,
    price: 65,
    image: Room6Img,
    imageLg: Room6ImgLg,
  },
  // {
  //   id: 7,
  //   name: 'Luxury Room',
  //   description:
  //     'Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea ccusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.',
  //   facilities: [
  //     { name: 'Wifi', icon: <FaWifi /> },
  //     { name: 'Coffee', icon: <FaCoffee /> },
  //     { name: 'Bath', icon: <FaBath /> },
  //     { name: 'Parking Space', icon: <FaParking /> },
  //     { name: 'Swimming Pool', icon: <FaSwimmingPool /> },
  //     { name: 'Breakfast', icon: <FaHotdog /> },
  //     { name: 'GYM', icon: <FaStopwatch /> },
  //     { name: 'Drinks', icon: <FaCocktail /> },
  //   ],
  //   size: 84,
  //   maxPerson: 7,
  //   price: 389,
  //   image: Room7Img,
  //   imageLg: Room7ImgLg,
  // },
  // {
  //   id: 8,
  //   name: 'Deluxe Room',
  //   description:
  //     'Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.',
  //   facilities: [
  //     { name: 'Wifi', icon: <FaWifi /> },
  //     { name: 'Coffee', icon: <FaCoffee /> },
  //     { name: 'Bath', icon: <FaBath /> },
  //     { name: 'Parking Space', icon: <FaParking /> },
  //     { name: 'Swimming Pool', icon: <FaSwimmingPool /> },
  //     { name: 'Breakfast', icon: <FaHotdog /> },
  //     { name: 'GYM', icon: <FaStopwatch /> },
  //     { name: 'Drinks', icon: <FaCocktail /> },
  //   ],
  //   size: 48,
  //   maxPerson: 8,
  //   price: 499,
  //   image: Room8Img,
  //   imageLg: Room8ImgLg,
  // },
];
