const Message = require("../models/Message")
const User = require("../models/User") // Assuming User model exists

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body
    const senderId = req.user.id

    const message = await Message.create({ senderId, receiverId, content })

    res.json({
      success: true,
      message: "Message sent successfully",
      messageId: message._id,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send message" })
  }
}

// Get Conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ sentAt: -1 })

    const conversationMap = new Map()

    messages.forEach((msg) => {
      const otherUserId = msg.senderId.toString() === userId ? msg.receiverId.toString() : msg.senderId.toString()

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          id: otherUserId,
          lastMessage: {
            content: msg.content,
            sentAt: msg.sentAt,
            isRead: msg.isRead,
          },
          unreadCount: 0,
        })
      }
      if (!msg.isRead && msg.receiverId.toString() === userId) {
        conversationMap.get(otherUserId).unreadCount++
      }
    })

    const conversations = await Promise.all(
      Array.from(conversationMap.entries()).map(async ([otherUserId, convo]) => {
        const user = await User.findById(otherUserId).select("fullName profilePicture")
        return {
          id: convo.id,
          with: user,
          lastMessage: convo.lastMessage,
          unreadCount: convo.unreadCount,
        }
      }),
    )

    res.json({ conversations })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch conversations" })
  }
}

// Get Messages of a Conversation
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id
    const { conversationId } = req.params
    const { before, limit = 20 } = req.query

    const conditions = {
      $or: [
        { senderId: userId, receiverId: conversationId },
        { senderId: conversationId, receiverId: userId },
      ],
    }
    if (before) {
      conditions.sentAt = { $lt: new Date(before) }
    }

    const messages = await Message.find(conditions)
      .sort({ sentAt: -1 })
      .limit(Number.parseInt(limit))
      .populate("senderId", "fullName")

    const formatted = messages.map((msg) => ({
      id: msg._id,
      sender: {
        id: msg.senderId._id,
        fullName: msg.senderId.fullName,
      },
      content: msg.content,
      sentAt: msg.sentAt,
      isRead: msg.isRead,
    }))

    res.json({ messages: formatted })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" })
  }
}

// Mark Message as Read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    await Message.findByIdAndUpdate(id, { isRead: true })

    res.json({
      success: true,
      message: "Message marked as read",
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark message as read" })
  }
}
