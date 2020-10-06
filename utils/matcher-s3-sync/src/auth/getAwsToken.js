/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CredentialProviderChain, config, TokenFileWebIdentityCredentials } from 'aws-sdk'

const getAwsCredentials = (callback) => {
  const webIdentity = new TokenFileWebIdentityCredentials()
  const authProvider = new CredentialProviderChain([webIdentity])

  authProvider.resolve((err, credentials) => {
    if (err) {
      callback()
      console.log('Error to get cretentials from web token', err)
    }
    config.credentials = credentials
  })
}

export default getAwsCredentials
