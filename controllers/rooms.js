import Rooms from "../models/rooms.js";

export const addRooms = async (req, res) => {
    const { roomNumber, roomType, roomStatus, roomPrice, feature1, feature2, feature3,capacity } = req.body;
    const newRoom = new Rooms({ roomNumber, roomType, roomStatus, roomPrice, feature1, feature2, feature3, capacity });
    console.log(newRoom);
    try {
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
export const fetchRooms = async (req, res) => {
    try {
        const rooms = await Rooms.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}