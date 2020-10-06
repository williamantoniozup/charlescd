/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CredentialProviderChain, config } from 'aws-sdk'

const getAwsCredentials = (callback) => {
  const authProvider = new CredentialProviderChain()

  authProvider.resolve((err, credentials) => {
    if (err) {
      console.log('Error to get cretentials from web token', err)
    }
    config.credentials = credentials
    config.update({ region: process.env.REGION })
    callback(credentials)
  })
}

export default getAwsCredentials
