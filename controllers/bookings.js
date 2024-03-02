import bookings from "../models/bookings.js"
import Bookings from "../models/bookings.js"
import CheckoutDue from "../models/checkoutDue.js"
import rooms from "../models/rooms.js"
import Room from "../models/rooms.js"
import {
  fetchRoomByPrefrences,
  findRoomAndUpdate,
  findRoomByRoomNumber,
} from "./rooms.js"

export const bookingidSearch = async (req, res) => {
  try {
    const booking = await Bookings.findOne({ bookingId: req.query.bookingId })
    if (booking) res.status(200).json(Boolean(true))
    else res.status(200).json(Boolean(false))
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

export const bookingnameSearch = async (req, res) => {
  try {
    const booking = await Bookings.findOne({ name: req.query.bookingName })
    if (booking) res.status(200).json(Boolean(true))
    else res.status(200).json(Boolean(false))
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const addDetails = async (req, res) => {
  try {
    const booking = new Bookings(req.body)
    await booking.save()
    res.status(200).json(booking)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getDetails = async (req, res) => {
  console.log(req.query.bookingName)
  try {
    const booking = await Bookings.findOne({ name: req.query.bookingName })
    if (!booking) res.status(401).json({ message: "No booking found" })
    else res.status(200).json(booking)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getDetailsNew = async (req, res) => {
  console.log(req.query.firstName)
  console.log(req.query.lastName)

  try {
    const booking = await Bookings.find({
      firstName: req.query.firstName,
      lastName: req.query.lastName,
    })
    if (!booking || booking.length === 0) res.status(401).json(parseInt(0))
    else {
      res.status(200).json(parseInt(booking.length))
      // res.status(200).json(booking);
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * Returns the bookings based on firstName and lastName
 * @param {object} req
 * @param {object} res
 */
export const getDetailsData = async (req, res) => {
  try {
    // find the bookings based on the query parameters
    const booking = await Bookings.find({
      firstName: req.query.firstName,
      lastName: req.query.lastName,
    })

    // if no booking is found or no bookings are found
    if (!booking || booking.length === 0) {
      // return a 401 status code and a JSON object with a message
      res.status(401).json({ message: "No booking found" })
    }
    // if at least one booking is found
    else {
      // return a 200 status code and the booking(s)
      res.status(200).json(booking)
    }
  } catch (error) {
    // return a 400 status code and a JSON object with an error message
    res.status(400).json({ message: error.message })
  }
}

export const getDetailsContact = async (req, res) => {
  console.log(req.query.phoneNumber)
  try {
    const booking = await Bookings.find({
      contactNumber: req.query.phoneNumber,
    })
    console.log("booking ", booking)
    if (!booking || booking.length === 0) res.status(401).json(parseInt(0))
    else {
      var updatedBooking = booking[0]
      for (var i = 1; i < booking.length; i++) {
        updatedBooking.adults += booking[i].adults
        updatedBooking.children += booking[i].children
      }
      res.status(200).json(updatedBooking)
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const editBookingDeatails = async (req, res) => {
  const { phoneNumber, guestName, idUploaded, editedGuestName } = req.body
  console.log(phoneNumber)
  try {
    const booking = await Bookings.findOne({ phoneNumber: phoneNumber })
    if (!booking) res.status(401).json({ message: "No booking found" })
    else {
      console.log("found booking", booking.guestList)
      booking.guestList.map((guest) => {
        if (guest.name === guestName) {
          guest.idUploaded = idUploaded
          guest.name = editedGuestName
          guest.inProcess = false
        }
      })
      await Bookings.findOneAndUpdate({ name: bookingName }, booking, {
        new: true,
      })
      res.status(200).json(booking)
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const checkEarly = async (req, res) => {
  const { checkIn, checkOut } = req.body
  console.log(req.body)
  try {
    const dateTimeCI = new Date(checkIn)
    const dateTimeCDT = new Date()
    const dateTimeCO = new Date(checkOut)

    if (dateTimeCDT >= dateTimeCI && dateTimeCDT <= dateTimeCO) {
      res.status(200).json(true)
    } else {
      res.status(404).json(false)
    }
  } catch (err) {
    res.status(404).json({ error: err })
  }
}

export const bookingDetailsForCheckout = async (req, res) => {
  const { lastName, roomNumber } = req.query
  console.log(req.body)
  try {
    const booking = await Bookings.findOne({
      lastName: lastName,
      roomNumber: roomNumber,
    })
    if (!booking) res.status(401).json({ message: "No booking found" })
    else res.status(200).json(booking)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}

/**
 * Fetches booking details based on the provided query parameters.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export const fetchBookingDetails = async (req, res) => {
  // Destructure query parameters from the request
  const { bookingId, firstName, lastName } = req.query
  console.log(req.query) // Log the query parameters

  try {
    let filter = {
      checkInStatus: "Pending",
      checkOutStatus: "Pending",
    }

    // Set filter based on provided query parameters
    if (bookingId) {
      filter.bookingId = bookingId
    } else if (firstName && lastName) {
      filter.firstName = firstName
      filter.lastName = lastName
    }

    // Find bookings based on the filter
    const bookings = await Bookings.find(filter)
    console.log("booking ", bookings)

    // Handle the case when no bookings are found
    if (bookings.length === 0) {
      res.status(401).json({ message: "No booking found" })
    } else {
      // Group the bookings based on contact number and send the grouped bookings in the response
      const groupedBookings = bookings.reduce((acc, booking) => {
        const existingBooking = acc.find(
          (cust) => cust.contactNumber === booking.contactNumber
        )
        if (existingBooking) {
          existingBooking.bookings.push(booking)
        } else {
          acc.push({
            contactNumber: booking.contactNumber,
            bookings: [booking],
          })
        }
        return acc
      }, [])
      res.status(200).json({
        message: "success",
        data: groupedBookings,
        count: groupedBookings.length,
      })
    }
  } catch (error) {
    // Handle any errors and send an error message in the response
    res.status(400).json({ message: error.message })
  }
}

/**
 * Update booking details based on the flow type (checkin or checkout)
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const updateBookingDetails = async (req, res) => {
  // Destructure data and flowType from the request body
  const { data, flowType } = req.body

  try {
    // Initialize response object
    let response = {
      bookings: [],
    }

    // Fetch all bookings from the database
    const masterBookingData = await Bookings.find()

    if (flowType === "checkin") {
      // Update booking details for check-in flow
      await Promise.all(
        data.map(async (element) => {
          const {
            checkInStatus,
            amountPaid,
            adults,
            children,
            id,
            room_prefrence,
          } = element

          // Get current check-in time
          const checkInTime = new Date().toLocaleTimeString()

          let roomNumber
          const bookingData = masterBookingData.filter((data) => {
            const objectId = data._id
            const stringRepresentation = objectId.toString()
            return stringRepresentation === id
          })

          if (bookingData.length > 0) {
            const { roomType, adults } = bookingData[0]
            const { smoking, near_to_elevator, bed_type } = room_prefrence

            // Fetch available rooms based on preferences
            const query = {
              roomType,
              capacity: adults,
              smoking,
              near_to_elevator,
              bed_type,
            }
            const availableRooms = await fetchRoomByPrefrences(query, res)
            console.log("availableRooms :>>>", availableRooms)
            roomNumber = availableRooms.roomNumber
          }

          // Update booking in the database
          const booking = await Bookings.findOneAndUpdate(
            {
              _id: id,
            },
            {
              $inc: {
                amountPaid: parseInt(amountPaid),
                adultsCheckedIn: parseInt(adults),
                childrenCheckedIn: parseInt(children),
              },
              $set: {
                checkInStatus,
                checkInTime,
                roomNumber,
              },
            },
            {
              new: true,
            }
          )

          //   console.log("booking : updates ::>>>", booking)

          if (!booking) {
            res.status(401).json({ message: "No booking found" })
          } else {
            response.bookings.push(booking)

            // Update checkout due in the database
            await CheckoutDue.findOneAndUpdate(
              {
                bookingIdRef: id,
              },
              {
                $inc: {
                  amountPaid: parseInt(amountPaid),
                  roomRentDue: -parseInt(amountPaid),
                  totalDue: -parseInt(amountPaid),
                },
                $set: {
                  roomNumber,
                },
              }
            )

            // Update room status to 'alloted'
            const isAlloted = 1
            const updateRoomStatus = await findRoomAndUpdate(
              roomNumber,
              isAlloted
            )
            console.log("updateRoomStatus :>>>", updateRoomStatus)
          }
        })
      )

      // Send success response with updated data
      res.status(200).json({
        message: "success",
        data: response,
      })
    } else if (flowType === "checkout") {
      // Update booking details for checkout flow
      await Promise.all(
        data.map(async (element) => {
          const { id, amountPaid, roomNumber } = element

          // Get current checkout time
          const checkoutTime = new Date().toLocaleTimeString()

          // Update booking in the database
          const booking = await Bookings.findOneAndUpdate(
            {
              _id: id,
            },
            {
              $inc: {
                amountPaid: parseInt(amountPaid),
              },
              $set: {
                checkOutStatus: "checked-out",
                checkoutTime,
                roomNumber,
              },
            },
            {
              new: true,
            }
          )

          if (!booking) {
            res.status(401).json({ message: "No booking found" })
          } else {
            // Update checkout due in the database
            await CheckoutDue.findOneAndUpdate(
              {
                bookingIdRef: id,
              },
              {
                $inc: {
                  amountPaid: parseInt(amountPaid),
                  roomRentDue: -parseInt(amountPaid),
                  totalDue: -parseInt(amountPaid),
                },
                $set: {
                  checkOutStatus: "checked-out",
                },
              }
            )
            // Update room status to 'alloted'
            const isAlloted = 0
            const updateRoomStatus = await findRoomAndUpdate(
              roomNumber,
              isAlloted
            )
          }
        })
      )

      // Send success response
      res.status(200).json({
        message: "success",
      })
    }
  } catch (error) {
    // Send error response
    res.status(400).json({ message: error.message })
  }
}

/**
 * Retrieves booking details for checkout based on the provided last name and room number.
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
export const getBookingDetailsForCheckout = async (req, res) => {
  // Extract last name and room number from the request query
  const { lastName, roomNumber } = req.query

  try {
    // Find bookings based on the filter
    const bookings = await Bookings.find({
      lastName,
      checkInStatus: "Confirmed",
      checkOutStatus: "Pending",
    })

    // Retrieve checkout due data for each booking
    const checkoutDueData = await Promise.all(
      bookings.map(async (booking) => {
        let obj = { booking }
        const { lastName, roomNumber } = booking
        const bookingdue = await findDataInCheckoutDue(roomNumber, lastName)
        if (bookingdue) {
          obj.bookingDues = bookingdue
        }
        return obj
      })
    )

    // Log the checkout due data
    console.log("checkoutDueData", checkoutDueData)

    // Send the retrieved data as a JSON response
    res.status(200).json({
      message: "success",
      data: checkoutDueData,
    })
  } catch (error) {
    // Send error message as a JSON response
    res.status(400).json({ message: error.message })
  }
}

// Function to find data in CheckoutDue
const findDataInCheckoutDue = async (roomNumber, lastName) => {
  const filteredData = {
    roomNumber,
    lastName,
    checkOutStatus: "Pending",
  }
  const data = await CheckoutDue.findOne(filteredData)
  //   console.log("data >>>", data);
  return data
}
