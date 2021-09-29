/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      username
      imageUri
      status
      expoPushToken
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        username
        imageUri
        status
        expoPushToken
        chatRoomUser {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getChatRoomUser = /* GraphQL */ `
  query GetChatRoomUser($id: ID!) {
    getChatRoomUser(id: $id) {
      id
      userID
      chatRoomID
      user {
        id
        name
        username
        imageUri
        status
        expoPushToken
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
export const listChatRoomUsers = /* GraphQL */ `
  query ListChatRoomUsers(
    $filter: ModelChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRoomUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        chatRoomID
        user {
          id
          name
          username
          imageUri
          status
          expoPushToken
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
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
          expoPushToken
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
export const listChatRooms = /* GraphQL */ `
  query ListChatRooms(
    $filter: ModelChatRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
        expoPushToken
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          expoPushToken
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
      nextToken
    }
  }
`;
export const messagesByChatRoom = /* GraphQL */ `
  query MessagesByChatRoom(
    $chatRoomID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByChatRoom(
      chatRoomID: $chatRoomID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          expoPushToken
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
      nextToken
    }
  }
`;
