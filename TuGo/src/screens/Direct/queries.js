export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      imageUri
      status
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
          chatRoom {
            id
            chatRoomUsers {
              items {
                user {
                  id
                  name
                  imageUri
                  status
                }
              }
            }
            lastMessage {
              id
              type
              content
              updatedAt
              user {
                id
                name
              }
            }
            seen
          }
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const getChatRoom = /* GraphQL */ `
  query getChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      chatRoomUsers {
        items {
          user {
            id
            expoPushToken
          }
        }
      }
      seen
    }
  }
`;

