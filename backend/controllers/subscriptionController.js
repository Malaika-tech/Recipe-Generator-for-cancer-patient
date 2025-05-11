const Subscription = require("../models/Subscription")

exports.subscribeNutritionist = async (req, res) => {
  try {
    const { nutritionistId } = req.body
    const patientId = req.user.id // Assuming req.user is populated by auth middleware

    const subscription = new Subscription({
      patient: patientId,
      nutritionist: nutritionistId,
      startDate: new Date(),
      status: "active",
    })

    await subscription.save()

    res.json({
      success: true,
      message: "Subscription successful",
      subscriptionId: subscription._id,
    })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
}

exports.getPatientSubscriptions = async (req, res) => {
  try {
    const patientId = req.user.id

    const subscriptions = await Subscription.find({ patient: patientId }).populate(
      "nutritionist",
      "fullName specialization profilePicture",
    )

    res.json({ subscriptions })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
}
