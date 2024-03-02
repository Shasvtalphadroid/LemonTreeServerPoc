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
    const rooms = await Rooms.find()
    console.log(rooms)
    res.status(200).json(rooms)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * Fetch rooms based on user preferences
 * @param {Object} pref - The preferences object
 * @returns {Array} rooms - An array of rooms matching the user preferences
 */
export const fetchRoomsByPrefrences = async (data, res) => {
  try {
    // Initialize an empty query object
    const query = {}

    // Destructure the data property from the request body

    // Check if smoking preference is provided
    if (data.smoking !== undefined) {
      // Set the feature1 property of the query based on the smoking preference
      query.feature1 = data.smoking ? "Smoking" : "Non-Smoking"
    }

    // Check if near_to_elevator preference is provided
    if (data.near_to_elevator !== undefined) {
      // Set the feature2 property of the query based on the near_to_elevator preference
      query.feature2 = data.near_to_elevator
        ? "Near to Elevator"
        : "Away from Elevator"
    }

    // Check if bed_type preference is provided
    if (data.bed_type !== undefined) {
      // Set the feature3 property of the query based on the bed_type preference
      query.feature3 = data.bed_type
    }

    // Check if roomType preference is provided
    if (data.roomType !== undefined) {
      // Set the roomType property of the query based on the roomType preference
      query.roomType = data.roomType
    }

    // Check if capacity preference is provided
    if (data.capacity !== undefined) {
      // Set the capacity property of the query based on the capacity preference
      query.capacity = data.capacity
    }
    const rooms = await Rooms.find(query)
    if (rooms.length === 0) {
      // If no rooms are found, return an error message
      return res.status(404).json({ message: "No rooms found" })
    }
    return rooms
  } catch (err) {
    // If no rooms are found, return an error message
    return res.status(404).json({ message: err.message })
  }
}

export const fetchRoomByPrefrences = async (data, res) => {
  try {
    // Initialize an empty query object
    const query = {
      alloted: false,
    }

    // Destructure the data property from the request body

    // Check if smoking preference is provided
    if (data.smoking !== undefined) {
      // Set the feature1 property of the query based on the smoking preference
      query.feature1 = data.smoking ? "Smoking" : "Non-Smoking"
    }

    // Check if near_to_elevator preference is provided
    if (data.near_to_elevator !== undefined) {
      // Set the feature2 property of the query based on the near_to_elevator preference
      query.feature2 = data.near_to_elevator
        ? "Near to Elevator"
        : "Away from Elevator"
    }

    // Check if bed_type preference is provided
    if (data.bed_type !== undefined) {
      // Set the feature3 property of the query based on the bed_type preference
      query.feature3 = data.bed_type
    }

    // Check if roomType preference is provided
    if (data.roomType !== undefined) {
      // Set the roomType property of the query based on the roomType preference
      query.roomType = data.roomType
    }

    // Check if capacity preference is provided
    if (data.capacity !== undefined) {
      // Set the capacity property of the query based on the capacity preference
      query.capacity = data.capacity
    }
    const rooms = await Rooms.findOne(query)
    if (rooms.length === 0) {
      // If no rooms are found, return an error message
      return res.status(404).json({ message: "No rooms found" })
    }
    return rooms
  } catch (err) {
    // If no rooms are found, return an error message
    return res.status(404).json({ message: err.message })
  }
}

/**
 * Fetch rooms based on user preferences
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const fetchRoomsByPref = async (req, res) => {
  // Destructure the data property from the request body
  const { data } = req.body

  try {
    // Fetch rooms based on the constructed query
    const rooms = await fetchRoomsByPrefrences(data, res)
    // Send a success response with the count and data of the fetched rooms
    res.status(200).json({
      message: "success",
      count: rooms.length,
      data: rooms,
    })
  } catch (error) {
    // Send a error response with the error message
    res.status(404).json({ message: error.message })
  }
}

export const findRoomAndUpdate = async (roomNumber ,isAlloted) => {
  const updateRoomStatus = await Rooms.findOneAndUpdate(
    {
      roomNumber: roomNumber,
    },
    {
      $set: {
        alloted: isAlloted,
      },
    }
  )
  return updateRoomStatus
}

export const findRoomByRoomNumber = async (roomNumber) => {
  const query = {
    roomNumber: roomNumber,
  }
  const room = await Rooms.findOne(query);
  return room
}

