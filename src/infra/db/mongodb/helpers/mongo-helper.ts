/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string | undefined,

  async connect (uri: string | undefined): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    delete this.client
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }

    return this.client.db().collection(name)
  },

  map (data: any): any {
    const { _id, ...collectionWithoutId } = data
    return Object.assign({}, collectionWithoutId, { id: _id })
  },

  mapCollection (collection: any[]): any[] {
    return collection.map(document => MongoHelper.map(document))
  }
}
