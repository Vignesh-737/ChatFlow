# ChatFlow TODO

> Goal: Build a production-ready real-time chat application.

---

## 🚀 Phase 1 - Core Messaging (Current Sprint)

### Send Messages
- [ ] Connect message input to backend
- [ ] POST /messages
- [ ] Optimistic UI update
- [ ] Handle send failures
- [ ] Clear input after successful send

### Fetch Messages
- [ ] Create GET /messages/:conversationId
- [ ] Load messages when conversation opens
- [ ] Show loading state
- [ ] Handle empty conversations

### Auto Scroll
- [ ] Scroll to bottom after initial load
- [ ] Scroll after sending a message
- [ ] Scroll when receiving a new message

---

## ⚡ Phase 2 - Real-time Communication

### Socket.IO
- [ ] Connect socket after login
- [ ] Join conversation room
- [ ] Receive new messages
- [ ] Send messages through socket
- [ ] Prevent duplicate messages

### Typing Indicator
- [ ] Emit typing event
- [ ] Emit stop typing event
- [ ] Show "User is typing..."
- [ ] Debounce typing events

### Online Status
- [ ] Track connected users
- [ ] Show online/offline indicator
- [ ] Update status in real time

---

## 💬 Phase 3 - Conversations

### New Conversation
- [ ] Search users
- [ ] Create conversation
- [ ] Prevent duplicate conversations
- [ ] Open newly created conversation

### Conversation List
- [ ] Update last message
- [ ] Move active conversation to top
- [ ] Show unread message count

---

## 📎 Phase 4 - Attachments

### File Upload
- [ ] Upload images
- [ ] Upload documents
- [ ] Display attachments
- [ ] Download attachments

---

## ✅ Phase 5 - Read Receipts

- [ ] Message delivered
- [ ] Message seen
- [ ] Seen timestamp

---

## 🔔 Phase 6 - Notifications

- [ ] Unread badges
- [ ] Browser notifications
- [ ] Sound notification (optional)

---

## 🔒 Phase 7 - Security

- [ ] Validate JWT on sockets
- [ ] Conversation authorization
- [ ] Rate limit message sending
- [ ] Input validation

---

## 🧪 Phase 8 - Testing

- [ ] Test authentication
- [ ] Test messaging
- [ ] Test Socket.IO
- [ ] Test authorization
- [ ] Handle edge cases

---

## 🚀 Phase 9 - Deployment

### Docker
- [ ] Dockerize backend
- [ ] Dockerize frontend
- [ ] Docker Compose

### Production
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure environment variables
- [ ] Configure CORS

---

## 📖 Phase 10 - Documentation

- [ ] Update README
- [ ] API documentation
- [ ] Architecture diagram
- [ ] Screenshots
- [ ] Demo GIF

---

# 🎯 MVP Checklist

- [ ] Authentication
- [ ] Conversation List
- [ ] Send Messages
- [ ] Fetch Messages
- [ ] Real-time Messaging
- [ ] Typing Indicator
- [ ] Online Status
- [ ] Create Conversation
- [ ] File Upload
- [ ] Read Receipts
- [ ] Responsive UI
- [ ] Docker
- [ ] Deployment