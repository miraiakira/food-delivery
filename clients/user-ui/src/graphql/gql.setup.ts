import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import cookies from 'js-cookie'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URI
})

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      accesstoken: cookies.get('access_token'),
      refreshtoken: cookies.get('refresh_token')
    }
  })

  return forward(operation)
})

export const graphqlClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache()
})
