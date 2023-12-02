'use client'

import { gql, DocumentNode } from '@apollo/client'

export const GET_USER: DocumentNode = gql`
  query {
    getLoggedInUser {
      user {
        id
        email
        name
        address
        avatar {
          url
        }
        phone_number
      }
      accessToken
      refreshToken
    }
  }
`
