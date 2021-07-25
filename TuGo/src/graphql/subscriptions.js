/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      name
      username
      imageUri
      status
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      name
      username
      imageUri
      status
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      name
      username
      imageUri
      status
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateChatRoomUser = /* GraphQL */ `
  subscription OnCreateChatRoomUser {
    onCreateChatRoomUser {
      id
      userID
      chatRoomID
      user {
        id
        name
        username
        imageUri
        status
        chatRoomUser {
          nextToken
        }
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUsers {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        seen
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateChatRoomUser = /* GraphQL */ `
  subscription OnUpdateChatRoomUser {
    onUpdateChatRoomUser {
      id
      userID
      chatRoomID
      user {
        id
        name
        username
        imageUri
        status
        chatRoomUser {
          nextToken
        }
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUsers {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        seen
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteChatRoomUser = /* GraphQL */ `
  subscription OnDeleteChatRoomUser {
    onDeleteChatRoomUser {
      id
      userID
      chatRoomID
      user {
        id
        name
        username
        imageUri
        status
        chatRoomUser {
          nextToken
        }
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUsers {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        seen
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateChatRoom = /* GraphQL */ `
  subscription OnCreateChatRoom {
    onCreateChatRoom {
      id
      chatRoomUsers {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
        }
        nextToken
      }
      messages {
        items {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        nextToken
      }
      lastMessageID
      lastMessage {
        seen
        id
        createdAt
        content
        userID
        chatRoomID
        user {
          id
          name
          username
          imageUri
          status
          createdAt
          updatedAt
        }
        chatRoom {
          id
          lastMessageID
          seen
          createdAt
          updatedAt
        }
        type
        updatedAt
      }
      seen
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateChatRoom = /* GraphQL */ `
  subscription OnUpdateChatRoom {
    onUpdateChatRoom {
      id
      chatRoomUsers {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
        }
        nextToken
      }
      messages {
        items {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        nextToken
      }
      lastMessageID
      lastMessage {
        seen
        id
        createdAt
        content
        userID
        chatRoomID
        user {
          id
          name
          username
          imageUri
          status
          createdAt
          updatedAt
        }
        chatRoom {
          id
          lastMessageID
          seen
          createdAt
          updatedAt
        }
        type
        updatedAt
      }
      seen
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteChatRoom = /* GraphQL */ `
  subscription OnDeleteChatRoom {
    onDeleteChatRoom {
      id
      chatRoomUsers {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
        }
        nextToken
      }
      messages {
        items {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        nextToken
      }
      lastMessageID
      lastMessage {
        seen
        id
        createdAt
        content
        userID
        chatRoomID
        user {
          id
          name
          username
          imageUri
          status
          createdAt
          updatedAt
        }
        chatRoom {
          id
          lastMessageID
          seen
          createdAt
          updatedAt
        }
        type
        updatedAt
      }
      seen
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
      seen
      id
      createdAt
      content
      userID
      chatRoomID
      user {
        id
        name
        username
        imageUri
        status
        chatRoomUser {
          nextToken
        }
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUsers {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        seen
        createdAt
        updatedAt
      }
      type
      updatedAt
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      seen
      id
      createdAt
      content
      userID
      chatRoomID
      user {
        id
        name
        username
        imageUri
        status
        chatRoomUser {
          nextToken
        }
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUsers {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        seen
        createdAt
        updatedAt
      }
      type
      updatedAt
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      seen
      id
      createdAt
      content
      userID
      chatRoomID
      user {
        id
        name
        username
        imageUri
        status
        chatRoomUser {
          nextToken
        }
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUsers {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          seen
          id
          createdAt
          content
          userID
          chatRoomID
          type
          updatedAt
        }
        seen
        createdAt
        updatedAt
      }
      type
      updatedAt
    }
  }
`;
