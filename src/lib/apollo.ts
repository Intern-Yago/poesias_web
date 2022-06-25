import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: 'https://api-sa-east-1.graphcms.com/v2/cl4tued1s08c501unhjragkgl/master',
    cache: new InMemoryCache()
})